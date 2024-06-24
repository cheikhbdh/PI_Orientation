import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './choixFiliere.css';

const ChoixFiliere = () => {
  const [choixFilieres, setChoixFilieres] = useState([]);
  const [etudiants, setEtudiants] = useState([]);
  const [orientationOuverte, setOrientationOuverte] = useState(false);

  useEffect(() => {
    fetchChoixFilieres();
    fetchEtudiants();
    fetchOrientationStatus();
  }, []);

  const fetchChoixFilieres = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/choixfiliere/');
      setChoixFilieres(response.data);
    } catch (error) {
      console.error('Error fetching choix filieres:', error);
    }
  };

  const fetchEtudiants = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/etudiants/');
      setEtudiants(response.data);
    } catch (error) {
      console.error('Error fetching etudiants:', error);
    }
  };

  const fetchOrientationStatus = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/check-orientation1/');
      console.log(response.data.orientation_ouverte);
      setOrientationOuverte(response.data.orientation_ouverte);
    } catch (error) {
      console.error('Error checking orientation status:', error);
    }
  };

  const getMatriculeById = (idE) => {
    const etudiant = etudiants.find(etudiant => etudiant.idE === idE);
    return etudiant ? etudiant.matricule : 'N/A';
  };

  return (
    <div className="choix-filiere-container">
      <h1>Liste des Choix Filière</h1>
      {choixFilieres.length === 0 ? (
        <p className="no-choix-message">Aucun choix trouvé</p>
      ) : (
        <div className="table-container">
          <table className="choix-filiere-table">
            <thead>
              <tr>
                <th>Matricule</th>
                <th>Choix 1</th>
                <th>Choix 2</th>
                <th>Choix 3</th>
              </tr>
            </thead>
            <tbody>
              {choixFilieres.map((choix) => (
                <tr key={choix.id}>
                  <td>{getMatriculeById(choix.idE)}</td>
                  <td>{choix.choix1}</td>
                  <td>{choix.choix2}</td>
                  <td>{choix.choix3}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!orientationOuverte && choixFilieres.length > 0 && (
            <div className="button-container">
              <button className="styled-button">Oriente ▶</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChoixFiliere;
