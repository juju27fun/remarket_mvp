import axios from 'axios';
import { API_FULL_URL } from '../utils/constants';
import { getAccessToken } from '../utils/auth'; // A utility to get access token if you have one

export async function fetchData(endpoint) {
  try {
    const url = `${API_FULL_URL}/${endpoint}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

const apiService = {
  getData: async (endpoint) => {
    try {
      const url = `${API_FULL_URL}/${endpoint}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },

  postData: async (endpoint, data) => {
    try {
      const url = `${API_FULL_URL}/${endpoint}`;
      const response = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error posting data:", error);
      throw error;
    }
  },

  putData: async (endpoint, data) => {
    try {
      const url = `${API_FULL_URL}/${endpoint}`;
      const response = await axios.put(url, data, {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating data:", error);
      throw error;
    }
  },

  deleteData: async (endpoint) => {
    try {
      const url = `${API_FULL_URL}/${endpoint}`;
      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting data:", error);
      throw error;
    }
  }
};

export default apiService;
