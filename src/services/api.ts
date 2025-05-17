import axios, { AxiosError } from 'axios';
import { Standup, CreateStandupDto, UpdateStandupDto } from '../redux/features/standups/types';
import { 
  LoginCredentials, 
  RegisterCredentials, 
  User 
} from '../redux/features/auth/types';

// Get API URL from Vite env
const API_URL: string = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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

// API response format
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
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
      // Check if the response has a nested data structure
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Get standup by date
  getByDate: async (date: string) => {
    try {
      const response = await api.get(`/standups/${date}`);
      // Check if the response has a nested data structure
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Get standups by date range
  getByDateRange: async (startDate: string, endDate: string) => {
    try {
      const response = await api.get('/standups/range', { params: { startDate, endDate } });
      // Check if the response has a nested data structure
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Get highlight standups
  getHighlights: async () => {
    try {
      const response = await api.get('/standups/highlights');
      // Check if the response has a nested data structure
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
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
      // Check if the response has a nested data structure
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
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
      // Check if the response has a nested data structure
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Delete standup
  delete: async (date: string) => {
    try {
      const response = await api.delete(`/standups/${date}`);
      // Check if the response has a nested data structure
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Toggle highlight status
  toggleHighlight: async (date: string) => {
    try {
      console.log('API: Toggling highlight for date:', date);
      
      // Use the api instance instead of creating a new axios instance
      // This ensures we use the same baseURL configuration
      const timestamp = new Date().toISOString();
      console.log(`API: Request started at ${timestamp}`);
      
      const response = await api.patch(`/standups/${date}/highlight`, {}, {
        headers: {
          'X-Request-Time': timestamp
        }
      });
      
      console.log(`API: Response received at ${new Date().toISOString()}`);
      console.log('API: Toggle highlight response status:', response.status);
      console.log('API: Toggle highlight response data:', response.data);
      
      // Check if the response has a nested data structure and return the data
      if (response.data && response.data.success && response.data.data) {
        return {
          status: response.status,
          statusText: response.statusText,
          data: response.data.data
        };
      }
      
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
      // Check if the response has a nested data structure
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Get statistics
  getStats: async () => {
    try {
      const response = await api.get('/standups/stats');
      // Check if the response has a nested data structure
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }
};

// Auth API services
export const authAPI = {
  // Login
  login: async (credentials: LoginCredentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      // Check if the response has a nested data structure
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Register
  register: async (credentials: RegisterCredentials) => {
    try {
      const response = await api.post('/auth/register', credentials);
      // Check if the response has a nested data structure
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Logout
  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      // Check if the response has a nested data structure
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Get current user
  getUser: async () => {
    try {
      const response = await api.get('/auth/me');
      // Check if the response has a nested data structure
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Update profile
  updateProfile: async (userData: Partial<User>) => {
    try {
      const response = await api.put('/auth/profile', userData);
      // Check if the response has a nested data structure
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Refresh token
  refreshToken: async () => {
    try {
      const response = await api.post('/auth/refresh-token');
      // Check if the response has a nested data structure
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
};

// Query API calls
export const queryAPI = {
  // Get weekly summary
  getWeeklySummary: async (startDate?: string, endDate?: string) => {
    try {
      // Use mock data in development until backend is available
      console.log('Backend not available, using mock data for weekly summary');
      // Simulate a network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate mock data - return direct data format
      return {
        period: {
          startDate: startDate || "2023-05-01",
          endDate: endDate || "2023-05-07"
        },
        standups: {
          total: 5,
          dates: [
            "2023-05-01",
            "2023-05-02",
            "2023-05-03",
            "2023-05-04",
            "2023-05-05"
          ]
        },
        achievements: [
          "Completed user authentication flow",
          "Fixed critical bug in data sync",
          "Implemented new dashboard widgets",
          "Optimized database queries for faster load times",
          "Deployed new features to production"
        ],
        plans: [
          "Implement team collaboration features",
          "Refactor the notification system",
          "Add data export functionality",
          "Create user onboarding flow",
          "Design new reporting dashboard"
        ],
        blockers: [
          "API rate limits affecting data fetching",
          "Need design input for new features",
          "Waiting for API access from third-party service"
        ],
        mood: {
          average: 4.2,
          data: [4, 5, 4, 4, 4]
        },
        productivity: {
          average: 3.8,
          data: [3, 4, 4, 4, 4]
        },
        tags: [
          { tag: "frontend", count: 8 },
          { tag: "api", count: 6 },
          { tag: "bugfix", count: 5 },
          { tag: "feature", count: 4 },
          { tag: "testing", count: 3 },
          { tag: "documentation", count: 2 }
        ],
        highlights: [
          "2023-05-02",
          "2023-05-05"
        ]
      };
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Get monthly summary
  getMonthlySummary: async (month: string) => {
    try {
      // Use mock data in development until backend is available
      console.log('Backend not available, using mock data for monthly summary');
      // Simulate a network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Parse the month string to get year and month
      const [year, monthNum] = month.split('-').map(part => parseInt(part));
      
      // Generate mock data - return direct data format
      return {
        month: month,
        totalEntries: 20,
        averageMood: 4.1,
        averageProductivity: 3.9,
        topTags: [
          { tag: "frontend", count: 15 },
          { tag: "api", count: 12 },
          { tag: "bugfix", count: 10 },
          { tag: "feature", count: 8 },
          { tag: "testing", count: 7 },
          { tag: "documentation", count: 5 },
          { tag: "research", count: 4 },
          { tag: "design", count: 3 }
        ],
        topAccomplishments: [
          "Launched new user dashboard",
          "Implemented team collaboration features",
          "Fixed critical security vulnerability",
          "Optimized database performance",
          "Completed user research studies"
        ],
        topBlockers: [
          "API integration delays",
          "Design feedback pending",
          "Third-party service outages",
          "Technical debt in legacy code"
        ],
        dailyBreakdown: Array.from({ length: 30 }, (_, i) => {
          const day = i + 1;
          return {
            date: `${year}-${String(monthNum).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
            mood: Math.floor(Math.random() * 3) + 3, // Random mood between 3-5
            productivity: Math.floor(Math.random() * 3) + 3, // Random productivity between 3-5
            hasBlockers: Math.random() > 0.7 // 30% chance of having blockers
          };
        })
      };
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Get blockers
  getBlockers: async () => {
    try {
      // Use mock data in development until backend is available
      console.log('Backend not available, using mock data for blockers');
      // Simulate a network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate mock data - return direct data format
      return {
        total: 12,
        resolved: 8,
        unresolved: 4,
        blockers: [
          { 
            date: "2023-05-15", 
            text: "Waiting for API access from third-party service", 
            resolved: true 
          },
          { 
            date: "2023-05-12", 
            text: "Need design feedback for new features", 
            resolved: true 
          },
          { 
            date: "2023-05-10", 
            text: "Backend service keeps timing out", 
            resolved: false 
          },
          { 
            date: "2023-05-08", 
            text: "Missing documentation for integration", 
            resolved: true 
          },
          { 
            date: "2023-05-05", 
            text: "Build pipeline failures blocking deployment", 
            resolved: true 
          },
          { 
            date: "2023-05-01", 
            text: "API rate limiting affecting performance", 
            resolved: false 
          }
        ],
        mostFrequentTerms: [
          { term: "API", count: 5 },
          { term: "design", count: 3 },
          { term: "documentation", count: 3 },
          { term: "integration", count: 2 },
          { term: "performance", count: 2 }
        ]
      };
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Get all standups that have blockers
  getAllWithBlockers: async () => {
    try {
      // Use mock data in development until backend is available
      console.log('Backend not available, using mock data for standups with blockers');
      // Simulate a network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate mock data - return direct data format
      return [
        {
          date: "2023-05-15",
          blockers: "Waiting for API access from third-party service",
          isBlockerResolved: true
        },
        {
          date: "2023-05-12",
          blockers: "Need design feedback for new features",
          isBlockerResolved: true
        },
        {
          date: "2023-05-10",
          blockers: "Backend service keeps timing out",
          isBlockerResolved: false
        },
        {
          date: "2023-05-08",
          blockers: "Missing documentation for integration",
          isBlockerResolved: true
        },
        {
          date: "2023-05-05",
          blockers: "Build pipeline failures blocking deployment",
          isBlockerResolved: true
        },
        {
          date: "2023-05-01",
          blockers: "API rate limiting affecting performance",
          isBlockerResolved: false
        }
      ];
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
      
      // Check if the response has a nested data structure
      if (response.data && response.data.success && response.data.data) {
        return {
          status: response.status,
          statusText: response.statusText,
          data: response.data.data
        };
      }
      
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

// Team API services
export const teamAPI = {
  // Get all teams
  getAllTeams: async () => {
    try {
      const response = await api.get('/teams');
      // Check if the response has a nested data structure
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Get team by ID
  getTeamById: async (teamId: string) => {
    try {
      const response = await api.get(`/teams/${teamId}`);
      // Check if the response has a nested data structure
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Create a new team
  createTeam: async (teamData: import('../redux/features/teams/types').CreateTeamDto) => {
    try {
      const response = await api.post('/teams', teamData);
      // Check if the response has a nested data structure
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Update a team
  updateTeam: async (teamId: string, teamData: import('../redux/features/teams/types').UpdateTeamDto) => {
    try {
      const response = await api.put(`/teams/${teamId}`, teamData);
      // Check if the response has a nested data structure
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Delete a team
  deleteTeam: async (teamId: string) => {
    try {
      const response = await api.delete(`/teams/${teamId}`);
      // Check if the response has a nested data structure
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Get team members
  getTeamMembers: async (teamId: string) => {
    try {
      const response = await api.get(`/teams/${teamId}/members`);
      // Check if the response has a nested data structure
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Add member to team
  addTeamMember: async (teamId: string, memberData: import('../redux/features/teams/types').AddTeamMemberDto) => {
    try {
      const response = await api.post(`/teams/${teamId}/members`, memberData);
      // Check if the response has a nested data structure
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Update member role
  updateMemberRole: async (teamId: string, memberId: string, roleData: import('../redux/features/teams/types').UpdateMemberRoleDto) => {
    try {
      const response = await api.put(`/teams/${teamId}/members/${memberId}`, roleData);
      // Check if the response has a nested data structure
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Remove member from team
  removeTeamMember: async (teamId: string, memberId: string) => {
    try {
      const response = await api.delete(`/teams/${teamId}/members/${memberId}`);
      // Check if the response has a nested data structure
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Leave team (current user leaves)
  leaveTeam: async (teamId: string) => {
    try {
      const response = await api.delete(`/teams/${teamId}/leave`);
      // Check if the response has a nested data structure
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Switch to a different team
  switchTeam: async (teamId: string) => {
    try {
      const response = await api.post(`/teams/${teamId}/switch`);
      // Check if the response has a nested data structure
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }
};

export default api; 