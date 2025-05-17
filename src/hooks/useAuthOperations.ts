import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../redux/hooks';
import {
  login,
  register,
  logoutUser,
  updateUserProfile,
  refreshToken
} from '../redux/features/auth/thunks';
import { clearError } from '../redux/features/auth/authSlice';
import { LoginCredentials, RegisterCredentials, User } from '../redux/features/auth/types';

/**
 * Custom hook for authentication operations
 * Provides a clean interface for components to interact with auth state
 */
export const useAuthOperations = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Login
  const loginUser = useCallback(async (credentials: LoginCredentials, redirectPath = '/dashboard') => {
    try {
      const resultAction = await dispatch(login(credentials));
      if (login.fulfilled.match(resultAction)) {
        navigate(redirectPath);
        return { success: true };
      }
      return { success: false, error: resultAction.payload as string };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Login failed' };
    }
  }, [dispatch, navigate]);

  // Register
  const registerUser = useCallback(async (credentials: RegisterCredentials, redirectPath = '/dashboard') => {
    try {
      const resultAction = await dispatch(register(credentials));
      if (register.fulfilled.match(resultAction)) {
        navigate(redirectPath);
        return { success: true };
      }
      return { success: false, error: resultAction.payload as string };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Registration failed' };
    }
  }, [dispatch, navigate]);

  // Logout
  const logout = useCallback(async (redirectPath = '/login') => {
    try {
      await dispatch(logoutUser());
      navigate(redirectPath);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Logout failed' };
    }
  }, [dispatch, navigate]);

  // Update profile
  const updateProfile = useCallback(async (userData: Partial<User>) => {
    try {
      const resultAction = await dispatch(updateUserProfile(userData));
      if (updateUserProfile.fulfilled.match(resultAction)) {
        return { success: true, user: resultAction.payload };
      }
      return { success: false, error: resultAction.payload as string };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Profile update failed' };
    }
  }, [dispatch]);

  // Refresh token
  const refresh = useCallback(async () => {
    try {
      const resultAction = await dispatch(refreshToken());
      if (refreshToken.fulfilled.match(resultAction)) {
        return { success: true };
      }
      return { success: false, error: resultAction.payload as string };
    } catch (error) {
      console.error('Token refresh error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Token refresh failed' };
    }
  }, [dispatch]);

  // Clear auth errors
  const resetAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    loginUser,
    registerUser,
    logout,
    updateProfile,
    refresh,
    resetAuthError
  };
}; 