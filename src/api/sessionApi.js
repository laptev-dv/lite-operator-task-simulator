import { STORAGE_KEYS, storage, calculateEfficiency } from './storage';

export const sessionApi = {
  create: async (sessionData) => {
    const experiment = storage.findById(STORAGE_KEYS.EXPERIMENTS, sessionData.experimentId);
    if (!experiment) throw new Error('Experiment not found');
    
    const newSession = {
      ...sessionData,
      id: undefined, // Будет сгенерирован в storage.add
      date: new Date().toISOString(),
      results: []
    };
    
    // Создаем сессию
    const createdSession = storage.add(STORAGE_KEYS.SESSIONS, newSession);
    
    // Обновляем счетчик сессий в эксперименте
    storage.update(STORAGE_KEYS.EXPERIMENTS, experiment.id, {
      sessionsCount: (experiment.sessionsCount || 0) + 1
    });
    
    return { data: createdSession };
  },

  getByExperiment: async (experimentId) => {
    const sessions = storage.findWhere(
      STORAGE_KEYS.SESSIONS,
      s => s.experimentId === experimentId
    );
    
    return { 
      data: sessions.map(session => ({
        ...session,
        isMine: true // Здесь можно добавить реальную проверку владельца
      }))
    };
  },

  delete: async (sessionId) => {
    const session = storage.findById(STORAGE_KEYS.SESSIONS, sessionId);
    if (!session) throw new Error('Session not found');
    
    // Уменьшаем счетчик сессий в эксперименте
    const experiment = storage.findById(STORAGE_KEYS.EXPERIMENTS, session.experimentId);
    if (experiment) {
      storage.update(STORAGE_KEYS.EXPERIMENTS, experiment.id, {
        sessionsCount: Math.max(0, (experiment.sessionsCount || 0) - 1)
      });
    }
    
    return storage.remove(STORAGE_KEYS.SESSIONS, sessionId);
  },

  getById: async (sessionId) => {
    const session = storage.findById(STORAGE_KEYS.SESSIONS, sessionId);
    if (!session) throw new Error('Session not found');
    
    return { 
      data: {
        ...session,
        efficiency: calculateEfficiency(session.results)
      }
    };
  },

  updateResults: async (sessionId, results) => {
    const updated = storage.update(STORAGE_KEYS.SESSIONS, sessionId, {
      results,
      duration: calculateDuration(results) // Можно добавить вычисление длительности
    });
    
    if (!updated) throw new Error('Session not found');
    return { data: updated };
  },

  exportToPDF: async (sessionId) => {
    const session = storage.findById(STORAGE_KEYS.SESSIONS, sessionId);
    if (!session) throw new Error('Session not found');
    
    // В реальном приложении здесь должна быть генерация PDF
    console.log('Exporting to PDF:', session);
    return { 
      data: {
        success: true,
        sessionId,
        url: `data:application/pdf;base64,${btoa(JSON.stringify(session))}` // Заглушка
      }
    };
  }
};

// Вспомогательная функция для расчета длительности
function calculateDuration(results = []) {
  if (!results.length) return 0;
  return results.reduce((total, task) => {
    return total + (task.duration || 0);
  }, 0);
}