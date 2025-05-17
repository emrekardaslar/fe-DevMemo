import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { standupAPI, queryAPI } from '../services/api';

// Standup model (simplified from the existing types)
export interface Standup {
  date: string;
  yesterday: string;
  today: string;
  blockers: string;
  isBlockerResolved: boolean;
  tags: string[];
  mood: number;
  productivity: number;
  isHighlight: boolean;
  createdAt: string;
  updatedAt: string;
}

// Add these types at the top of the file next to other interfaces
export interface WeeklySummary {
  period: {
    startDate: string;
    endDate: string;
  };
  standups: {
    total: number;
    dates: string[];
  };
  achievements: string[];
  plans: string[];
  blockers: string[];
  mood: {
    average: number;
    data: number[];
  };
  productivity: {
    average: number;
    data: number[];
  };
  tags: Array<{ tag: string; count: number }>;
  highlights: string[];
}

export interface MonthlySummary {
  month: string;
  totalEntries: number;
  averageMood: number;
  averageProductivity: number;
  topTags: Array<{ tag: string; count: number }>;
  topAccomplishments: string[];
  topBlockers: string[];
  dailyBreakdown: Array<{
    date: string;
    mood: number;
    productivity: number;
    hasBlockers: boolean;
  }>;
}

export interface BlockerData {
  total: number;
  resolved: number;
  unresolved: number;
  blockers: Array<{
    date: string;
    text: string;
    resolved: boolean;
  }>;
  mostFrequentTerms: Array<{
    term: string;
    count: number;
  }>;
}

export interface StandupStats {
  totalStandups: number;
  dateRange: {
    firstDate: string;
    lastDate: string;
    totalDays: number;
  };
  tagsStats: {
    uniqueTagsCount: number;
    topTags: Array<{ tag: string; count: number }>;
  };
  blockersStats: {
    total: number;
    percentage: number;
  };
  moodStats: {
    average: number;
    entriesWithMood: number;
  };
  productivityStats: {
    average: number;
    entriesWithProductivity: number;
  };
  highlights: {
    count: number;
    dates: string[];
  };
}

// State type
interface StandupState {
  standups: Standup[];
  currentStandup: Standup | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

// Initial state
const initialState: StandupState = {
  standups: [],
  currentStandup: null,
  loading: false,
  error: null,
  success: false
};

// Action types
type StandupAction =
  | { type: 'FETCH_STANDUPS_REQUEST' }
  | { type: 'FETCH_STANDUPS_SUCCESS'; payload: Standup[] }
  | { type: 'FETCH_STANDUPS_FAILURE'; payload: string }
  | { type: 'FETCH_STANDUP_REQUEST' }
  | { type: 'FETCH_STANDUP_SUCCESS'; payload: Standup }
  | { type: 'FETCH_STANDUP_FAILURE'; payload: string }
  | { type: 'CREATE_STANDUP_REQUEST' }
  | { type: 'CREATE_STANDUP_SUCCESS'; payload: Standup }
  | { type: 'CREATE_STANDUP_FAILURE'; payload: string }
  | { type: 'UPDATE_STANDUP_REQUEST' }
  | { type: 'UPDATE_STANDUP_SUCCESS'; payload: Standup }
  | { type: 'UPDATE_STANDUP_FAILURE'; payload: string }
  | { type: 'DELETE_STANDUP_REQUEST' }
  | { type: 'DELETE_STANDUP_SUCCESS'; payload: string }
  | { type: 'DELETE_STANDUP_FAILURE'; payload: string }
  | { type: 'TOGGLE_HIGHLIGHT_REQUEST' }
  | { type: 'TOGGLE_HIGHLIGHT_SUCCESS'; payload: Standup }
  | { type: 'TOGGLE_HIGHLIGHT_FAILURE'; payload: string }
  | { type: 'CLEAR_STANDUP' }
  | { type: 'RESET_SUCCESS' };

// Reducer
function standupReducer(state: StandupState, action: StandupAction): StandupState {
  switch (action.type) {
    // Fetch all standups
    case 'FETCH_STANDUPS_REQUEST':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'FETCH_STANDUPS_SUCCESS':
      return {
        ...state,
        loading: false,
        standups: action.payload,
        error: null
      };
    case 'FETCH_STANDUPS_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
      
    // Fetch single standup
    case 'FETCH_STANDUP_REQUEST':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'FETCH_STANDUP_SUCCESS':
      return {
        ...state,
        loading: false,
        currentStandup: action.payload,
        error: null
      };
    case 'FETCH_STANDUP_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
      
    // Create standup
    case 'CREATE_STANDUP_REQUEST':
      return {
        ...state,
        loading: true,
        error: null,
        success: false
      };
    case 'CREATE_STANDUP_SUCCESS':
      return {
        ...state,
        loading: false,
        standups: [action.payload, ...state.standups],
        currentStandup: action.payload,
        error: null,
        success: true
      };
    case 'CREATE_STANDUP_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false
      };
      
    // Update standup
    case 'UPDATE_STANDUP_REQUEST':
      return {
        ...state,
        loading: true,
        error: null,
        success: false
      };
    case 'UPDATE_STANDUP_SUCCESS':
      return {
        ...state,
        loading: false,
        standups: state.standups.map(standup => 
          standup.date === action.payload.date ? action.payload : standup
        ),
        currentStandup: action.payload,
        error: null,
        success: true
      };
    case 'UPDATE_STANDUP_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false
      };
      
