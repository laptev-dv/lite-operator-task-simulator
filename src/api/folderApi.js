import { STORAGE_KEYS, storage } from './storage';

export const folderApi = {
  getAll: async ({ search = '', sortBy = 'date' }) => {
    let folders = storage.getAll(STORAGE_KEYS.FOLDERS);
    
    if (search) {
      folders = folders.filter(f => 
        f.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    folders.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    return { data: folders };
  },

  getById: async (id) => {
    const folder = storage.findById(STORAGE_KEYS.FOLDERS, id);
    if (!folder) throw new Error('Folder not found');
    return { data: folder };
  },

  create: async (folderData) => {
    const newFolder = {
      ...folderData,
      createdAt: new Date().toISOString(),
      experiments: []
    };
    
    const created = storage.add(STORAGE_KEYS.FOLDERS, newFolder);
    return { data: created };
  },

  update: async (id, folderData) => {
    const updated = storage.update(STORAGE_KEYS.FOLDERS, id, folderData);
    if (!updated) throw new Error('Folder not found');
    return { data: updated };
  },

  delete: async (id) => {
    return storage.remove(STORAGE_KEYS.FOLDERS, id);
  },

  setExperiments: async (folderId, experimentIds) => {
    const experiments = storage.getAll(STORAGE_KEYS.EXPERIMENTS);
    
    // Проверка существования экспериментов
    const invalidIds = experimentIds.filter(id => 
      !experiments.some(e => e.id === id)
    );
    
    if (invalidIds.length > 0) {
      throw new Error(`Experiments not found: ${invalidIds.join(', ')}`);
    }
    
    const updated = storage.update(STORAGE_KEYS.FOLDERS, folderId, {
      experiments: [...new Set(experimentIds)] // Удаляем дубликаты
    });
    
    if (!updated) throw new Error('Folder not found');
    return { data: updated };
  },

  addExperiment: async (folderId, experimentId) => {
    const folder = storage.findById(STORAGE_KEYS.FOLDERS, folderId);
    if (!folder) throw new Error('Folder not found');
    
    const experiment = storage.findById(STORAGE_KEYS.EXPERIMENTS, experimentId);
    if (!experiment) throw new Error('Experiment not found');
    
    if (folder.experiments.includes(experimentId)) {
      return { data: folder }; // Уже существует
    }
    
    const updated = storage.update(STORAGE_KEYS.FOLDERS, folderId, {
      experiments: [...folder.experiments, experimentId]
    });
    
    return { data: updated };
  },

  removeExperiment: async (folderId, experimentId) => {
    const folder = storage.findById(STORAGE_KEYS.FOLDERS, folderId);
    if (!folder) throw new Error('Folder not found');
    
    const updated = storage.update(STORAGE_KEYS.FOLDERS, folderId, {
      experiments: folder.experiments.filter(id => id !== experimentId)
    });
    
    return { data: updated };
  }
};