import axios from 'axios';

const API_BASE_URL = 'https://supportive-enjoyment-production.up.railway.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Intercepteurs pour le logging
api.interceptors.request.use(config => {
  console.log(`Request to: ${config.url}`);
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url
    });
    return Promise.reject(error);
  }
);

export const taskService = {
  getAllTasks: async () => (await api.get('/tasks')).data,
  createTask: async (task) => (await api.post('/tasks', task)).data,
  updateTask: async (id, task) => (await api.put(`/tasks/${id}`, task)).data,
  deleteTask: async (id) => {
    await api.delete(`/tasks/${id}`);
    return id;
  },
  checkHealth: async () => (await api.get('/health')).data
};