    // Delete standup
    case 'DELETE_STANDUP_REQUEST':
      return {
        ...state,
        loading: true,
        error: null,
        success: false
      };
    case 'DELETE_STANDUP_SUCCESS':
      return {
        ...state,
        loading: false,
        standups: state.standups.filter(standup => standup.date !== action.payload),
        currentStandup: state.currentStandup?.date === action.payload ? null : state.currentStandup,
        error: null,
        success: true
      };
    case 'DELETE_STANDUP_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false
      };
      
    // Toggle highlight
    case 'TOGGLE_HIGHLIGHT_REQUEST':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'TOGGLE_HIGHLIGHT_SUCCESS':
      return {
        ...state,
        loading: false,
        standups: state.standups.map(standup => 
          standup.date === action.payload.date ? action.payload : standup
        ),
        currentStandup: state.currentStandup?.date === action.payload.date ? 
          action.payload : state.currentStandup,
        error: null
      };
    case 'TOGGLE_HIGHLIGHT_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    // Clear current standup
    case 'CLEAR_STANDUP':
      return {
        ...state,
        currentStandup: null,
        error: null
      };
      
    // Reset success flag
    case 'RESET_SUCCESS':
      return {
        ...state,
        success: false,
        error: null
      };
      
    default:
      return state;
  }
}

// Types for create and update operations
export type CreateStandupDto = Omit<Standup, 'createdAt' | 'updatedAt'>;
export type UpdateStandupDto = Partial<Standup>;

// Context Type
interface StandupContextType extends StandupState {
  fetchStandups: () => Promise<void>;
  fetchStandup: (date: string) => Promise<void>;
  createStandup: (standup: CreateStandupDto) => Promise<void>;
  updateStandup: (date: string, standup: UpdateStandupDto) => Promise<void>;
  deleteStandup: (date: string) => Promise<void>;
  toggleHighlight: (date: string) => Promise<void>;
  clearStandup: () => void;
  resetSuccess: () => void;
  // Additional methods
  getWeeklySummary: (startDate?: string, endDate?: string) => Promise<WeeklySummary>;
  getMonthlySummary: (month: string) => Promise<MonthlySummary>;
  getBlockerData: () => Promise<BlockerData>;
  getStats: () => Promise<StandupStats>;
  getHighlights: () => Promise<Standup[]>;
  getByDateRange: (startDate: string, endDate: string) => Promise<Standup[]>;
  searchStandups: (keyword: string) => Promise<Standup[]>;
  getAllWithBlockers: () => Promise<Standup[]>;
}

// Create context
const StandupContext = createContext<StandupContextType | undefined>(undefined);

