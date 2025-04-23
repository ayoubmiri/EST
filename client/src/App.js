import React, { useState, useEffect } from 'react';
import { taskService } from './services/api';
import './App.css';

function App() {
  const [tâches, setTâches] = useState([]);
  const [nouvelleTâche, setNouvelleTâche] = useState('');
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(true);

  // Charger les tâches au démarrage
  useEffect(() => {
    const chargerTâches = async () => {
      try {
        const données = await taskService.getAllTasks();
        setTâches(données);
        setErreur('');
      } catch (err) {
        setErreur('Impossible de charger les tâches. Vérifiez votre connexion.');
        console.error("Erreur API:", err);
      } finally {
        setChargement(false);
      }
    };

    chargerTâches();
  }, []);

  // Ajouter une nouvelle tâche
  const ajouterTâche = async () => {
    if (!nouvelleTâche.trim()) return;

    try {
      const tâche = await taskService.createTask({ title: nouvelleTâche });
      setTâches([...tâches, tâche]);
      setNouvelleTâche('');
    } catch (err) {
      setErreur('Échec de l\'ajout de la tâche');
      console.error("Erreur API:", err);
    }
  };

  return (
    <div className="app-container">
      <h1>Gestionnaire de Tâches</h1>
      <p>Organisez votre travail efficacement</p>

      {erreur && <div className="error-message">{erreur}</div>}

      <div className="task-form">
        <input
          type="text"
          value={nouvelleTâche}
          onChange={(e) => setNouvelleTâche(e.target.value)}
          placeholder="Saisir une nouvelle tâche..."
          onKeyPress={(e) => e.key === 'Enter' && ajouterTâche()}
        />
        <button onClick={ajouterTâche}>Ajouter</button>
      </div>

      {chargement ? (
        <div className="loading">Chargement en cours...</div>
      ) : tâches.length === 0 ? (
        <div className="empty-state">
          <p>Aucune tâche pour le moment</p>
          <small>Commencez par ajouter votre première tâche</small>
        </div>
      ) : (
        <ul className="task-list">
          {tâches.map(tâche => (
            <li key={tâche.id}>
              <span>{tâche.title}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;