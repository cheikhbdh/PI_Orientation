import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/etudiants/';

export const fetchEtudiants = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching etudiants:', error);
        throw error;
    }
};

export const deleteEtudiant = async (etudiantId) => {
    try {
        await axios.delete(`${API_URL}${etudiantId}/`);
    } catch (error) {
        console.error('Error deleting etudiant:', error);
        throw error;
    }
};
