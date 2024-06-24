import React, { useState, useEffect } from "react";
import { Redirect } from 'react-router-dom';
import axios from "axios";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import axiosInstance from "../../components/axiosinstance/axiosinstance";
import './Orientations.css';
import './choixFiliere.css';

const Orientations = () => {
  const [orientations, setOrientations] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openCampagneDialog, setOpenCampagneDialog] = useState(false);
  const [selectedOrientation, setSelectedOrientation] = useState(null);
  const [etudiants, setEtudiants] = useState([]);
  const [newOrientation, setNewOrientation] = useState({
    titre: '',
    date_debut: '',
    date_fin: '',
    capacite_cnm: '',
    capacite_dsi: '',
    capacite_rss: '',
    nombre_etudiants: '',
    idu: ''
  });
  const [redirectTo, setRedirectTo] = useState(null);

  useEffect(() => {
    fetchOrientations();
    fetchEtudiants();
  }, []);

  const fetchOrientations = () => {
    axiosInstance
      .get('http://127.0.0.1:8000/orientations/')
      .then((response) => {
        setOrientations(response.data);
      })
      .catch((error) => {
        console.error('Error fetching orientations:', error);
      });
  };

  const fetchEtudiants = () => {
    axios
      .get('http://127.0.0.1:8000/etudiants/')
      .then((response) => {
        setEtudiants(response.data);
      })
      .catch((error) => {
        console.error('Error fetching etudiants:', error);
      });
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrientation(null);
    setNewOrientation({
      titre: '',
      date_debut: '',
      date_fin: '',
      capacite_cnm: '',
      capacite_dsi: '',
      capacite_rss: '',
      nombre_etudiants: '',
      idu: ''
    });
  };

  const handleOpenCampagneDialog = () => {
    setOpenCampagneDialog(true);
  };

  const handleCloseCampagneDialog = () => {
    setOpenCampagneDialog(false);
  };

  const handleOpenDetailsPage = (orientation) => {
    setRedirectTo(`/details/${orientation.idO}`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOrientation((prevOrientation) => ({
      ...prevOrientation,
      [name]: value,
    }));
  };

  const handleEditOrientation = (orientation) => {
    setSelectedOrientation(orientation);
    setNewOrientation({ ...orientation });
    setOpenDialog(true);
  };

  const handleSaveOrientation = () => {
    if (selectedOrientation) {
      axiosInstance
        .put(`http://127.0.0.1:8000/orientations/${selectedOrientation.idO}/`, newOrientation)
        .then(() => {
          handleCloseDialog();
          fetchOrientations();
        })
        .catch((error) => {
          console.error('Error updating orientation:', error);
        });
    } else {
      axiosInstance
        .post('http://127.0.0.1:8000/orientations/', newOrientation)
        .then(() => {
          handleCloseDialog();
          fetchOrientations();
        })
        .catch((error) => {
          console.error('Error creating orientation:', error);
        });
    }
  };

  const handleCloseOrientation = (orientation) => {
    const updatedOrientation = {
      ...orientation,
      status: 'fermer'
    };

    axiosInstance
      .put(`http://127.0.0.1:8000/orientations/${orientation.idO}/`, updatedOrientation)
      .then((response) => {
        fetchOrientations();
        handleCloseCampagneDialog();
      })
      .catch((error) => {
        console.error('Error closing orientation:', error);
      });
  };

  const getMatriculeById = (idE) => {
    const etudiant = etudiants.find(etudiant => etudiant.idE === idE);
    return etudiant ? etudiant.matricule : 'N/A';
  };

  const openOrientations = orientations.filter(orientation => orientation.status === 'ouvert');
  const closedOrientations = orientations.filter(orientation => orientation.status === 'fermer');

  if (redirectTo) {
    return <Redirect to={redirectTo} />;
  }

  return (
    <div>
      <div className="page-header">
        <h2>Orientations</h2>
        <Button className="campagne-button" variant="outlined" color="info" size="small" onClick={handleOpenCampagneDialog}>
          Campagne Ouvert
        </Button>
      </div>
      <div className="table-container">
        {closedOrientations.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Titre</th>
                <th>Date de Debut</th>
                <th>Date de Fin</th>
                <th>Statut</th>
                <th>Nombre des Etudiants</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {closedOrientations.map((orientation) => (
                <tr key={orientation.idO}>
                  <td>{orientation.titre}</td>
                  <td>{orientation.date_debut}</td>
                  <td>{orientation.date_fin}</td>
                  <td>{orientation.status}</td>
                  <td>{orientation.nombre_etudiants}</td>
                  <td>
                    <Button
                      className="edit-button"
                      variant="text"
                      color="primary"
                      startIcon={<EditIcon />}
                      onClick={() => handleEditOrientation(orientation)}
                    >
                      Modifier
                    </Button>
                    <Button
                      className="details-button"
                      variant="text"
                      color="secondary"
                      startIcon={<MoreVertIcon />}
                      onClick={() => handleOpenDetailsPage(orientation)}
                    >
                      Détails
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No closed orientations available.</p>
        )}
      </div>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{selectedOrientation ? 'Edit Orientation' : 'Add Orientation'}</DialogTitle>
        <DialogContent className="dialog-content">
          <TextField
            label="Titre"
            name="titre"
            value={newOrientation.titre}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Date de Debut"
            name="date_debut"
            value={newOrientation.date_debut}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Date de Fin"
            name="date_fin"
            value={newOrientation.date_fin}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Capacité CNM"
            name="capacite_cnm"
            value={newOrientation.capacite_cnm}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Capacité DSI"
            name="capacite_dsi"
            value={newOrientation.capacite_dsi}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Capacité RSS"
            name="capacite_rss"
            value={newOrientation.capacite_rss}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Nombre des Étudiants"
            name="nombre_etudiants"
            value={newOrientation.nombre_etudiants}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="ID Utilisateur"
            name="idu"
            value={newOrientation.idu}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveOrientation}>{selectedOrientation ? 'Save' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openCampagneDialog} onClose={handleCloseCampagneDialog}>
        <DialogTitle>Campagnes Ouvertes</DialogTitle>
        <DialogContent className="dialog-content">
          {openOrientations.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Date de Debut</th>
                  <th>Date de Fin</th>
                  <th>Statut</th>
                  <th>Nombre des Etudiants</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {openOrientations.map((orientation) => (
                  <tr key={orientation.idO}>
                    <td>{orientation.titre}</td>
                    <td>{orientation.date_debut}</td>
                    <td>{orientation.date_fin}</td>
                    <td>{orientation.status}</td>
                    <td>{orientation.nombre_etudiants}</td>
                    <td>
                      <Button
                        className="close-button"
                        variant="contained"
                        color="secondary"
                        startIcon={<PowerSettingsNewIcon />}
                        onClick={() => handleCloseOrientation(orientation)}
                      >
                        Clôture
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No open orientations available.</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCampagneDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Orientations;
