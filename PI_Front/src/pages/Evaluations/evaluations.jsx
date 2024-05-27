import React, { useState, useEffect } from 'react';
import './evaluation.css';
import axios from 'axios';
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
    const [numberOfStudents, setNumberOfStudents] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [userId, setUserId] = useState(null); // State to store user ID
    const [openDialog, setOpenDialog] = useState(false);
    const [sujet, setSujet] = useState('');
    const [contenu, setContenu] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // Fetch user ID before rendering the component
        fetchUserId();
        fetchStudentsData();

        // Check if form was submitted previously and end date is in the future
        const storedEndDate = localStorage.getItem('orientationEndDate');
        if (storedEndDate && new Date(storedEndDate) > new Date()) {
            setEndDate(storedEndDate);
            setFormSubmitted(true);
            const storedMessage = localStorage.getItem(`successMessage-${storedEndDate}`);
            if (storedMessage) {
                setSuccessMessage(storedMessage);
            }
        }
    }, []);

    // Function to fetch user ID
    const fetchUserId = async () => {
        const token=localStorage.getItem('token')
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        try {
            const userResponse = await axiosInstance.get('http://127.0.0.1:8000/user/',{
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'  
                }
            });
            setUserId(userResponse.data.id_u);
        } catch (error) {
            console.error('Failed to fetch user details:', error);
        }
    };

    // Function to fetch students data
    const fetchStudentsData = () => {
        fetch('http://127.0.0.1:8000/etudiants/')
            .then(response => response.json())
            .then(data => {
                // Update the number of students
                setNumberOfStudents(data.length);
            })
            .catch(error => console.error('Error fetching students:', error));
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

        // If CNM and RSS capacities are set, adjust DSI capacity
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
        setOpenDialog(true);
    };

    const handleEmailSending = async () => {
        try {
            const formData = {
                sujet: sujet,
                contenu: contenu
            };

            await axios.post('http://127.0.0.1:8000/envoyeremail/', formData);
            const storedEndDate = localStorage.getItem('orientationEndDate');
            setSuccessMessage(`E-mail envoyé avec succès.`);
            localStorage.setItem(`successMessage-${storedEndDate}`, successMessage);
        } catch (error) {
            console.error('Failed to send email:', error);
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
            {!formSubmitted ? (
                <div>
                    <div className="form-group">
                        <label>Date début :</label>
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
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
                        <label>Nombre d'étudiants :</label>
                        <input
                            type="number"
                            value={numberOfStudents}
                            onChange={(e) => setNumberOfStudents(e.target.value)}
                            placeholder="Nombre d'étudiants"
                        />
                    </div>
                    <div className="form-group">
                        <label>Date fin :</label>
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <button className="submit-btn" onClick={handleSubmission}>Soumettre</button>
                    </div>
                </div>
            ) : (
                <div>
                    <p>Formulaire envoyé avec succès !</p>
                    {/* Display the end date */}
                    <p>Date fin du formulaire : {endDate}</p>
                </div>
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