// Provider component
export function StandupProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(standupReducer, initialState);

  // Actions
  const fetchStandups = async () => {
    try {
      dispatch({ type: 'FETCH_STANDUPS_REQUEST' });
      const response = await standupAPI.getAll();
      
      // If response is already an array, use it directly
      if (Array.isArray(response)) {
        dispatch({ type: 'FETCH_STANDUPS_SUCCESS', payload: response });
        return;
      }
      
      // Otherwise, try to extract the data from a nested structure
      if (response && response.data) {
        if (Array.isArray(response.data)) {
          dispatch({ type: 'FETCH_STANDUPS_SUCCESS', payload: response.data });
          return;
        } 
        if (response.data.data && Array.isArray(response.data.data)) {
          dispatch({ type: 'FETCH_STANDUPS_SUCCESS', payload: response.data.data });
          return;
        }
      }
      
      // If we couldn't find a valid array, dispatch an empty one
      dispatch({ type: 'FETCH_STANDUPS_SUCCESS', payload: [] });
    } catch (error) {
      dispatch({ 
        type: 'FETCH_STANDUPS_FAILURE', 
        payload: error instanceof Error ? error.message : 'Failed to fetch standups' 
      });
    }
  };

  const fetchStandup = async (date: string) => {
    try {
      dispatch({ type: 'FETCH_STANDUP_REQUEST' });
      const response = await standupAPI.getByDate(date);
      
      // Handle different response formats
      let standup: Standup;
      if (response && response.data) {
        standup = response.data.data || response.data;
      } else if (Array.isArray(response)) {
        // Find the standup with matching date
        standup = response.find(s => s.date === date) || response[0];
      } else {
        // If response is already a standup object
        standup = response;
      }
      
      if (!standup || !standup.date) {
        throw new Error('Invalid response format');
      }
      
      dispatch({ type: 'FETCH_STANDUP_SUCCESS', payload: standup });
    } catch (error) {
      dispatch({ 
        type: 'FETCH_STANDUP_FAILURE', 
        payload: error instanceof Error ? error.message : 'Failed to fetch standup' 
      });
      throw error;
    }
  };

  const createStandup = async (standupData: CreateStandupDto) => {
    try {
      dispatch({ type: 'CREATE_STANDUP_REQUEST' });
      const response = await standupAPI.create(standupData);
      
      // Handle different response formats
      let standup: Standup;
      if (response && response.data) {
        standup = response.data.data || response.data;
      } else if (Array.isArray(response)) {
        // If response is an array, use the first item
        standup = response[0];
      } else {
        // If response is already a standup object
        standup = response;
      }
      
      if (!standup || !standup.date) {
        throw new Error('Invalid response format');
      }
      
      dispatch({ type: 'CREATE_STANDUP_SUCCESS', payload: standup });
      // Return immediately to prevent any further operations
      return;
    } catch (error) {
      dispatch({ 
        type: 'CREATE_STANDUP_FAILURE', 
        payload: error instanceof Error ? error.message : 'Failed to create standup' 
      });
      throw error;
    }
  };

  const updateStandup = async (date: string, standupData: UpdateStandupDto) => {
    try {
      dispatch({ type: 'UPDATE_STANDUP_REQUEST' });
      const response = await standupAPI.update(date, standupData);
      
      // Handle different response formats
      let standup: Standup;
      if (response && response.data) {
        standup = response.data.data || response.data;
      } else if (Array.isArray(response)) {
        // If response is an array, use the first item
        standup = response[0];
      } else {
        // If response is already a standup object
        standup = response;
      }
      
      if (!standup || !standup.date) {
        throw new Error('Invalid response format');
      }
      
      dispatch({ type: 'UPDATE_STANDUP_SUCCESS', payload: standup });
      // Return immediately to prevent any further operations
      return;
    } catch (error) {
      dispatch({ 
        type: 'UPDATE_STANDUP_FAILURE', 
        payload: error instanceof Error ? error.message : 'Failed to update standup' 
      });
      throw error;
    }
  };

  const deleteStandup = async (date: string) => {
    try {
      dispatch({ type: 'DELETE_STANDUP_REQUEST' });
      await standupAPI.delete(date);
      dispatch({ type: 'DELETE_STANDUP_SUCCESS', payload: date });
    } catch (error) {
      dispatch({ 
        type: 'DELETE_STANDUP_FAILURE', 
        payload: error instanceof Error ? error.message : 'Failed to delete standup' 
      });
    }
  };

  const toggleHighlight = async (date: string) => {
    try {
      dispatch({ type: 'TOGGLE_HIGHLIGHT_REQUEST' });
      const response = await standupAPI.toggleHighlight(date);
      
      // Handle different response formats
      let standup: Standup;
      if (response && response.data) {
        standup = response.data.data || response.data;
      } else {
        throw new Error('Invalid response format');
      }
      
      if (!standup || !standup.date) {
        throw new Error('Invalid response data');
      }
      
      dispatch({ type: 'TOGGLE_HIGHLIGHT_SUCCESS', payload: standup });
    } catch (error) {
      dispatch({ 
        type: 'TOGGLE_HIGHLIGHT_FAILURE', 
        payload: error instanceof Error ? error.message : 'Failed to toggle highlight' 
      });
    }
  };

  const clearStandup = () => {
    dispatch({ type: 'CLEAR_STANDUP' });
  };

  const resetSuccess = () => {
    dispatch({ type: 'RESET_SUCCESS' });
  };

  // Get weekly summary
  const getWeeklySummary = async (startDate?: string, endDate?: string): Promise<WeeklySummary> => {
    try {
      const response = await queryAPI.getWeeklySummary(startDate, endDate);
      return response;
    } catch (error) {
      console.error('Error getting weekly summary:', error);
      throw error;
    }
  };
  
  // Get monthly summary
  const getMonthlySummary = async (month: string): Promise<MonthlySummary> => {
    try {
      const response = await queryAPI.getMonthlySummary(month);
      return response;
    } catch (error) {
      console.error('Error getting monthly summary:', error);
      throw error;
    }
  };
  
  // Get blocker data
  const getBlockerData = async (): Promise<BlockerData> => {
    try {
      const response = await queryAPI.getBlockers();
      return response;
    } catch (error) {
      console.error('Error getting blocker data:', error);
      throw error;
    }
  };
  
  // Get standup statistics
  const getStats = async (): Promise<StandupStats> => {
    try {
      const response = await standupAPI.getStats();
      return response;
    } catch (error) {
      console.error('Error getting stats:', error);
      throw error;
    }
  };
  
  // Get highlighted standups
  const getHighlights = async (): Promise<Standup[]> => {
    try {
      const response = await standupAPI.getHighlights();
      return response;
    } catch (error) {
      console.error('Error getting highlights:', error);
      throw error;
    }
  };
  
  // Get standups by date range
  const getByDateRange = async (startDate: string, endDate: string): Promise<Standup[]> => {
    try {
      const response = await standupAPI.getByDateRange(startDate, endDate);
      return response;
    } catch (error) {
      console.error('Error getting standups by date range:', error);
      throw error;
    }
  };
  
  // Search standups
  const searchStandups = async (keyword: string): Promise<Standup[]> => {
    try {
      const response = await standupAPI.search(keyword);
      return response;
    } catch (error) {
      console.error('Error searching standups:', error);
      throw error;
    }
  };
  
  // Get all standups with blockers
  const getAllWithBlockers = async (): Promise<Standup[]> => {
    try {
      const response = await queryAPI.getAllWithBlockers();
      return response;
    } catch (error) {
      console.error('Error getting standups with blockers:', error);
      throw error;
    }
  };

  return (
    <StandupContext.Provider
      value={{
        ...state,
        fetchStandups,
        fetchStandup,
        createStandup,
        updateStandup,
        deleteStandup,
        toggleHighlight,
        clearStandup,
        resetSuccess,
        getWeeklySummary,
        getMonthlySummary,
        getBlockerData,
        getStats,
        getHighlights,
        getByDateRange,
        searchStandups,
        getAllWithBlockers
      }}
    >
      {children}
    </StandupContext.Provider>
  );
}

// Custom hook for using the context
export function useStandups() {
  const context = useContext(StandupContext);
  if (context === undefined) {
    throw new Error('useStandups must be used within a StandupProvider');
  }
  return context;
} 