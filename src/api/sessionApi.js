export const sessionApi = {
  // Создание новой сессии
  create: async (sessionData) => {
    // try {
    //   const response = await axios.post('/sessions', sessionData);
    //   return { data: response.data };
    // } catch (error) {
    //   throw error.response?.data || error;
    // }
  },

  // Получение сессий по ID эксперимента
  getByExperiment: async (experimentId) => {
    // try {
    //   const response = await axios.get(`/experiments/${experimentId}/sessions`);
    //   return { 
    //     data: response.data.map(session => ({
    //       ...session,
    //       isMine: session.userId === session.experiment.author // или другая логика определения владельца
    //     }))
    //   };
    // } catch (error) {
    //   throw error.response?.data || error;
    // }
  },

  // Удаление сессии
  delete: async (sessionId) => {
    // try {
    //   await axios.delete(`/sessions/${sessionId}`);
    //   return { data: { success: true } };
    // } catch (error) {
    //   throw error.response?.data || error;
    // }
  },

  // Получение детальной информации о сессии
  getById: async (sessionId) => {
    // try {
    //   const response = await axios.get(`/sessions/${sessionId}`);
    //   return { data: response.data };
    // } catch (error) {
    //   throw error.response?.data || error;
    // }
  },

   // Экспорт сессии в PDF
  exportToPDF: async (sessionId) => {
    // try {
    //   const response = await axios.post(
    //     `/sessions/${sessionId}/export-pdf`, 
    //     {},
    //     { responseType: 'blob' }
    //   );
    //   return response;
    // } catch (error) {
    //   throw error.response?.data || error;
    // }
  }
};