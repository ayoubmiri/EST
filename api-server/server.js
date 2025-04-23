const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
  origin: [
    'https://est-one.vercel.app/', // Remplacez par votre URL frontend
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(bodyParser.json());

// Données mock pour les tâches
let tasks = [
  { id: 1, title: 'Apprendre Express', completed: false },
  { id: 2, title: 'Créer une API REST', completed: false }
];

// Routes
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
app.get('/', (req, res) => {
    res.json({ message: "API opérationnelle !" });
  });

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur en écoute sur http://localhost:${PORT}`);
});
app.delete('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  tasks = tasks.filter(t => t.id !== taskId); // Supprime la tâche
  res.status(204).send(); // Réponse vide
});
