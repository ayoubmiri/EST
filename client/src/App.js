import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://supportive-enjoyment-production.up.railway.app/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/tasks`);
      setTasks(data);
      setError('');
    } catch (err) {
      setError('Failed to load tasks');
      console.error('API Error:', err.response?.data || err.message);
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) return;
    
    try {
      const { data } = await axios.post(`${API_URL}/tasks`, { title: newTask });
      setTasks([...tasks, data]);
      setNewTask('');
      setError('');
    } catch (err) {
      setError('Failed to save task');
      console.error('API Error:', err.response?.data || err.message);
    }
  };

  const updateTask = async (task) => {
    try {
      const { data } = await axios.put(`${API_URL}/tasks/${task.id}`, task);
      setTasks(tasks.map(t => t.id === task.id ? data : t));
      setEditingTask(null);
      setError('');
    } catch (err) {
      setError('Failed to update task');
      console.error('API Error:', err.response?.data || err.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
      setTasks(tasks.filter(task => task.id !== id));
      setError('');
    } catch (err) {
      setError('Failed to delete task');
      console.error('API Error:', err.response?.data || err.message);
    }
  };

  const toggleComplete = async (task) => {
    await updateTask({ ...task, completed: !task.completed });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="app">
      <h1>Task Manager</h1>
      
      {error && <div className="error">{error}</div>}

      <div className="task-form">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter new task"
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
        />
        <button onClick={addTask}>
          {editingTask ? 'Update Task' : 'Add Task'}
        </button>
      </div>

      <ul className="task-list">
        {tasks.map(task => (
          <li key={task.id} className={task.completed ? 'completed' : ''}>
            <div className="task-content">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(task)}
              />
              {editingTask?.id === task.id ? (
                <input
                  type="text"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                  onBlur={() => updateTask(editingTask)}
                  onKeyPress={(e) => e.key === 'Enter' && updateTask(editingTask)}
                  autoFocus
                />
              ) : (
                <span onDoubleClick={() => setEditingTask(task)}>
                  {task.title}
                </span>
              )}
            </div>
            <div className="task-actions">
              <button onClick={() => setEditingTask(task)}>Edit</button>
              <button onClick={() => deleteTask(task.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;