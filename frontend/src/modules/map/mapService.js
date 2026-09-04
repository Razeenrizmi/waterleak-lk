import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5001' : 'https://waterleaklk1.vercel.app');

// Member 2: Map Module API Service
export const mapService = {
  // Get all leaks for the interactive map
  getAllLeaks: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/map/leaks`);
      return response.data;
    } catch (error) {
      console.error('Error fetching leaks:', error);
      throw error;
    }
  },

  // Get a single leak by ID (for details view)
  getLeakById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/map/leaks/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching leak details:', error);
      throw error;
    }
  }
};
