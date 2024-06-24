import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import Button from '@mui/material/Button';
import './Orientations.css';

const OrientationDetails = () => {
  const { id } = useParams();
  const history = useHistory();
  const [orientation, setOrientation] = useState(null);
  const [choices, setChoices] = useState([]);
  const [filiereAssignments, setFiliereAssignments] = useState([]);
  const [orientationOuverte, setOrientationOuverte] = useState(false);

  useEffect(() => {
    fetchOrientation();
    fetchChoices();
    fetchFinalOrientationState();
    fetchOrientationStatus();
  }, []);

  const fetchOrientation = () => {
    axios
      .get(`http://127.0.0.1:8000/orientations/${id}/`)
      .then((response) => {
        setOrientation(response.data);
      })
      .catch((error) => {
        console.error('Error fetching orientation:', error);
      });
  };

  const fetchChoices = () => {
    axios
      .get(`http://127.0.0.1:8000/choixfiliere/?idc=${id}`)
      .then((response) => {
        setChoices(response.data);
      })
      .catch((error) => {
        console.error('Error fetching choices:', error);
      });
  };

 
  const fetchOrientationStatus= () => {
    axios
      .get(`http://127.0.0.1:8000/check-orientation1/${id}/`)
      .then((response) => {
        setOrientationOuverte(response.data.orientation_ouverte);
      })
      .catch((error) => {
        console.error('Error checking orientation status:', error);
      });
  };
  const fetchFinalOrientationState = () => {
    axios
      .get(`http://127.0.0.1:8000/orientation-finale/${id}/`)
      .then((response) => {
        setFiliereAssignments(response.data);
      })
      .catch((error) => {
        console.error('Error fetching final orientation state:', error);
      });
  };

  const handleOrienter = () => {
    axios
      .get(`http://127.0.0.1:8000/classer-etudiants/${id}/`)
      .then((response) => {
        alert('Orientation mise à jour avec succès');
        fetchFinalOrientationState(); 
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error updating orientation:', error);
      });
  };
  const handleAfficherPV = () => {
    history.push(`/orientation-pv/${id}`);
  };

  if (!orientation) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={() => history.push('/equipes')}>
        Retour
      </Button>
      <h2>Détails de l'Orientation: {orientation.titre}</h2>
      {choices.length === 0 ? (
        <p>Aucun choix de filière disponible.</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Matricule</th>
                <th>Choix 1</th>
                <th>Choix 2</th>
                <th>Choix 3</th>
                {filiereAssignments.length > 0 && <th>Filière</th>}
              </tr>
            </thead>
            <tbody>
              {choices.map((choix) => {
                const filiereAssignment = filiereAssignments.find(f => f.matricule === choix.matricule);
                return (
                  <tr key={choix.id}>
                    <td>{choix.matricule}</td>
                    <td>{choix.choix1}</td>
                    <td>{choix.choix2}</td>
                    <td>{choix.choix3}</td>
                    {filiereAssignments.length > 0 && (
                      <td>{filiereAssignment ? filiereAssignment.filiere : 'N/A'}</td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filiereAssignments.length > 0 && (
        <div className="button-container">
          <Button variant="contained" color="secondary" onClick={handleAfficherPV}>
            Afficher PV d'Orientation
          </Button>
        </div>
      )}
          {!orientationOuverte && choices.length > 0 && (
            <div className="button-container">
              <button className="styled-button" onClick={handleOrienter}>Oriente ▶</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrientationDetails;
