import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://supportive-enjoyment-production.up.railway.app/';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

export const taskService = {
  getAllTasks: async () => {
    const response = await apiClient.get('/tasks');
    return response.data;
  },
  createTask: async (taskData) => {
    const response = await apiClient.post('/tasks', taskData);
    return response.data;
  },
  updateTask: async (id, taskData) => {
    const response = await apiClient.put(`/tasks/${id}`, taskData);
    return response.data;
  },
  deleteTask: async (id) => {
    const response = await apiClient.delete(`/tasks/${id}`);
    return response.data;
  }
};
