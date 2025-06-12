export const experimentApi = {
  // Получение всех экспериментов с фильтрацией и сортировкой
  getAll: async ({ search = '', sortBy = 'createdAt' }) => {
    // try {
    //   const params = new URLSearchParams();
    //   if (search) params.append('name', search);
    //   if (sortBy) params.append('sort', sortBy === 'name' ? 'name' : '-createdAt');

    //   const response = await axios.get(`/experiments?${params.toString()}`);
    //   return {
    //     data: response.data.map(exp => ({
    //       ...exp,
    //       parameters: {
    //         efficiencyMin: exp.efficiencyMin,
    //         efficiencyMax: exp.efficiencyMax,
    //         initialTaskNumber: exp.initialTaskNumber,
    //         seriesTime: exp.seriesTime,
    //         presentationsPerTask: exp.presentationsPerTask
    //       },
    //       sessions: exp.sessionsCount // Используем sessionsCount из бэкенда
    //     }))
    //   };
    // } catch (error) {
    //   throw error.response?.data || error;
    // }
  },

  // Получение эксперимента по ID
  getById: async (id) => {
    // try {
    //   const response = await axios.get(`/experiments/${id}`);
    //   const exp = response.data;
      
    //   return {
    //     data: {
    //       ...exp,
    //       parameters: {
    //         efficiencyMin: exp.efficiencyMin,
    //         efficiencyMax: exp.efficiencyMax,
    //         initialTaskNumber: exp.initialTaskNumber,
    //         seriesTime: exp.seriesTime,
    //         presentationsPerTask: exp.presentationsPerTask,
    //         tasks: exp.tasks.map(task => ({
    //           id: task._id,
    //           name: task.name,
    //           parameters: {
    //             rows: task.rows,
    //             columns: task.columns,
    //             backgroundColor: task.backgroundColor,
    //             symbolColor: task.symbolColor,
    //             symbolType: task.symbolType,
    //             symbolFont: task.symbolFont,
    //             symbolHeight: task.symbolHeight,
    //             symbolWidth: task.symbolWidth,
    //             verticalSpacing: task.verticalSpacing,
    //             horizontalSpacing: task.horizontalSpacing,
    //             stimulusTime: task.stimulusTime,
    //             responseTime: task.responseTime,
    //             pauseTime: task.pauseTime
    //           }
    //         }))
    //       },
    //       sessions: exp.sessions.map(session => ({
    //         id: session._id,
    //         author: session.userName,
    //         date: session.date,
    //         duration: session.duration,
    //         isMine: session.userId === exp.author._id,
    //         results: {
    //           efficiency: 0, // Нужно вычислить на бэкенде
    //           completedTasks: session.results?.length || 0
    //         }
    //       }))
    //     }
    //   };
    // } catch (error) {
    //   throw error.response?.data || error;
    // }
  },

  // Создание нового эксперимента
  create: async (experimentData) => {
    // try {
    //   const tasks = experimentData.tasks.map(task => ({
    //     name: task.name,
    //     rows: task.rows,
    //     columns: task.columns,
    //     backgroundColor: task.backgroundColor,
    //     symbolColor: task.symbolColor,
    //     symbolType: task.symbolType,
    //     symbolFont: task.symbolFont,
    //     symbolHeight: task.symbolHeight,
    //     symbolWidth: task.symbolWidth,
    //     verticalSpacing: task.verticalSpacing,
    //     horizontalSpacing: task.horizontalSpacing,
    //     stimulusTime: task.stimulusTime,
    //     responseTime: task.responseTime,
    //     pauseTime: task.pauseTime
    //   }));

    //   const response = await axios.post('/experiments', {
    //     name: experimentData.name,
    //     mode: experimentData.mode,
    //     efficiencyMin: experimentData.efficiencyMin,
    //     efficiencyMax: experimentData.efficiencyMax,
    //     initialTaskNumber: experimentData.initialTaskNumber,
    //     seriesTime: experimentData.seriesTime,
    //     presentationsPerTask: experimentData.presentationsPerTask,
    //     tasks
    //   });

    //   return { data: response.data };
    // } catch (error) {
    //   throw error.response?.data || error;
    // }
  },

  // Обновление эксперимента
  update: async (id, experimentData) => {
    // try {
    //   const response = await axios.put(`/experiments/${id}`, {
    //     name: experimentData.name
    //   });
    //   return { data: response.data };
    // } catch (error) {
    //   throw error.response?.data || error;
    // }
  },

  // Удаление эксперимента
  delete: async (id) => {
    // try {
    //   await axios.delete(`/experiments/${id}`);
    //   return { data: { success: true } };
    // } catch (error) {
    //   throw error.response?.data || error;
    // }
  },

  // Получение сессий эксперимента
  getSessions: async (experimentId) => {
    // try {
    //   const response = await axios.get(`/experiments/${experimentId}/sessions`);
    //   return {
    //     data: response.data.map(session => ({
    //       id: session._id,
    //       author: session.userName,
    //       date: session.date,
    //       duration: session.duration,
    //       isMine: session.userId === session.experiment.author, // Нужно уточнить логику
    //       results: {
    //         efficiency: calculateEfficiency(session.results),
    //         completedTasks: session.results?.length || 0
    //       }
    //     }))
    //   };
    // } catch (error) {
    //   throw error.response?.data || error;
    // }
  }
};

// Вспомогательная функция для расчета эффективности
function calculateEfficiency(results) {
  // if (!results || results.length === 0) return 0;
  
  // const successes = results.reduce((acc, task) => {
  //   return acc + task.presentations.filter(p => p.outcome === 'success').length;
  // }, 0);
  
  // const total = results.reduce((acc, task) => acc + task.presentations.length, 0);
  
  // return total > 0 ? successes / total : 0;
}