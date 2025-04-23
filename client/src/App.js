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

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await taskService.getAllTasks();
        setTasks(data);
      } catch (err) {
        setError('Failed to load tasks. Please refresh the page.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!newTask.trim()) return;
    
    try {
      const task = await taskService.createTask({ title: newTask });
      setTasks([...tasks, task]);
      setNewTask('');
      setError('');
    } catch (err) {
      setError('Failed to add task. Please try again.');
      console.error(err);
    }
  };

  const toggleComplete = async (task) => {
    try {
      const updatedTask = await taskService.updateTask(task.id, {
        ...task,
        completed: !task.completed
      });
      setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
    } catch (err) {
      setError('Failed to update task status.');
      console.error(err);
    }
  };

  const startEditing = (task) => {
    setEditingId(task.id);
    setEditText(task.title);
  };

  const saveEdit = async (id) => {
    try {
      const updatedTask = await taskService.updateTask(id, {
        title: editText,
        completed: tasks.find(t => t.id === id).completed
      });
      setTasks(tasks.map(t => t.id === id ? updatedTask : t));
      setEditingId(null);
    } catch (err) {
      setError('Failed to update task.');
      console.error(err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await taskService.deleteTask(id);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err) {
      setError('Failed to delete task.');
      console.error(err);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Task Manager Pro</h1>
        <p>Organize your work efficiently</p>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="task-form">
        <input
          type="text"
          className="task-input"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter a new task..."
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
        />
        <button className="add-btn" onClick={addTask}>
          Add Task
        </button>
      </div>

      {loading ? (
        <div className="loader">
          <div className="spinner"></div>
        </div>
      ) : (
        <ul className="task-list">
          {tasks.map(task => (
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
                    onBlur={() => saveEdit(task.id)}
                    onKeyPress={(e) => e.key === 'Enter' && saveEdit(task.id)}
                    autoFocus
                  />
                ) : (
                  <span className="task-title" onDoubleClick={() => startEditing(task)}>
                    {task.title}
                  </span>
                )}
              </div>

              <div className="task-actions">
                <button 
                  className="action-btn edit-btn"
                  onClick={() => editingId === task.id ? saveEdit(task.id) : startEditing(task)}
                >
                  {editingId === task.id ? 'Save' : 'Edit'}
                </button>
                <button 
                  className="action-btn delete-btn"
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;