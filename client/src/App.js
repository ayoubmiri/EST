import React, { useState, useEffect } from 'react';
import { taskService } from './services/api';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Charger les tâches au montage
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await taskService.getAllTasks();
        setTasks(data);
      } catch (err) {
        setError('Échec du chargement des tâches');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, []);

  // Ajouter une tâche
  const addTask = async () => {
    if (!newTask.trim()) {
      setError('Veuillez saisir une tâche');
      return;
    }

    try {
      const task = await taskService.createTask({ title: newTask });
      setTasks([...tasks, task]);
      setNewTask('');
      setError('');
    } catch (err) {
      setError('Échec de l\'ajout de la tâche');
      console.error(err);
    }
  };

  // Modifier une tâche
  const updateTask = async (id) => {
    if (!editText.trim()) {
      setError('Le titre ne peut pas être vide');
      return;
    }

    try {
      const taskToUpdate = tasks.find(t => t.id === id);
      const updatedTask = await taskService.updateTask(id, {
        ...taskToUpdate,
        title: editText
      });
      
      setTasks(tasks.map(t => 
        t.id === id ? updatedTask : t
      ));
      setEditingId(null);
      setError('');
    } catch (err) {
      setError('Échec de la modification');
      console.error(err);
    }
  };

  // Supprimer une tâche
  const deleteTask = async (id) => {
    try {
      await taskService.deleteTask(id);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err) {
      setError('Échec de la suppression');
      console.error(err);
    }
  };

  // Basculer l'état complété
  const toggleComplete = async (task) => {
    try {
      const updatedTask = await taskService.updateTask(task.id, {
        ...task,
        completed: !task.completed
      });
      setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
    } catch (err) {
      console.error('Échec du changement d\'état:', err);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Gestionnaire de Tâches</h1>
        <p>Organisez votre travail efficacement</p>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="task-form">
        <input
          type="text"
          className="task-input"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Saisir une nouvelle tâche..."
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
        />
        <button className="add-btn" onClick={addTask}>
          Ajouter
        </button>
      </div>

      {loading ? (
        <div className="loader">
          <div className="spinner"></div>
        </div>
      ) : (
        <ul className="task-list">
          {tasks.length === 0 ? (
            <div className="empty-state">
              <p>Aucune tâche pour le moment</p>
              <small>Commencez par ajouter votre première tâche</small>
            </div>
          ) : (
            tasks.map(task => (
              <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                <input
                  type="checkbox"
                  className="task-checkbox"
                  checked={task.completed}
                  onChange={() => toggleComplete(task)}
                />
                
                <div className="task-content">
                  {editingId === task.id ? (
                    <input
                      type="text"
                      className="edit-input"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onBlur={() => updateTask(task.id)}
                      onKeyPress={(e) => e.key === 'Enter' && updateTask(task.id)}
                      autoFocus
                    />
                  ) : (
                    <span 
                      className="task-title" 
                      onDoubleClick={() => {
                        setEditingId(task.id);
                        setEditText(task.title);
                      }}
                    >
                      {task.title}
                    </span>
                  )}
                </div>

                <div className="task-actions">
                  <button 
                    className="action-btn edit-btn"
                    onClick={() => editingId === task.id ? updateTask(task.id) : (() => {
                      setEditingId(task.id);
                      setEditText(task.title);
                    })()}
                  >
                    {editingId === task.id ? 'Valider' : 'Modifier'}
                  </button>
                  <button 
                    className="action-btn delete-btn"
                    onClick={() => deleteTask(task.id)}
                  >
                    Supprimer
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

export default App;