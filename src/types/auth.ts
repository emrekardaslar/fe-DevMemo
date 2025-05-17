import { BaseEntity } from './common';

/**
 * Authentication and User types
 */

// User role
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

// User entity
export interface User extends BaseEntity {
  id: string;
  email: string;
  name: string;
  username: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  lastLogin?: string;
}

// Login request
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// Registration request
export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
  username?: string;
}

// Password reset request
export interface PasswordResetRequest {
  email: string;
}

// Password change request
export interface PasswordChangeRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Auth state
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Auth response
export interface AuthResponse {
  user: User;
  token: string;
  expiresAt?: string;
}

// Profile update request
export interface ProfileUpdateRequest {
  name?: string;
  email?: string;
  username?: string;
  avatar?: string;
}

// Authentication options
export interface AuthOptions {
  redirectUrl?: string;
  tokenExpiry?: number; // In seconds
} 