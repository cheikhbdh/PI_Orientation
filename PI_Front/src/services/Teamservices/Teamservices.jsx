import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/';

// Récupérer toutes les équipes
export const fetchTeams = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}teams`);
        return response.data;
    } catch (error) {
        console.error('Error fetching teams:', error);
        return [];
    }
};

// Ajouter une nouvelle équipe
export const addTeam = async (teamData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}teams/`, teamData);
        return response.data;
    } catch (error) {
        console.error('Error adding team:', error);
        throw error; // Throw error to handle it where this function is called
    }
};

// Mettre à jour une équipe existante
export const updateTeam = async (teamId, teamData) => {
    try {
        const response = await axios.put(`${API_BASE_URL}teams/${teamId}`, teamData);
        return response.data;
    } catch (error) {
        console.error(`Error updating team with ID ${teamId}:`, error);
        throw error;
    }
};

// Supprimer une équipe
export const deleteTeam = async (teamId) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}teams/${teamId}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting team with ID ${teamId}:`, error);
        throw error;
    }
};
