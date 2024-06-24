import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import * as XLSX from 'xlsx';
import './challenges.css';
import Swal from 'sweetalert2';

const Challenges = () => {
  const [grids, setGrids] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [newGrid, setNewGrid] = useState({
    titre: '',
    critere1: '',
    critere2: '',
    critere3: '',
    critere4: '',
    critere5: '',
    critere6: '',
    critere7: '',
    annee: ''
  });
  const [usedCriteria, setUsedCriteria] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const criteriaOptions = [
    'Moyenne_semestre',
    'Crédits',
    'MOYENNE_DEV',
    'MOYENNE_SYR',
    'PSP',
    'MOYENNE_PST',
    'MOYENNE_HE'
  ];

  useEffect(() => {
    fetchGrids();
    checkIfFileExists();
  }, []);

  useEffect(() => {
    if (selectedFile) {
      handleFileChange(selectedFile);
    }
  }, [selectedFile]);

  const fetchGrids = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/gridevaluation/');
      setGrids(response.data);
    } catch (error) {
      console.error('Error fetching grids:', error);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewGrid({
      titre: '',
      critere1: '',
      critere2: '',
      critere3: '',
      critere4: '',
      critere5: '',
      critere6: '',
      critere7: '',
      annee: ''
    });
    setUsedCriteria([]);
  };

  const checkIfFileExists = async () => {
    try {
      const currentYear = new Date().getFullYear();
      const response = await axios.get(`http://127.0.0.1:8000/check-pv-file/?year=${currentYear}`);
      setIsFileUploaded(response.data.file_exists);
    } catch (error) {
      console.error('Error checking file existence:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('critere')) {
      const previousCriteria = newGrid[name];

      if (previousCriteria) {
        setUsedCriteria((prev) => prev.filter((c) => c !== previousCriteria));
      }

      if (usedCriteria.includes(value)) {
        alert('This criteria has already been used.');
        return;
      }

      setUsedCriteria((prev) => [...prev, value]);
    }

    setNewGrid((prev) => ({ ...prev, [name]: value }));

    // Check if only one criterion is left unfilled
    const filledCriteria = Object.keys(newGrid)
      .filter(key => key.startsWith('critere'))
      .map(key => newGrid[key])
      .filter(Boolean);

    if (filledCriteria.length === criteriaOptions.length - 1) {
      const remainingCriteria = criteriaOptions.find(option => !usedCriteria.includes(option));
      const emptyCritereKey = Object.keys(newGrid).find(key => key.startsWith('critere') && !newGrid[key]);
      if (remainingCriteria && emptyCritereKey) {
        setNewGrid((prev) => ({ ...prev, [emptyCritereKey]: remainingCriteria }));
        setUsedCriteria((prev) => [...prev, remainingCriteria]);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/gridevaluation/', newGrid);
      fetchGrids();
      closeModal();
    } catch (error) {
      console.error('Error creating new grid:', error);
    }
  };

  const handleFileChange = async (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
        // Vérification que la 5ème ligne existe et contient les en-têtes attendus
        if (json.length > 5) {
          const headers = json[5]; // La 6ème ligne contient les en-têtes
  
          const data = json.slice(6).map(row => {
            // Vérification du format du matricule
            const matriculePattern = /^\d{5}$/;
            if (matriculePattern.test(row[1])) {
              const MOYENNE_DEV = parseFloat((row[53] || "0").replace(',', '.'));
              const MOYENNE_SYR = parseFloat((row[65] || "0").replace(',', '.'));
              const MOYENNE_HE = parseFloat((row[19] || "0").replace(',', '.'));
              const MOYENNE_PST = parseFloat((row[36] || "0").replace(',', '.'));
              const Moyenne_semestre = parseFloat((row[67] || "0").replace(',', '.'));
              const Crédits = parseInt(row[68], 10) || 0;
  
              return {
                matricule: row[1], 
                MOYENNE_HE: MOYENNE_HE.toFixed(2),
                MOYENNE_PST: MOYENNE_PST.toFixed(2),
                MOYENNE_DEV: MOYENNE_DEV.toFixed(2),
                MOYENNE_SYR: MOYENNE_SYR.toFixed(2),
                PSP: ((MOYENNE_DEV * 7) + (MOYENNE_SYR * 5)).toFixed(2),
                Moyenne_semestre: Moyenne_semestre.toFixed(2),
                Crédits: Crédits,
              };
            }
          }).filter(Boolean); // Filtrer les undefined retournés par les lignes invalides
  
          console.log(data);
  
          // Envoyer les données au backend
          axios.post('http://127.0.0.1:8000/upload-pv/', data)
            .then(response => {
              console.log('Données envoyées au serveur:', response.data);
              Swal.fire({
                title: 'Succès',
                text: 'Le fichier a été enregistré avec succès!',
                icon: 'success',
                confirmButtonText: 'OK'
              }).then(() => {
                window.location.reload();
              });
            })
            .catch(error => {
              console.error('Erreur lors de l\'envoi des données:', error);
              Swal.fire({
                title: 'Erreur',
                text: `Une erreur est survenue lors de l'enregistrement du fichier: ${error.message}`,
                icon: 'error',
                confirmButtonText: 'OK'
              });
            });
        } else {
          console.error('La 6ème ligne du fichier ne contient pas les en-têtes attendus.');
          Swal.fire({
            title: 'Erreur',
            text: 'La 6ème ligne du fichier ne contient pas les en-têtes attendus.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleFileInputChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const getAvailableOptions = (currentCritere) => {
    return criteriaOptions.filter(option => !usedCriteria.includes(option) || option === newGrid[currentCritere]);
  };

  return (
    <div className="challenges-container">
      <h1>Grilles d'évaluation</h1>
      {grids.length === 0 ? (
        <p>Aucune grille disponible...</p>
      ) : (
        <>
          <table className="evaluation-table">
            <thead>
              <tr>
                <th>Titre</th>
                <th>Critère 1</th>
                <th>Critère 2</th>
                <th>Critère 3</th>
                <th>Critère 4</th>
                <th>Critère 5</th>
                <th>Critère 6</th>
                <th>Critère 7</th>
                <th>Année</th>
              </tr>
            </thead>
            <tbody>
              {grids.map((grid) => (
                <tr key={grid.id}>
                  <td>{grid.titre}</td>
                  <td>{grid.critere1}</td>
                  <td>{grid.critere2}</td>
                  <td>{grid.critere3}</td>
                  <td>{grid.critere4}</td>
                  <td>{grid.critere5}</td>
                  <td>{grid.critere6}</td>
                  <td>{grid.critere7}</td>
                  <td>{grid.annee}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!isFileUploaded && (
            <div className="table-header">
              <Button
                variant="contained"
                className="import-button"
                startIcon={<UploadFileIcon />}
                onClick={() => fileInputRef.current.click()}
              >
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileInputChange}
              />
              <p className="important-message">
                Vous n'avez pas encore importé le PV
              </p>
            </div>
          )}
        </>
      )}
      {grids.length === 0 && (
        <Button variant="contained" onClick={openModal}>Créer une nouvelle grille</Button>
      )}

      <Dialog open={isModalOpen} onClose={closeModal}>
        <DialogTitle>Créer une nouvelle grille</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              margin="dense"
              label="Titre"
              name="titre"
              value={newGrid.titre}
              onChange={handleChange}
              fullWidth
              required
            />
            {[...Array(7)].map((_, i) => (
              <TextField
                select
                key={i}
                margin="dense"
                label={`Critère ${i + 1}`}
                name={`critere${i + 1}`}
                value={newGrid[`critere${i + 1}`]}
                onChange={handleChange}
                fullWidth
                required
              >
                {getAvailableOptions(`critere${i + 1}`).map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            ))}
            <TextField
              margin="dense"
              label="Année"
              name="annee"
              type="number"
              value={newGrid.annee}
              onChange={handleChange}
              fullWidth
              required
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">Créer</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Challenges;
