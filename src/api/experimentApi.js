import { STORAGE_KEYS, storage, calculateEfficiency } from './storage';

export const experimentApi = {
  getAll: async ({ search = '', sortBy = 'createdAt' }) => {
    let experiments = storage.getAll(STORAGE_KEYS.EXPERIMENTS);
    
    if (search) {
      experiments = experiments.filter(exp => 
        exp.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    experiments.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    return {
      data: experiments.map(exp => ({
        ...exp,
        parameters: {
          efficiencyMin: exp.efficiencyMin,
          efficiencyMax: exp.efficiencyMax,
          initialTaskNumber: exp.initialTaskNumber,
          seriesTime: exp.seriesTime,
          presentationsPerTask: exp.presentationsPerTask
        },
        sessions: exp.sessionsCount || 0
      }))
    };
  },

  getById: async (id) => {
    const exp = storage.findById(STORAGE_KEYS.EXPERIMENTS, id);
    if (!exp) throw new Error('Experiment not found');
    
    const sessions = storage.findWhere(STORAGE_KEYS.SESSIONS, s => s.experimentId === id);
    
    return {
      data: {
        ...exp,
        parameters: {
          ...exp.parameters,
          tasks: exp.tasks || []
        },
        sessions: sessions.map(session => ({
          id: session.id,
          author: session.userName,
          date: session.date,
          duration: session.duration,
          isMine: session.userId === exp.authorId,
          results: {
            efficiency: calculateEfficiency(session.results),
            completedTasks: session.results?.length || 0
          }
        }))
      }
    };
  },

  create: async (experimentData) => {
    const newExperiment = {
      ...experimentData,
      createdAt: new Date().toISOString(),
      sessionsCount: 0
    };
    
    const created = storage.add(STORAGE_KEYS.EXPERIMENTS, newExperiment);
    return { data: created };
  },

  update: async (id, experimentData) => {
    const updated = storage.update(STORAGE_KEYS.EXPERIMENTS, id, experimentData);
    if (!updated) throw new Error('Experiment not found');
    return { data: updated };
  },

  delete: async (id) => {
    // Удаляем связанные сессии
    const sessions = storage.findWhere(STORAGE_KEYS.SESSIONS, s => s.experimentId === id);
    sessions.forEach(s => storage.remove(STORAGE_KEYS.SESSIONS, s.id));
    
    return storage.remove(STORAGE_KEYS.EXPERIMENTS, id);
  },

  getSessions: async (experimentId) => {
    const sessions = storage.findWhere(STORAGE_KEYS.SESSIONS, s => s.experimentId === experimentId);
    
    return {
      data: sessions.map(session => ({
        id: session.id,
        author: session.userName,
        date: session.date,
        duration: session.duration,
        isMine: session.userId === session.experiment.authorId,
        results: {
          efficiency: calculateEfficiency(session.results),
          completedTasks: session.results?.length || 0
        }
      }))
    };
  }
};