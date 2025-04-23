import axios from 'axios';

const API_URL = 'https://supportive-enjoyment-production.up.railway.app/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour le logging
api.interceptors.request.use(config => {
  console.log(`Envoi requête à: ${config.url}`);
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    console.error('Erreur API:', {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url
    });
    return Promise.reject(error);
  }
);

export const taskService = {
  getAllTasks: async () => {
    const response = await api.get('/tasks');
    return response.data;
  },
  createTask: async (task) => {
    const response = await api.post('/tasks', task);
    return response.data;
  }
};