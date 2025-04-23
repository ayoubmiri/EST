import React, { useState, useEffect } from 'react';
import { taskService } from './services/api';
import './App.css';

function App() {
  const [tâches, setTâches] = useState([]);
  const [nouvelleTâche, setNouvelleTâche] = useState('');
  const [éditionId, setÉditionId] = useState(null);
  const [texteÉdition, setTexteÉdition] = useState('');
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    const chargerTâches = async () => {
      try {
        const données = await taskService.getAllTasks();
        setTâches(données);
      } catch (err) {
        setErreur('Échec du chargement des tâches. Veuillez rafraîchir la page.');
        console.error(err);
      } finally {
        setChargement(false);
      }
    };
    
    chargerTâches();
  }, []);

  const ajouterTâche = async () => {
    if (!nouvelleTâche.trim()) return;
    
    try {
      const tâche = await taskService.createTask({ title: nouvelleTâche });
      setTâches([...tâches, tâche]);
      setNouvelleTâche('');
      setErreur('');
    } catch (err) {
      setErreur('Échec de l\'ajout. Veuillez réessayer.');
      console.error(err);
    }
  };

  const basculerTerminée = async (tâche) => {
    try {
      const tâcheMiseÀJour = await taskService.updateTask(tâche.id, {
        ...tâche,
        completed: !tâche.completed
      });
      setTâches(tâches.map(t => t.id === tâche.id ? tâcheMiseÀJour : t));
    } catch (err) {
      setErreur('Échec de la mise à jour.');
      console.error(err);
    }
  };

  const démarrerÉdition = (tâche) => {
    setÉditionId(tâche.id);
    setTexteÉdition(tâche.title);
  };

  const sauvegarderÉdition = async (id) => {
    try {
      const tâcheMiseÀJour = await taskService.updateTask(id, {
        title: texteÉdition,
        completed: tâches.find(t => t.id === id).completed
      });
      setTâches(tâches.map(t => t.id === id ? tâcheMiseÀJour : t));
      setÉditionId(null);
    } catch (err) {
      setErreur('Échec de la mise à jour.');
      console.error(err);
    }
  };

  const supprimerTâche = async (id) => {
    try {
      await taskService.deleteTask(id);
      setTâches(tâches.filter(tâche => tâche.id !== id));
    } catch (err) {
      setErreur('Échec de la suppression.');
      console.error(err);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Gestionnaire de Tâches</h1>
        <p>Organisez votre travail efficacement</p>
      </header>

      {erreur && <div className="error-message">{erreur}</div>}

      <div className="task-form">
        <input
          type="text"
          className="task-input"
          value={nouvelleTâche}
          onChange={(e) => setNouvelleTâche(e.target.value)}
          placeholder="Saisir une nouvelle tâche..."
          onKeyPress={(e) => e.key === 'Enter' && ajouterTâche()}
        />
        <button className="add-btn" onClick={ajouterTâche}>
          Ajouter
        </button>
      </div>

      {chargement ? (
        <div className="loader">
          <div className="spinner"></div>
        </div>
      ) : (
        <ul className="task-list">
          {tâches.map(tâche => (
            <li key={tâche.id} className={`task-item ${tâche.completed ? 'completed' : ''}`}>
              <input
                type="checkbox"
                className="task-checkbox"
                checked={tâche.completed}
                onChange={() => basculerTerminée(tâche)}
              />
              
              <div className="task-content">
                {éditionId === tâche.id ? (
                  <input
                    type="text"
                    className="edit-input"
                    value={texteÉdition}
                    onChange={(e) => setTexteÉdition(e.target.value)}
                    onBlur={() => sauvegarderÉdition(tâche.id)}
                    onKeyPress={(e) => e.key === 'Enter' && sauvegarderÉdition(tâche.id)}
                    autoFocus
                  />
                ) : (
                  <span className="task-title" onDoubleClick={() => démarrerÉdition(tâche)}>
                    {tâche.title}
                  </span>
                )}
              </div>

              <div className="task-actions">
                <button 
                  className="action-btn edit-btn"
                  onClick={() => éditionId === tâche.id ? sauvegarderÉdition(tâche.id) : démarrerÉdition(tâche)}
                >
                  {éditionId === tâche.id ? 'Valider' : 'Modifier'}
                </button>
                <button 
                  className="action-btn delete-btn"
                  onClick={() => supprimerTâche(tâche.id)}
                >
                  Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {!chargement && tâches.length === 0 && (
        <div className="empty-state">
          <p>Aucune tâche pour le moment</p>
          <small>Commencez par ajouter votre première tâche</small>
        </div>
      )}
    </div>
  );
}

export default App;