export const folderApi = {
  getAll: async ({ search = '', sortBy = 'date' }) => {
    // try {
    //   const params = new URLSearchParams();
    //   if (search) params.append('search', search);
    //   params.append('sort', sortBy === 'name' ? 'name' : '-createdAt');

    //   const response = await axios.get(`/folders?${params.toString()}`);
    //   return { data: response.data };
    // } catch (error) {
    //   throw error.response?.data || error;
    // }
  },

  getById: async (id) => {
    // try {
    //   const response = await axios.get(`/folders/${id}`);
    //   return { data: response.data };
    // } catch (error) {
    //   throw error.response?.data || error;
    // }
  },

  create: async (folderData) => {
    // try {
    //   const response = await axios.post('/folders', folderData);
    //   return { data: response.data };
    // } catch (error) {
    //   throw error.response?.data || error;
    // }
  },

  update: async (id, folderData) => {
    // try {
    //   const response = await axios.put(`/folders/${id}`, folderData);
    //   return { data: response.data };
    // } catch (error) {
    //   throw error.response?.data || error;
    // }
  },

  delete: async (id) => {
    // try {
    //   await axios.delete(`/folders/${id}`);
    //   return { data: { success: true } };
    // } catch (error) {
    //   throw error.response?.data || error;
    // }
  },

  setExperiments: async (folderId, experimentIds) => {
    // try {
    //   const response = await axios.put(`/folders/${folderId}/experiments`, {
    //     experimentIds
    //   });
    //   return { data: response.data };
    // } catch (error) {
    //   throw error.response?.data || error;
    // }
  }
};