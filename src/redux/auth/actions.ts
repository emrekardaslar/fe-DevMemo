import { Dispatch } from 'redux';
import { AuthActionTypes, LoginCredentials, RegisterData, User } from './types';
import { authAPI, tokenService } from '../../services/authAPI';

// Login actions
export const loginRequest = () => ({
  type: AuthActionTypes.LOGIN_REQUEST
});

export const loginSuccess = (user: User) => ({
  type: AuthActionTypes.LOGIN_SUCCESS,
  payload: user
});

export const loginFailure = (error: string) => ({
  type: AuthActionTypes.LOGIN_FAILURE,
  payload: error
});

// Register actions
export const registerRequest = () => ({
  type: AuthActionTypes.REGISTER_REQUEST
});

export const registerSuccess = () => ({
  type: AuthActionTypes.REGISTER_SUCCESS
});

export const registerFailure = (error: string) => ({
  type: AuthActionTypes.REGISTER_FAILURE,
  payload: error
});

// Logout action
export const logout = () => ({
  type: AuthActionTypes.LOGOUT
});

// Get profile actions
export const getProfileRequest = () => ({
  type: AuthActionTypes.GET_PROFILE_REQUEST
});

export const getProfileSuccess = (user: User) => ({
  type: AuthActionTypes.GET_PROFILE_SUCCESS,
  payload: user
});

export const getProfileFailure = (error: string) => ({
  type: AuthActionTypes.GET_PROFILE_FAILURE,
  payload: error
});

// Refresh token actions
export const refreshTokenRequest = () => ({
  type: AuthActionTypes.REFRESH_TOKEN_REQUEST
});

export const refreshTokenSuccess = () => ({
  type: AuthActionTypes.REFRESH_TOKEN_SUCCESS
});

export const refreshTokenFailure = (error: string) => ({
  type: AuthActionTypes.REFRESH_TOKEN_FAILURE,
  payload: error
});

// Clear auth error
export const clearAuthError = () => ({
  type: AuthActionTypes.CLEAR_AUTH_ERROR
});

// Async action creators
export const login = (credentials: LoginCredentials) => {
  return async (dispatch: Dispatch) => {
    dispatch(loginRequest());
    
    try {
      const response = await authAPI.login(credentials);
      dispatch(loginSuccess(response.user));
      return response.user;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      dispatch(loginFailure(errorMessage));
      throw error;
    }
  };
};

export const register = (userData: RegisterData) => {
  return async (dispatch: Dispatch) => {
    dispatch(registerRequest());
    
    try {
      await authAPI.register(userData);
      dispatch(registerSuccess());
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      dispatch(registerFailure(errorMessage));
      throw error;
    }
  };
};

export const logoutUser = () => {
  return async (dispatch: Dispatch) => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always dispatch logout action to clear state
      dispatch(logout());
    }
  };
};

export const getProfile = () => {
  return async (dispatch: Dispatch) => {
    dispatch(getProfileRequest());
    
    try {
      const user = await authAPI.getProfile();
      dispatch(getProfileSuccess(user));
      return user;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get profile';
      dispatch(getProfileFailure(errorMessage));
      throw error;
    }
  };
};

export const refreshToken = () => {
  return async (dispatch: Dispatch) => {
    dispatch(refreshTokenRequest());
    
    try {
      await authAPI.refreshToken();
      dispatch(refreshTokenSuccess());
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Token refresh failed';
      dispatch(refreshTokenFailure(errorMessage));
      throw error;
    }
  };
};

export const initAuth = () => {
  return async (dispatch: Dispatch) => {
    // Check if user is already authenticated
    if (tokenService.isAuthenticated()) {
      try {
        // Try to get user profile
        dispatch(getProfileRequest());
        const user = await authAPI.getProfile();
        dispatch(getProfileSuccess(user));
      } catch (error) {
        // If token is invalid, try to refresh
        try {
          await authAPI.refreshToken();
          // After refresh, try to get profile again
          const user = await authAPI.getProfile();
          dispatch(getProfileSuccess(user));
        } catch (refreshError) {
          // If refresh fails, logout
          dispatch(logout());
        }
      }
    }
  };
}; 