import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '../../components/table/Table';
import { fetchEtudiants, deleteEtudiant } from './etudiantServices';
import './jery.css';

const customerTableHead = [
    '',
    'Matricule',
    'Nom',
    'Prénom',
    'Semestre',
    'Année',
    'Email',
];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const renderBody = (item, index, handleDelete) => (
    <tr key={index}>
        <td></td>
        <td>{item.matricule}</td>
        <td>{item.nom}</td>
        <td>{item.prenom}</td>
        <td>{item.semestre}</td>
        <td>{item.annee}</td>
        <td>{item.email}</td>
    </tr>
);

const Jery = () => {
    const [etudiantList, setEtudiantList] = useState([]);
    const [file, setFile] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchEtudiants();
                setEtudiantList(data);
            } catch (error) {
                console.error('Error fetching etudiants:', error);
            }
        };

        fetchData();
    }, []);

    const handleDelete = async (etudiantId) => {
        try {
            await deleteEtudiant(etudiantId);
            const updatedEtudiants = etudiantList.filter(etudiant => etudiant.idE !== etudiantId);
            setEtudiantList(updatedEtudiants);
        } catch (error) {
            console.error('Error deleting etudiant:', error);
        }
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleImport = async () => {
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                await axios.post('http://127.0.0.1:8000/import-etudiants/', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                alert('Importation réussie');
                // Vous pouvez rafraîchir la liste des étudiants après l'importation
                const data = await fetchEtudiants();
                setEtudiantList(data);
            } catch (error) {
                console.error('Error importing file:', error);
                alert('Erreur lors de l\'importation du fichier');
            }
        } else {
            alert('Veuillez sélectionner un fichier');
        }
    };

    return (
        <div>
            <div className="header">
                <h2 className="page-header">Liste des étudiants</h2>
                <div className="import-container">
                    <input type="file" onChange={handleFileChange} />
                    <button className="import-button" onClick={handleImport}>Import Data</button>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card__body">
                            <Table
                                limit='10'
                                headData={customerTableHead}
                                renderHead={(item, index) => renderHead(item, index)}
                                bodyData={etudiantList}
                                renderBody={(item, index) => renderBody(item, index, handleDelete)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Jery;
