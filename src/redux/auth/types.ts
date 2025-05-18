// User interface
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  isVerified?: boolean;
  createdAt?: string;
}

// Authentication state interface
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Action types
export enum AuthActionTypes {
  LOGIN_REQUEST = 'auth/LOGIN_REQUEST',
  LOGIN_SUCCESS = 'auth/LOGIN_SUCCESS',
  LOGIN_FAILURE = 'auth/LOGIN_FAILURE',
  
  REGISTER_REQUEST = 'auth/REGISTER_REQUEST',
  REGISTER_SUCCESS = 'auth/REGISTER_SUCCESS',
  REGISTER_FAILURE = 'auth/REGISTER_FAILURE',
  
  LOGOUT = 'auth/LOGOUT',
  
  GET_PROFILE_REQUEST = 'auth/GET_PROFILE_REQUEST',
  GET_PROFILE_SUCCESS = 'auth/GET_PROFILE_SUCCESS',
  GET_PROFILE_FAILURE = 'auth/GET_PROFILE_FAILURE',
  
  REFRESH_TOKEN_REQUEST = 'auth/REFRESH_TOKEN_REQUEST',
  REFRESH_TOKEN_SUCCESS = 'auth/REFRESH_TOKEN_SUCCESS',
  REFRESH_TOKEN_FAILURE = 'auth/REFRESH_TOKEN_FAILURE',
  
  CLEAR_AUTH_ERROR = 'auth/CLEAR_AUTH_ERROR'
}

// Registration data
export interface RegisterData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

// Login credentials
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
} 