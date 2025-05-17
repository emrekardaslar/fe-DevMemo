// User model
export interface User {
  id: string;
  username: string;
  email: string;
  name?: string;
  avatar?: string;
  role: 'user' | 'admin';
  createdAt: string;
  lastLogin: string;
}

// Authentication state
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Login request payload
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// Registration request payload
export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  name?: string;
}

// Auth API responses
export interface AuthResponse {
  user: User;
  token: string;
} 