import { v4 as uuid } from 'uuid';

// Ключи для localStorage
export const STORAGE_KEYS = {
  EXPERIMENTS: 'experiments',
  SESSIONS: 'sessions',
  FOLDERS: 'folders',
  USERS: 'users' // на будущее, если понадобится
};

// Инициализация хранилища (опционально)
export const initStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.EXPERIMENTS)) {
    localStorage.setItem(STORAGE_KEYS.EXPERIMENTS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SESSIONS)) {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.FOLDERS)) {
    localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify([]));
  }
};

// Базовые операции с хранилищем
export const storage = {
  // Получить данные по ключу
  get: (key) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error reading from localStorage (key: ${key}):`, error);
      return null;
    }
  },

  // Сохранить данные по ключу
  set: (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage (key: ${key}):`, error);
      return false;
    }
  },

  // Получить все элементы коллекции
  getAll: (key) => {
    return storage.get(key) || [];
  },

  // Найти элемент по ID
  findById: (key, id) => {
    const items = storage.getAll(key);
    return items.find(item => item.id === id);
  },

  // Добавить новый элемент в коллекцию
  add: (key, item) => {
    const items = storage.getAll(key);
    const newItem = { 
        ...item, 
        id: uuid()
     };
    const updatedItems = [...items, newItem];
    storage.set(key, updatedItems);
    return newItem;
  },

  // Обновить элемент в коллекции
  update: (key, id, updates) => {
    const items = storage.getAll(key);
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) return null;
    
    const updatedItem = { ...items[index], ...updates };
    const updatedItems = [...items];
    updatedItems[index] = updatedItem;
    
    storage.set(key, updatedItems);
    return updatedItem;
  },

  // Удалить элемент из коллекции
  remove: (key, id) => {
    const items = storage.getAll(key);
    const updatedItems = items.filter(item => item.id !== id);
    storage.set(key, updatedItems);
    return { success: true };
  },

  // Найти элементы по условию
  findWhere: (key, condition) => {
    const items = storage.getAll(key);
    return items.filter(condition);
  }
};

// Вспомогательная функция для расчета эффективности
export const calculateEfficiency = (results = []) => {
  if (!results || results.length === 0) return 0;
  
  const successes = results.reduce((acc, task) => {
    return acc + (task.presentations?.filter(p => p.outcome === 'success').length || 0);
  }, 0);
  
  const total = results.reduce((acc, task) => acc + (task.presentations?.length || 0), 0);
  
  return total > 0 ? (successes / total) * 100 : 0; // возвращаем процент
};