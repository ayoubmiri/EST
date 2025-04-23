import axios from 'axios';

// Configuration optimisée pour Railway
const API_URL = process.env.REACT_APP_API_URL || 'https://supportive-enjoyment-production.up.railway.app';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 secondes avant timeout
});

// Intercepteur pour gérer les erreurs globalement
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Erreurs 4xx/5xx
      console.error('Erreur API:', error.response.status, error.response.data);
      return Promise.reject({
        message: error.response.data.message || `Erreur ${error.response.status}`,
        status: error.response.status
      });
    } else if (error.request) {
      // Pas de réponse du serveur
      console.error('Pas de réponse du serveur:', error.request);
      return Promise.reject({ message: 'Le serveur ne répond pas' });
    } else {
      // Erreur de configuration
      console.error('Erreur de configuration:', error.message);
      return Promise.reject({ message: 'Erreur de configuration de la requête' });
    }
  }
);

export const taskService = {
  getAllTasks: async () => {
    try {
      const response = await apiClient.get('/api/tasks'); // Notez le /api/ ajouté
      return response.data;
    } catch (error) {
      console.error('Erreur dans getAllTasks:', error);
      throw error;
    }
  },
  createTask: async (taskData) => {
    try {
      const response = await apiClient.post('/api/tasks', taskData);
      return response.data;
    } catch (error) {
      console.error('Erreur dans createTask:', error);
      throw error;
    }
  },
  updateTask: async (id, taskData) => {
    try {
      const response = await apiClient.put(`/api/tasks/${id}`, taskData);
      return response.data;
    } catch (error) {
      console.error('Erreur dans updateTask:', error);
      throw error;
    }
  },
  deleteTask: async (id) => {
    try {
      const response = await apiClient.delete(`/api/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur dans deleteTask:', error);
      throw error;
    }
  }
};
