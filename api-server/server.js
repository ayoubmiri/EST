require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Configuration CORS pour Vercel + localhost
app.use(cors({
  origin: [
    'https://est-one.vercel.app',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Base de données en mémoire
let tasks = [
  { id: 1, title: 'Configurer le backend', completed: true },
  { id: 2, title: 'Développer le frontend', completed: false }
];

// Routes API
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
  const newTask = {
    id: tasks.length + 1,
    title: req.body.title,
    completed: false
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  
  if (taskIndex === -1) return res.status(404).json({ error: 'Task not found' });
  
  tasks[taskIndex] = { 
    ...tasks[taskIndex], 
    ...req.body,
    id: taskId // Préserve l'ID original
  };
  
  res.json(tasks[taskIndex]);
});

app.delete('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  tasks = tasks.filter(t => t.id !== taskId);
  res.status(204).send();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    backend: 'supportive-enjoyment-production.up.railway.app',
    timestamp: new Date() 
  });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
  console.log(`API URL: https://supportive-enjoyment-production.up.railway.app`);
});