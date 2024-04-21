import React, { useState, useEffect } from 'react';
import './evaluation.css';

function Evaluations() {
    const [filieres, setFilieres] = useState([
        { name: 'CNM', checked: true, capacity: '' },
        { name: 'RSS', checked: true, capacity: '' },
        { name: 'DSI', checked: true, capacity: '' }
    ]);
    const [numberOfStudents, setNumberOfStudents] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [formSubmitted, setFormSubmitted] = useState(false);

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

    useEffect(() => {
        fetchStudentsData();
    }, []);

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
        const formData = {
            date_debut: startDate,
            capacite_cnm: parseInt(filieres.find(filiere => filiere.name === 'CNM').capacity) || 0,
            capacite_rss: parseInt(filieres.find(filiere => filiere.name === 'RSS').capacity) || 0,
            capacite_dsi: parseInt(filieres.find(filiere => filiere.name === 'DSI').capacity) || 0,
            nombre_etudiants: numberOfStudents,
            date_fin: endDate
        };

        fetch('http://127.0.0.1:8000/orientations/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de l\'enregistrement des données.');
            }
            setFormSubmitted(true);
            // Refresh number of students data after successful submission
            fetchStudentsData();
        })
        .catch(error => {
            alert(error.message);
        });
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
                </div>
            )}
        </div>
    );
}

export default Evaluations;
