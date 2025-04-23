require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Configuration CORS
const allowedOrigins = [
  'https://est-one.vercel.app',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Base de données simulée
let tasks = [
  { id: 1, title: 'Configurer le backend', completed: true },
  { id: 2, title: 'Développer le frontend', completed: false }
];

// Routes API
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
  if (!req.body.title) {
    return res.status(400).json({ error: 'Le titre est requis' });
  }

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
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Tâche non trouvée' });
  }

  if (!req.body.title) {
    return res.status(400).json({ error: 'Le titre est requis' });
  }

  tasks[taskIndex] = {
    id: taskId,
    title: req.body.title,
    completed: req.body.completed || false
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
    status: 'OK',
    backend: 'supportive-enjoyment-production.up.railway.app',
    timestamp: new Date() 
  });
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`URL du backend: https://supportive-enjoyment-production.up.railway.app`);
});