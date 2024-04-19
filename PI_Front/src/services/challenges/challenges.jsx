import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/';

export const fetchChallenges = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}challenge/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching challenges:', error);
    return [];
  }
};
