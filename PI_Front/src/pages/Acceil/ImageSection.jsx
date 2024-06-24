import React, { useEffect, useState } from "react";
import axiosInstance from "../../components/axiosinstance/axiosinstance";
import SuccessAlert from "../../components/Alert/succesalert";
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "./acceil.css";

const ImageSection = ({ userEmail, isCampagneOuverte, choice, readOnly = false, onModifyChoices, modifyChoices, orientationId }) => {
    const [choices, setChoices] = useState({
        choix1: choice ? choice.choix1 : '',
        choix2: choice ? choice.choix2 : '',
        choix3: choice ? choice.choix3 : '',
    });
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const matricule = userEmail?.substring(0, 5); // Assurez-vous que 'matricule' est correct

    const submitModifiedChoices = async () => {
        const dataWithIds = {
            idE: matricule, // Utilisez l'ID étudiant réel ici
            idc: orientationId,
            ...choices
        };
        const endpoint = `choice/${matricule}/`; // Assurez-vous que cette URL est correcte
        try {
            const response = await axiosInstance.put(endpoint, dataWithIds);
            console.log(response.data);
            setShowSuccessAlert(true); 
        } catch (error) {
            console.error('Failed to submit modified choices:', error);
            // Gérer l'erreur (afficher un message d'erreur à l'utilisateur)
        }
    };

    const handleChoice = (event) => {
        if (!readOnly) {
            const { name, value } = event.target;
            setChoices(prevChoices => {
                const updatedChoices = { ...prevChoices, [name]: value };
                console.log("Updated Choices:", updatedChoices); // Debugging
                return updatedChoices;
            });
        }
    };

    const isChoiceSelected = (value) => {
        return Object.values(choices).includes(value);
    };

    const isAllChoicesSelected = () => {
        return Object.values(choices).every(choice => choice !== '');
    };

    const resetChoices = () => {
        setChoices({
            choix1: '',
            choix2: '',
            choix3: '',
        });
    };

    useEffect(() => {
        if (showSuccessAlert) {
            const timer = setTimeout(() => {
                window.location.reload(); 
            }, 3000);

            return () => clearTimeout(timer); 
        }
    }, [showSuccessAlert]);

    const submitChoices = async (event) => {
        event.preventDefault();
        const dataWithIds = {
            idE: matricule, // Utilisez l'ID étudiant réel ici
            idc: orientationId,
            ...choices
        };
        const endpoint = 'choice/';
        try {
            const response = await axiosInstance.post(endpoint, dataWithIds);
            console.log(response.data);
            setShowSuccessAlert(true);
        } catch (error) {
            console.error('Failed to submit choices:', error);
            // Handle error (show error message to user)
        }
    };

    return (
        <>
            <form onSubmit={submitChoices} >
                {!readOnly && !showSuccessAlert && !modifyChoices &&
                    <div className="container2">
                        <div className="top-bar"></div>
                        <div className="header">
                            <b>
                                <h2>Formulaire choix de la filière de spécialité</h2>
                            </b>
                        </div>
                        <div className="form-group">
                            <div className="message">
                                on prend Votre matricule {matricule} a l'aide de votre email supnum
                            </div>
                        </div>
                    </div>
                }
                <div className="container2">
                    {showSuccessAlert && !modifyChoices && <SuccessAlert message="Les choix ont été envoyés avec succès !" />}
                    {showSuccessAlert && modifyChoices && <SuccessAlert message="Les choix ont été modifier avec succès !" />}
                    <div className="priority">
                        <label>
                            <b>Prière faire trois choix par ordre de priorité *</b>
                        </label>
                        <div className="row">
                            <div className="cell"></div>
                            <div className="cell">Multimedia (CNM)</div>
                            <div className="cell">Developpement (DSI)</div>
                            <div className="cell">Réseaux (RSS)</div>
                        </div>
                        {['choix1', 'choix2', 'choix3'].map(choix => (
                            <div className="rows" key={choix}>
                                <div className="cell">{`Choix ${choix[choix.length - 1]}`}</div>
                                {['CNM', 'DSI', 'RSS'].map(filiere => (
                                    <div className="cell" key={`${choix}-${filiere}`}>
                                        <input
                                            className="priority-input"
                                            type="radio"
                                            name={choix}
                                            value={filiere}
                                            checked={choices[choix] === filiere}
                                            onChange={handleChoice}
                                            disabled={(isChoiceSelected(filiere) && choices[choix] !== filiere) || readOnly}
                                        />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                    {!readOnly && !showSuccessAlert && !modifyChoices && <button type="submit" className="submit-btn">Envoyer</button>}
                    {modifyChoices && (
                        <button type="button" className="submit-btn" onClick={submitModifiedChoices}>
                            Soumettre les modifications
                        </button>
                    )}
                    {!readOnly && !showSuccessAlert && isAllChoicesSelected() && (
                        <button type="button" className="reset-btn" onClick={resetChoices}>
                            <FontAwesomeIcon icon={faSyncAlt} />
                        </button>
                    )}
                </div>
            </form>
            {readOnly && isCampagneOuverte && <div className="contineur2"><div className="header">vous vouler modifier votre choix?{" "} <button className="already-responded-btn" onClick={onModifyChoices}>
                modifier les choix
            </button></div></div>}
            {readOnly && !isCampagneOuverte && <div className="contineur2"><div className="header" style={{ color: 'red' }}>vous ne peut pas modifier votre choix a cause de date limite termine ou l'dministrateur fermer cette fonctionaliter{" "} 
            </div></div>}
        </>
    );
};

export default ImageSection;
