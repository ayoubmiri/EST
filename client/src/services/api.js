import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://supportive-enjoyment-production.up.railway.app/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000,
  withCredentials: true
});

// Intercepteurs pour le logging
api.interceptors.request.use(config => {
  console.log(`Envoi requête ${config.method?.toUpperCase()} à: ${config.url}`);
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    console.error('Erreur API:', {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url,
      data: error.response?.data
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
  },
  updateTask: async (id, task) => {
    const response = await api.put(`/tasks/${id}`, task);
    return response.data;
  },
  deleteTask: async (id) => {
    await api.delete(`/tasks/${id}`);
    return id;
  }
};