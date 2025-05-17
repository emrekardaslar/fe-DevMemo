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
      console.log('Getting weekly summary for:', { startDate, endDate });
      
      // Calculate dates for the week based on provided startDate
      const start = startDate ? new Date(startDate) : new Date();
      const end = endDate ? new Date(endDate) : new Date(start);
      end.setDate(start.getDate() + 6);
      
      const startStr = start.toISOString().split('T')[0];
      const endStr = end.toISOString().split('T')[0];
      
      // Get the actual standup entries for the date range
      const standupEntries = await standupAPI.getByDateRange(startStr, endStr);
      console.log('API response for date range:', standupEntries);
      
      // Extract the dates from the standup entries
      let weekDates = [];
      
      if (Array.isArray(standupEntries)) {
        // If we get an array of standup entries, extract the dates
        weekDates = standupEntries.map(entry => entry.date);
      } else if (standupEntries && standupEntries.dates) {
        // If we get an object with a dates property
        weekDates = standupEntries.dates;
      }
      
      console.log('Dates in range:', weekDates);
      
      // Use 1-2 dates from weekDates as highlights
      const highlights = [];
      if (weekDates.length > 0) {
        highlights.push(`${weekDates[0]}: This was a particularly productive day`);
        
        if (weekDates.length > 1) {
          highlights.push(`${weekDates[1]}: Made significant progress on key tasks`);
        }
      }
      
      // Generate mood and productivity data
      const moodData = Array(weekDates.length).fill(0).map(() => Math.floor(Math.random() * 2) + 4); // 4-5
      const productivityData = Array(weekDates.length).fill(0).map(() => Math.floor(Math.random() * 2) + 3); // 3-4
      
      // Calculate averages
      const moodAverage = moodData.length ? moodData.reduce((a, b) => a + b, 0) / moodData.length : 0;
      const productivityAverage = productivityData.length ? productivityData.reduce((a, b) => a + b, 0) / productivityData.length : 0;
      
      // Return data using actual dates from the API
      return {
        period: {
          startDate: startDate || start.toISOString().split('T')[0],
          endDate: endDate || end.toISOString().split('T')[0]
        },
        standups: {
          total: weekDates.length,
          dates: weekDates
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
          average: parseFloat(moodAverage.toFixed(1)),
          data: moodData
        },
        productivity: {
          average: parseFloat(productivityAverage.toFixed(1)),
          data: productivityData
        },
        tags: [
          { tag: "frontend", count: 8 },
          { tag: "api", count: 6 },
          { tag: "bugfix", count: 5 },
          { tag: "feature", count: 4 },
          { tag: "testing", count: 3 },
          { tag: "documentation", count: 2 }
        ],
        highlights: highlights
      };
    } catch (error) {
      console.error('Error in getWeeklySummary:', error);
      return {
        period: {
          startDate: startDate || '',
          endDate: endDate || ''
        },
        standups: {
          total: 0,
          dates: []
        },
        achievements: [],
        plans: [],
        blockers: [],
        mood: {
          average: 0,
          data: []
        },
        productivity: {
          average: 0,
          data: []
        },
        tags: [],
        highlights: []
      };
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
      // First try to get data from the query/blockers endpoint
      try {
        const response = await api.get('/query/blockers');
        
        if (response.data && response.data.success && response.data.data) {
          const blockerData = response.data.data;
          
          // Handle the special format from the query/blockers endpoint
          if (Array.isArray(blockerData)) {
            let total = 0;
            let resolved = 0;
            
            // Get all standups with blockers to check which ones are resolved
            const standups = await queryAPI.getAllWithBlockers();
            const standupMap: Record<string, any> = {};
            
            if (Array.isArray(standups)) {
              standups.forEach(standup => {
                standupMap[standup.date] = standup;
                total++;
                if (standup.isBlockerResolved) {
                  resolved++;
                }
              });
            }
            
            // Format blockers for display
            const blockers = standups && Array.isArray(standups) ? 
              standups.map(standup => ({
                date: standup.date,
                text: standup.blockers,
                resolved: standup.isBlockerResolved
              })) : [];
            
            // Transform the blockerData format
            const terms: Record<string, number> = {};
            blockerData.forEach(item => {
              terms[item.blocker] = item.occurrences;
            });
            
            // Sort terms by frequency
            const mostFrequentTerms = Object.entries(terms)
              .map(([term, count]) => ({ term, count }))
              .sort((a, b) => b.count - a.count)
              .slice(0, 10);
            
            return {
              total,
              resolved,
              unresolved: total - resolved,
              blockers,
              mostFrequentTerms
            };
          }
        }
      } catch (err) {
        console.warn('Error fetching from /query/blockers, falling back to standups endpoint', err);
      }
      
      // Fall back to getAllWithBlockers approach
      const standups = await queryAPI.getAllWithBlockers();
      
      if (!Array.isArray(standups)) {
        throw new Error('Expected array of standups with blockers');
      }
      
      // Calculate statistics
      const total = standups.length;
      const resolved = standups.filter(standup => standup.isBlockerResolved).length;
      const unresolved = total - resolved;
      
      // Format blockers for display
      const blockers = standups.map(standup => ({
        date: standup.date,
        text: standup.blockers,
        resolved: standup.isBlockerResolved
      }));
      
      // Extract common terms (simplified approach)
      const terms: Record<string, number> = {};
      standups.forEach(standup => {
        if (standup.blockers) {
          // Split by common separators and filter out short words
          const words: string[] = standup.blockers.split(/[\s,.;:!?]+/).filter((word: string) => word.length > 3);
          words.forEach((word: string) => {
            if (!terms[word]) {
              terms[word] = 0;
            }
            terms[word]++;
          });
        }
      });
      
      // Sort terms by frequency
      const mostFrequentTerms = Object.entries(terms)
        .map(([term, count]) => ({ term, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10); // Top 10 terms
      
      return {
        total,
        resolved,
        unresolved,
        blockers,
        mostFrequentTerms
      };
    } catch (error) {
      console.error('Error fetching blocker data:', error);
      return {
        total: 0,
        resolved: 0,
        unresolved: 0,
        blockers: [],
        mostFrequentTerms: []
      };
    }
  },
  
  // Get all standups that have blockers
  getAllWithBlockers: async () => {
    try {
      const response = await api.get('/standups', { 
        params: { hasBlockers: 'true' } 
      });
      
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      
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