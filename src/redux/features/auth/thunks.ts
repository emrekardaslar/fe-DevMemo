import { createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../../services/api';
import { 
  loginRequest, 
  loginSuccess, 
  loginFailure,
  registerRequest,
  registerSuccess,
  registerFailure,
  updateProfileRequest,
  updateProfileSuccess,
  updateProfileFailure,
  logout
} from './authSlice';
import { LoginCredentials, RegisterCredentials, User } from './types';

/**
 * Login the user
 */
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { dispatch, rejectWithValue }) => {
    try {
      dispatch(loginRequest());
      const response = await authAPI.login(credentials);
      dispatch(loginSuccess({
        user: response.data.user,
        token: response.data.token
      }));
      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      dispatch(loginFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Register a new user
 */
export const register = createAsyncThunk(
  'auth/register',
  async (credentials: RegisterCredentials, { dispatch, rejectWithValue }) => {
    try {
      dispatch(registerRequest());
      const response = await authAPI.register(credentials);
      dispatch(registerSuccess({
        user: response.data.user,
        token: response.data.token
      }));
      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      dispatch(registerFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Logout the user
 */
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch(logout());
    }
  }
);

/**
 * Update user profile
 */
export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData: Partial<User>, { dispatch, rejectWithValue }) => {
    try {
      dispatch(updateProfileRequest());
      const response = await authAPI.updateProfile(userData);
      dispatch(updateProfileSuccess(response.data));
      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Profile update failed';
      dispatch(updateProfileFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Refresh token
 */
export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(loginRequest());
      const response = await authAPI.refreshToken();
      dispatch(loginSuccess({
        user: response.data.user,
        token: response.data.token
      }));
      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Token refresh failed';
      dispatch(logout()); // Force logout on refresh token failure
      return rejectWithValue(errorMessage);
    }
  }
); 