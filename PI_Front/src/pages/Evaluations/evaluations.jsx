import React, { useState, useEffect } from 'react';
import './evaluation.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";

function Evaluations() {
    const [filieres, setFilieres] = useState([
        { name: 'CNM', checked: true, capacity: '' },
        { name: 'RSS', checked: true, capacity: '' },
        { name: 'DSI', checked: true, capacity: '' }
    ]);
    const axiosInstance = axios.create({
        withCredentials: true,
    });
    const [numberOfStudents, setNumberOfStudents] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [userId, setUserId] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [sujet, setSujet] = useState('');
    const [contenu, setContenu] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [openOrientation, setOpenOrientation] = useState(null);

    useEffect(() => {
        fetchUserId();
        fetchStudentsData();
        fetchOpenOrientation();
    }, []);

    useEffect(() => {
        const savedOrientation = localStorage.getItem('openOrientation');
        if (savedOrientation) {
            const orientation = JSON.parse(savedOrientation);
            setOpenOrientation(orientation);
            setEndDate(orientation.date_fin);
            setFormSubmitted(true);
        }
    }, []);

    const fetchUserId = async () => {
        const token = localStorage.getItem('token');
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        try {
            const userResponse = await axiosInstance.get('http://127.0.0.1:8000/user/', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            setUserId(userResponse.data.id_u);
        } catch (error) {
            console.error('Échec de la récupération des détails de l\'utilisateur :', error);
        }
    };

    const fetchStudentsData = () => {
        fetch('http://127.0.0.1:8000/etudiants/')
            .then(response => response.json())
            .then(data => {
                setNumberOfStudents(data.length);
            })
            .catch(error => console.error('Erreur lors de la récupération des étudiants :', error));
    };

    const fetchOpenOrientation = async () => {
        try {
            const response = await axiosInstance.get('http://127.0.0.1:8000/orientations/', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            const orientations = response.data;
            const openOrientation = orientations.find(orientation => orientation.status === 'ouvert');

            if (openOrientation) {
                setOpenOrientation(openOrientation);
                setEndDate(openOrientation.date_fin);
                setFormSubmitted(true);
                localStorage.setItem('openOrientation', JSON.stringify(openOrientation));
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des orientations :', error);
        }
    };

    const handleCheckboxChange = (index) => {
        const updatedFilieres = [...filieres];
        updatedFilieres[index].checked = !updatedFilieres[index].checked;
        setFilieres(updatedFilieres);
    };

    const handleFiliereChange = (index, event) => {
        const updatedFilieres = [...filieres];
        updatedFilieres[index].name = event.target.value;
        setFilieres(updatedFilieres);
    };

    const handleCapacityChange = (index, event) => {
        const updatedFilieres = [...filieres];
        updatedFilieres[index].capacity = event.target.value;
        setFilieres(updatedFilieres);

        const cnmCapacity = parseInt(updatedFilieres.find(filiere => filiere.name === 'CNM').capacity) || 0;
        const rssCapacity = parseInt(updatedFilieres.find(filiere => filiere.name === 'RSS').capacity) || 0;

        if (!isNaN(cnmCapacity) && !isNaN(rssCapacity)) {
            const totalCapacityCNM_RSS = cnmCapacity + rssCapacity;
            const remainingStudents = numberOfStudents - totalCapacityCNM_RSS;
            const dsiIndex = updatedFilieres.findIndex(filiere => filiere.name === 'DSI');
            if (dsiIndex !== -1) {
                updatedFilieres[dsiIndex].capacity = remainingStudents.toString();
                setFilieres(updatedFilieres);
            }
        }
    };

    const removeFiliere = (index) => {
        const updatedFilieres = [...filieres];
        updatedFilieres.splice(index, 1);
        setFilieres(updatedFilieres);
    };

    const addFiliere = () => {
        setFilieres([...filieres, { name: '', checked: true, capacity: '' }]);
    };

    const handleSubmission = () => {
        Swal.fire({
            title: "Voulez-vous envoyer un email aux étudiants ?",
            icon: "question",
            confirmButtonText: "Oui",
            cancelButtonText: "Non",
            showCancelButton: true,
            showCloseButton: true
        }).then((result) => {
            if (result.isConfirmed) {
                setOpenDialog(true);
            } else {
                setFormSubmitted(true);
            }
        });
        submitFormData();
    };

    const submitFormData = async () => {
        try {
            const cnmFiliere = filieres.find(filiere => filiere.name === 'CNM');
            const rssFiliere = filieres.find(filiere => filiere.name === 'RSS');
            const dsiFiliere = filieres.find(filiere => filiere.name === 'DSI');

            const capacite_cnm = cnmFiliere ? parseInt(cnmFiliere.capacity) : 0;
            const capacite_rss = rssFiliere ? parseInt(rssFiliere.capacity) : 0;
            const capacite_dsi = dsiFiliere ? parseInt(dsiFiliere.capacity) : 0;

            const formData = {
                titre: 'choix',
                date_debut: startDate,
                date_fin: endDate,
                capacite_cnm,
                capacite_rss,
                capacite_dsi,
                nombre_etudiants: numberOfStudents,
                idu: userId
            };

            const response = await axiosInstance.post('http://127.0.0.1:8000/orientations/', formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            setSuccessMessage('Formulaire soumis avec succès.');
            setFormSubmitted(true);

            console.log('Réponse du serveur :', response.data);
        } catch (error) {
            console.error('Échec de la soumission du formulaire :', error);
            setErrorMessage('Erreur lors de la soumission du formulaire.');
        }
    };

    const handleEmailSending = async () => {
        try {
            const formData = {
                sujet: sujet,
                contenu: contenu
            };

            await axiosInstance.post('http://127.0.0.1:8000/envoyeremail/', formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            setSuccessMessage('E-mail envoyé avec succès.');
        } catch (error) {
            console.error('Échec de l\'envoi de l\'e-mail :', error);
            setErrorMessage('Erreur lors de l\'envoi de l\'e-mail.');
        }
        setOpenDialog(false);
        setFormSubmitted(true);
    };

    const handleCancel = () => {
        setOpenDialog(false);
    };

    return (
        <div className="form-container">
            {openOrientation ? (
                <div>
                    <p>Orientation ouverte jusqu'au : {openOrientation.date_fin}</p>
                </div>
            ) : (
                !formSubmitted && (
                    <div>
                        <div className="form-group">
                            <label>Date début :</label>
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        </div>
                        <div className="form-group-row">
                            <div className="form-group">
                                <label>Nombre d'étudiants :</label>
                                <div className="students-count">
                                    {numberOfStudents}
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Filières :</label>
                            <div className="checkbox-group">
                                {filieres.map((filiere, index) => (
                                    <div key={index} className="filiere-group">
                                        <input
                                            type="checkbox"
                                            checked={filiere.checked}
                                            onChange={() => handleCheckboxChange(index)}
                                        />
                                        <input
                                            type="text"
                                            value={filiere.name}
                                            onChange={(event) => handleFiliereChange(index, event)}
                                        />
                                        <input
                                            type="number"
                                            value={filiere.capacity}
                                            placeholder="Capacité"
                                            onChange={(event) => handleCapacityChange(index, event)}
                                        />
                                        {index > 2 && (
                                            <button onClick={() => removeFiliere(index)}>×</button>
                                        )}
                                    </div>
                                ))}
                                <button onClick={addFiliere}>Ajouter filière</button>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Date fin :</label>
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <button className="submit-btn" onClick={handleSubmission}>Soumettre</button>
                        </div>
                    </div>
                )
            )}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Envoyer un e-mail</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Sujet"
                        value={sujet}
                        onChange={(e) => setSujet(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Contenu"
                        value={contenu}
                        onChange={(e) => setContenu(e.target.value)}
                        fullWidth
                        multiline
                        rows={4}
                    />
                </DialogContent>
                <DialogActions>
                    <button onClick={handleCancel}>Annuler</button>
                    <button onClick={handleEmailSending}>Envoyer</button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Evaluations;
