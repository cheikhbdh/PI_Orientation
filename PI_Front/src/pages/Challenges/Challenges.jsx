import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';

const Challenges = () => {
  const [grids, setGrids] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const criteriaOptions = [
    'Moyenne du semestre',
    'Crédits',
    'MOYENNE DEV',
    'MOYENNE SYR',
    'PSP',
    'MOYENNE PST',
    'MOYENNE HE'
  ];

  useEffect(() => {
    fetchGrids();
  }, []);

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

  const getAvailableOptions = (currentCritere) => {
    return criteriaOptions.filter(option => !usedCriteria.includes(option) || option === newGrid[currentCritere]);
  };

  return (
    <div>
      <h1>Grid Evaluations</h1>
      {grids.length === 0 ? (
        <p>Aucun grid disponible...</p>
      ) : (
        <ul>
          {grids.map((grid) => (
            <li key={grid.id}>{grid.titre}</li>
          ))}
        </ul>
      )}
      <Button variant="contained" onClick={openModal}>Créer une nouvelle grille</Button>

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
                label={`Critere ${i + 1}`}
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
