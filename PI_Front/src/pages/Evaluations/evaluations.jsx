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
    const [showCampaignSuccess, setShowCampaignSuccess] = useState(false);

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
            setShowCampaignSuccess(true); // Affiche le message de succès si une orientation est trouvée
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
        let value = parseInt(event.target.value);
        if (value < 0) {
            Swal.fire({
                title: "Erreur",
                text: "La capacité ne peut pas être négative",
                icon: "error",
                confirmButtonText: "OK"
            });
            value = 0;
        }

        const updatedFilieres = [...filieres];
        updatedFilieres[index].capacity = value.toString();
        setFilieres(updatedFilieres);

        const cnmCapacity = parseInt(updatedFilieres.find(filiere => filiere.name === 'CNM').capacity) || 0;
        const rssCapacity = parseInt(updatedFilieres.find(filiere => filiere.name === 'RSS').capacity) || 0;

        if (cnmCapacity + rssCapacity > numberOfStudents) {
            Swal.fire({
                title: "Erreur",
                text: "La somme des capacités de CNM et RSS ne peut pas dépasser le nombre total d'étudiants",
                icon: "error",
                confirmButtonText: "OK"
            });
            updatedFilieres[index].capacity = '';
            setFilieres(updatedFilieres);
            return;
        }

        if (!isNaN(cnmCapacity) && !isNaN(rssCapacity)) {
            const totalCapacityCNM_RSS = cnmCapacity + rssCapacity;
            const remainingStudents = numberOfStudents - totalCapacityCNM_RSS;
            const dsiIndex = updatedFilieres.findIndex(filiere => filiere.name === 'DSI');
            if (dsiIndex !== -1) {
                updatedFilieres[dsiIndex].capacity = Math.max(0, remainingStudents).toString();
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
        // Vérifiez que tous les champs sont remplis
        if (!startDate || !endDate || !numberOfStudents) {
            Swal.fire({
                title: "Erreur",
                text: "Veuillez remplir tous les champs",
                icon: "error",
                confirmButtonText: "OK"
            });
            return;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        const today = new Date();

        if (start.toDateString() < today.toDateString()) {
            Swal.fire({
                title: "Erreur",
                text: "La date de début ne peut pas être dans le passé",
                icon: "error",
                confirmButtonText: "OK"
            });
            return;
        }

        if (end < start) {
            Swal.fire({
                title: "Erreur",
                text: "La date de fin ne peut pas être antérieure à la date de début",
                icon: "error",
                confirmButtonText: "OK"
            });
            return;
        }

        for (const filiere of filieres) {
            if (!filiere.name || !filiere.capacity) {
                Swal.fire({
                    title: "Erreur",
                    text: "Veuillez remplir tous les champs de filières",
                    icon: "error",
                    confirmButtonText: "OK"
                });
                return;
            }
        }

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
                setShowCampaignSuccess(true); // Affiche le message de succès si une orientation est trouvée
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
            setShowCampaignSuccess(true); // Affiche le message de succès après la soumission du formulaire

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
            setShowCampaignSuccess(true); // Affiche le message de succès après l'envoi de l'e-mail
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
            {showCampaignSuccess && (
                <div className="success-message">
                    La campagne a été faite avec succès jusqu'à la date de fin {endDate}.
                </div>
            )}
            {openOrientation ? (
                <div>
                    <p>Orientation ouverte jusqu'au : {openOrientation.date_fin}</p>
                </div>
            ) : (
                !formSubmitted && (
                    <div>
                        <div className="form-group">
                            <label>Date début :</label>
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                        </div>
                        <div className="form-group-row">
                            <div className="form-group">
                                <label>Nombre d'étudiants :</label>
                                <input 
                                    type="number"
                                    value={numberOfStudents}
                                    onChange={(e) => setNumberOfStudents(parseInt(e.target.value))}
                                    required
                                />
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
                                            required
                                        />
                                        <input
                                            type="text"
                                            value={filiere.name}
                                            onChange={(event) => handleFiliereChange(index, event)}
                                            required
                                        />
                                        <input
                                            type="number"
                                            value={filiere.capacity}
                                            placeholder="Capacité"
                                            onChange={(event) => handleCapacityChange(index, event)}
                                            required
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
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
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
                        required
                    />
                    <TextField
                        label="Contenu"
                        value={contenu}
                        onChange={(e) => setContenu(e.target.value)}
                        fullWidth
                        multiline
                        rows={4}
                        required
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
