// remarket_frontend/src/utils/api.js
import axios from 'axios';
import { API_FULL_URL } from './constants';

export async function fetchData(endpoint) {
  try {
    const url = `${API_FULL_URL}/${endpoint}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}