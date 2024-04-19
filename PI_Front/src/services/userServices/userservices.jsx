import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/';

export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}usersRole/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Users:', error);
    return [];
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting User ${userId}:`, error);
    throw error;
  }
};
