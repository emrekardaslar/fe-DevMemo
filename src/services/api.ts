import axios from 'axios';
import { Standup } from '../redux/standups/types';

const API_URL = 'http://localhost:4000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Standup API calls
export const standupAPI = {
  // Get all standups
  getAll: async (params = {}) => {
    const response = await api.get('/standups', { params });
    return response.data;
  },
  
  // Get standup by date
  getByDate: async (date: string) => {
    const response = await api.get(`/standups/${date}`);
    return response.data;
  },
  
  // Get standups by date range
  getByDateRange: async (startDate: string, endDate: string) => {
    const response = await api.get('/standups/range', { params: { startDate, endDate } });
    return response.data;
  },
  
  // Get highlight standups
  getHighlights: async () => {
    const response = await api.get('/standups/highlights');
    return response.data;
  },
  
  // Create new standup
  create: async (standup: Omit<Standup, 'createdAt' | 'updatedAt'>) => {
    const response = await api.post('/standups', standup);
    return response.data;
  },
  
  // Update standup
  update: async (date: string, standup: Partial<Standup>) => {
    const response = await api.put(`/standups/${date}`, standup);
    return response.data;
  },
  
  // Delete standup
  delete: async (date: string) => {
    const response = await api.delete(`/standups/${date}`);
    return response.data;
  },
  
  // Toggle highlight status
  toggleHighlight: async (date: string) => {
    const response = await api.patch(`/standups/${date}/highlight`);
    return response.data;
  },
  
  // Search standups
  search: async (keyword: string) => {
    const response = await api.get('/standups/search', { params: { keyword } });
    return response.data;
  },
  
  // Get statistics
  getStats: async () => {
    const response = await api.get('/standups/stats');
    return response.data;
  }
};

// Query API calls
export const queryAPI = {
  // Get weekly summary
  getWeeklySummary: async () => {
    const response = await api.get('/query/week');
    return response.data;
  },
  
  // Get monthly summary
  getMonthlySummary: async (month: string) => {
    const response = await api.get(`/query/month/${month}`);
    return response.data;
  },
  
  // Get blockers
  getBlockers: async () => {
    const response = await api.get('/query/blockers');
    return response.data;
  },
  
  // Process natural language query
  processQuery: async (query: string) => {
    const response = await api.post('/query', { query });
    return response.data;
  }
};

export default api; 