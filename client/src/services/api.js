import axios from 'axios';

const API_BASE_URL = '/api';

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};
