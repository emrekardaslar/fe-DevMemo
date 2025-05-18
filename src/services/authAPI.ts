import axios from 'axios';
import { api } from './api';

// Type definitions for auth API
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
  };
  message: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  isVerified: boolean;
  createdAt: string;
}

// Token storage names
const ACCESS_TOKEN_KEY = 'ss_access_token';
const REFRESH_TOKEN_KEY = 'ss_refresh_token';

export const tokenService = {
  // Store tokens in localStorage
  setTokens: (accessToken: string, refreshToken: string): void => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    
    // Set default authorization header for all future requests
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  },
  
  // Get access token
  getAccessToken: (): string | null => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  
  // Get refresh token
  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  
  // Clear all tokens
  clearTokens: (): void => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    
    // Remove authorization header
    delete api.defaults.headers.common['Authorization'];
  },
  
  // Check if user has tokens (is logged in)
  isAuthenticated: (): boolean => {
    return !!tokenService.getAccessToken();
  }
};

// Initialize authorization header from stored token if it exists
const initializeAuth = () => {
  const token = tokenService.getAccessToken();
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

// Call initialization
initializeAuth();

// Authentication API calls
export const authAPI = {
  // Register a new user
  register: async (userData: RegisterData): Promise<{ userId: string; message: string }> => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Registration failed');
      }
      throw new Error('Registration failed. Please try again later.');
    }
  },
  
  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { accessToken, refreshToken, user } = response.data;
      
      // Store tokens
      tokenService.setTokens(accessToken, refreshToken);
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Login failed');
      }
      throw new Error('Login failed. Please try again later.');
    }
  },
  
  // Refresh token
  refreshToken: async (): Promise<{ accessToken: string; refreshToken: string }> => {
    try {
      const refreshToken = tokenService.getRefreshToken();
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await api.post('/auth/refresh-token', { refreshToken });
      const { accessToken, refreshToken: newRefreshToken } = response.data;
      
      // Store new tokens
      tokenService.setTokens(accessToken, newRefreshToken);
      
      return response.data;
    } catch (error) {
      // Clear tokens on refresh failure
      tokenService.clearTokens();
      
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Token refresh failed');
      }
      throw new Error('Token refresh failed. Please log in again.');
    }
  },
  
  // Logout user
  logout: async (): Promise<void> => {
    try {
      const refreshToken = tokenService.getRefreshToken();
      
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
      
      // Clear stored tokens
      tokenService.clearTokens();
    } catch (error) {
      // Still clear tokens even if API call fails
      tokenService.clearTokens();
      
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Logout failed');
      }
      throw new Error('Logout failed but tokens have been cleared.');
    }
  },
  
  // Get user profile
  getProfile: async (): Promise<UserProfile> => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // If unauthorized, clear tokens
        if (error.response.status === 401) {
          tokenService.clearTokens();
        }
        throw new Error(error.response.data.message || 'Failed to get user profile');
      }
      throw new Error('Failed to get user profile. Please try again later.');
    }
  },
  
  // Request password reset
  requestPasswordReset: async (email: string): Promise<{ message: string }> => {
    try {
      const response = await api.post('/auth/request-password-reset', { email });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to request password reset');
      }
      throw new Error('Failed to request password reset. Please try again later.');
    }
  },
  
  // Reset password
  resetPassword: async (token: string, newPassword: string): Promise<{ message: string }> => {
    try {
      const response = await api.post('/auth/reset-password', { token, newPassword });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to reset password');
      }
      throw new Error('Failed to reset password. Please try again later.');
    }
  },
  
  // Verify email
  verifyEmail: async (token: string): Promise<{ message: string }> => {
    try {
      const response = await api.get(`/auth/verify-email/${token}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to verify email');
      }
      throw new Error('Failed to verify email. Please try again later.');
    }
  }
}; 