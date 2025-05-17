import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { 
  loginSuccess, 
  loginFailure, 
  registerSuccess, 
  registerFailure,
  logout as logoutAction,
  updateProfileSuccess,
  updateProfileFailure
} from '../../../redux/features/auth/authSlice';
import { 
  LoginCredentials, 
  RegisterCredentials,
  ProfileUpdateRequest,
  User,
  AuthResponse
} from '../types';
import { selectAuthState } from '../selectors';
import { authAPI } from '../services/authService';
import { createErrorNotification } from '../../../services/notificationService';

/**
 * Custom hook for authentication operations
 */
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuthState);

  // Login
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        const result = await authAPI.login(credentials);
        if (result && result.user && result.token) {
          dispatch(loginSuccess({ user: result.user, token: result.token }));
          return result;
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error: any) {
        dispatch(loginFailure(error.message || 'Login failed'));
        throw error;
      }
    },
    [dispatch]
  );

  // Register
  const register = useCallback(
    async (credentials: RegisterCredentials) => {
      try {
        const result = await authAPI.register(credentials);
        if (result && result.user && result.token) {
          dispatch(registerSuccess({ user: result.user, token: result.token }));
          return result;
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error: any) {
        dispatch(registerFailure(error.message || 'Registration failed'));
        throw error;
      }
    },
    [dispatch]
  );

  // Logout
  const logout = useCallback(() => {
    dispatch(logoutAction());
  }, [dispatch]);

  // Update profile
  const updateProfile = useCallback(
    async (data: ProfileUpdateRequest) => {
      try {
        if (!auth.user?.id) {
          throw new Error('User not authenticated');
        }
        
        const result = await authAPI.updateProfile(auth.user.id, data);
        if (result) {
          dispatch(updateProfileSuccess(result));
          return result;
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error: any) {
        dispatch(updateProfileFailure(error.message || 'Profile update failed'));
        throw error;
      }
    },
    [dispatch, auth.user]
  );

  return {
    isAuthenticated: auth.isAuthenticated,
    user: auth.user,
    loading: auth.loading,
    error: auth.error,
    login,
    register,
    logout,
    updateProfile
  };
}; 