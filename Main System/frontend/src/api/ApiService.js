import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; // Update with your actual backend URL

export const fetchData = async (endpoint) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${endpoint}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};
