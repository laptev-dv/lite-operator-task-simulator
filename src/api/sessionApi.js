import { STORAGE_KEYS, storage } from './storage';
import { calculateDetailedStats } from './sessionUtils'; // Вынесем сложную логику в отдельный файл
import { v4 as uuid } from 'uuid';

export const sessionApi = {
  // Создание новой сессии
  create: async (sessionData) => {
    try {
      const { experimentId, results, userId } = sessionData;
      
      // Проверяем существование эксперимента
      const experiment = storage.findById(STORAGE_KEYS.EXPERIMENTS, experimentId);
      if (!experiment) {
        throw { status: 404, message: 'Эксперимент не найден' };
      }

      // Проверяем задачи
      const taskIds = experiment.tasks.map(task => task.id);
      const invalidTasks = results.filter(r => !taskIds.includes(r.taskId));
      
      if (invalidTasks.length > 0) {
        throw { status: 400, message: 'Некоторые задачи не найдены в эксперименте' };
      }

      const filledResults = results.map(result => ({
          id: uuid(),
          taskId: result.taskId,
          presentations: result.presentations.map(p => ({
            correctAnswer: p.correctAnswer,
            userAnswer: p.userAnswer,
            responseTime: p.responseTime || 0,
            timestamp: p.timestamp || new Date().toISOString()
          })),
        }))

      // Создаем новую сессию
      const newSession = {
        experiment: experimentId,
        user: userId,
        createdAt: new Date().toISOString(),
        results: filledResults
      };

      // Сохраняем сессию
      const savedSession = storage.add(STORAGE_KEYS.SESSIONS, newSession);
      
      // Обновляем эксперимент (добавляем ссылку на сессию)
      storage.update(STORAGE_KEYS.EXPERIMENTS, experimentId, {
        sessions: [...(experiment.sessions || []), savedSession.id]
      });

      return { data: savedSession };

    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Получение всех сессий
  getAll: async ({ search = '', sortBy = 'createdAt' }) => {
    let sessions = storage.getAll(STORAGE_KEYS.SESSIONS);
    
    if (search) {
      sessions = sessions.filter(session => 
        session.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    sessions.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    sessions = sessions.map((session) => {
      const experiment = storage.findById(STORAGE_KEYS.EXPERIMENTS, session.experiment);

      return {
          ...session,
          experiment,
      }
    })

    return sessions;
  },

  // Получение сессии по ID
  getById: async (sessionId, userId) => {
    try {
      const session = storage.findById(STORAGE_KEYS.SESSIONS, sessionId);
      if (!session) {
        throw { status: 404, message: 'Сессия не найдена' };
      }

      const experiment = storage.findById(STORAGE_KEYS.EXPERIMENTS, session.experiment);

      // Добавляем данные задач к результатам
      const resultsWithTasks = session.results.map(result => ({
        ...result,
        task: experiment.tasks.find(t => t.id === result.taskId) || null
      }));

      // Рассчитываем статистику
      const detailedResults = calculateDetailedStats(resultsWithTasks);

      return {
        data: {
          ...session,
          experiment,
          results: detailedResults,
        }
      };
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Удаление сессии
  delete: async (sessionId, userId) => {
    try {
      const session = storage.findById(STORAGE_KEYS.SESSIONS, sessionId);
      if (!session) {
        throw { status: 404, message: 'Сессия не найдена' };
      }

      const experiment = storage.findById(STORAGE_KEYS.EXPERIMENTS, session.experiment);

      // Удаляем сессию
      storage.remove(STORAGE_KEYS.SESSIONS, sessionId);
      
      // Удаляем ссылку из эксперимента
      if (experiment) {
        storage.update(STORAGE_KEYS.EXPERIMENTS, experiment.id, {
          sessions: experiment.sessions?.filter(id => id !== sessionId) || []
        });
      }

      return { data: { message: 'Сессия успешно удалена' } };
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Экспорт сессии в PDF (заглушка для клиента)
  exportToPDF: async (sessionId, userId) => {
    try {
      // Получаем полные данные сессии
      const { data: session } = await sessionApi.getById(sessionId, userId);
      
      // В реальном приложении здесь был бы запрос к серверу для генерации PDF
      console.log('Generating PDF for session:', sessionId);
      
      // Возвращаем заглушку
      return {
        data: {
          success: true,
          sessionId,
          url: `data:application/pdf;base64,${btoa(JSON.stringify(session))}` // Заглушка
        }
      };
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};