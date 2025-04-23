import React, { useState, useEffect } from 'react';
import { taskService } from '../services/api';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    try {
      const data = await taskService.getAllTasks();
      setTasks(data);
      setError('');
    } catch (err) {
      setError('Failed to load tasks. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await taskService.deleteTask(id);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err) {
      setError('Failed to delete task');
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
      setError('Failed to update task');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  if (loading) return <div>Loading tasks...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="task-list">
      {tasks.map(task => (
        <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleComplete(task)}
          />
          <span className="task-title">{task.title}</span>
          <button 
            onClick={() => handleDelete(task.id)}
            className="delete-btn"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default TaskList;