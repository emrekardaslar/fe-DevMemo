import axios, { AxiosError } from 'axios';
import { Standup, CreateStandupDto, UpdateStandupDto } from '../redux/standups/types';

// Get API URL from Vite env
const API_URL: string = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Vite env type declaration for TypeScript
declare global {
  interface ImportMeta {
    env: {
      VITE_API_URL?: string;
      [key: string]: any;
    };
  }
}

// Type declaration for window
declare global {
  interface Window {
    __REACT_APP_API_URL?: string;
  }
}

// Determine if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

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
      throw new Error('Network error. Please check your connection and try again.');
    }
  }
  
  // Fallback for non-Axios errors
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
      const response = await api.post('/standups', standup);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Update standup
  update: async (date: string, standup: UpdateStandupDto) => {
    try {
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
      // Use the api instance instead of creating a new axios instance
      // This ensures we use the same baseURL configuration
      const timestamp = new Date().toISOString();
      
      const response = await api.patch(`/standups/${date}/highlight`, {}, {
        headers: {
          'X-Request-Time': timestamp
        }
      });
      
      // Return full response for consistent handling
      return {
        status: response.status,
        statusText: response.statusText,
        data: response.data
      };
    } catch (error) {
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
  getWeeklySummary: async (startDate?: string, endDate?: string) => {
    try {
      const params: Record<string, string> = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const response = await api.get('/query/week', { params });
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
  
  // Get all standups that have blockers
  getAllWithBlockers: async () => {
    try {
      // This uses the standups API with a filter for non-empty blockers
      const response = await api.get('/standups', { 
        params: { hasBlockers: true } 
      });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Process natural language query
  processQuery: async (query: string) => {
    try {
      const response = await api.post('/query', { query });
      
      // Make sure we return the full response for debugging
      return {
        status: response.status,
        statusText: response.statusText,
        data: response.data
      };
    } catch (error) {
      return handleApiError(error);
    }
  }
};

export default api; 