import axios, { AxiosError } from 'axios';
import { Standup, CreateStandupDto, UpdateStandupDto } from '../redux/standups/types';

const API_URL = 'http://localhost:4000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Type for API error response
interface ApiErrorResponse {
  message?: string;
  error?: string;
  [key: string]: any;
}

// Helper function to handle API errors
const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    
    // If we have a response with error data
    if (axiosError.response?.data) {
      console.error('API Error:', axiosError.response.data);
      const responseData = axiosError.response.data;
      
      if (typeof responseData === 'string') {
        throw new Error(responseData);
      } else if (responseData.message) {
        throw new Error(responseData.message);
      } else if (responseData.error) {
        throw new Error(responseData.error);
      } else {
        throw new Error(`Error ${axiosError.response.status}: ${axiosError.response.statusText}`);
      }
    }
    
    // If we have a request error but no response (network error)
    if (axiosError.request) {
      console.error('Network Error:', axiosError.message);
      throw new Error('Network error. Please check your connection and try again.');
    }
  }
  
  // Fallback for non-Axios errors
  console.error('Unexpected error:', error);
  throw new Error('An unexpected error occurred');
};

// Standup API calls
export const standupAPI = {
  // Get all standups
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/standups', { params });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Get standup by date
  getByDate: async (date: string) => {
    try {
      const response = await api.get(`/standups/${date}`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Get standups by date range
  getByDateRange: async (startDate: string, endDate: string) => {
    try {
      const response = await api.get('/standups/range', { params: { startDate, endDate } });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Get highlight standups
  getHighlights: async () => {
    try {
      const response = await api.get('/standups/highlights');
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Create new standup
  create: async (standup: CreateStandupDto) => {
    try {
      console.log('API: Creating standup with data:', standup);
      const response = await api.post('/standups', standup);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Update standup
  update: async (date: string, standup: UpdateStandupDto) => {
    try {
      console.log('API: Updating standup with data:', standup);
      const response = await api.put(`/standups/${date}`, standup);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Delete standup
  delete: async (date: string) => {
    try {
      const response = await api.delete(`/standups/${date}`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Toggle highlight status
  toggleHighlight: async (date: string) => {
    try {
      console.log('API: Toggling highlight for date:', date);
      
      // Make the API call with explicit URL and headers
      const url = `${API_URL}/standups/${date}/highlight`;
      console.log('API: Making PATCH request to:', url);
      
      const response = await axios({
        method: 'PATCH',
        url: url,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('API: Toggle highlight raw response:', response);
      
      // Return full response for consistent handling
      return {
        status: response.status,
        statusText: response.statusText,
        data: response.data
      };
    } catch (error) {
      console.error('API: Toggle highlight error:', error);
      return handleApiError(error);
    }
  },
  
  // Search standups
  search: async (keyword: string) => {
    try {
      const response = await api.get('/standups/search', { params: { keyword } });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Get statistics
  getStats: async () => {
    try {
      const response = await api.get('/standups/stats');
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }
};

// Query API calls
export const queryAPI = {
  // Get weekly summary
  getWeeklySummary: async () => {
    try {
      const response = await api.get('/query/week');
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Get monthly summary
  getMonthlySummary: async (month: string) => {
    try {
      const response = await api.get(`/query/month/${month}`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Get blockers
  getBlockers: async () => {
    try {
      const response = await api.get('/query/blockers');
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Process natural language query
  processQuery: async (query: string) => {
    try {
      console.log('Sending query to API:', query);
      const response = await api.post('/query', { query });
      console.log('Raw API response:', response);
      
      // Make sure we return the full response for debugging
      return {
        status: response.status,
        statusText: response.statusText,
        data: response.data
      };
    } catch (error) {
      console.error('Error in processQuery:', error);
      return handleApiError(error);
    }
  }
};

export default api; 