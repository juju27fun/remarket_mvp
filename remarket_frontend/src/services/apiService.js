// remarket_frontend/src/services/apiService.js
import { fetchData } from "../utils/api";

const apiService = {
  getData: async (endpoint) => {
    return fetchData(endpoint);
  },
  postData: async (endpoint, data) => {
    try {
      const url = `${API_FULL_URL}/${endpoint}`;
      const response = await axios.post(url, data);
      return response.data;
    } catch (error) {
      console.error("Error posting data:", error);
      throw error;
    }
  },
  // Add other methods as needed.
};

export default apiService;
