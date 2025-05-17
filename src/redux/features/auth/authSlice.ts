import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '../../../features/auth/types';

// Initial state with no user
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
};

// Create placeholder slice with typed parameters
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Login - placeholder implementations that preserve parameter types
    loginRequest: (state) => state,
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => state,
    loginFailure: (state, action: PayloadAction<string>) => state,
    
    // Logout
    logout: (state) => state,
    
    // Register
    registerRequest: (state) => state,
    registerSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => state,
    registerFailure: (state, action: PayloadAction<string>) => state,
    
    // Profile
    updateProfileRequest: (state) => state,
    updateProfileSuccess: (state, action: PayloadAction<User>) => state,
    updateProfileFailure: (state, action: PayloadAction<string>) => state,
    
    // Error
    clearError: (state) => state,
  },
});

// Export actions
export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  logout,
  registerRequest,
  registerSuccess,
  registerFailure,
  updateProfileRequest,
  updateProfileSuccess,
  updateProfileFailure,
  clearError,
} = authSlice.actions;

// Export reducer
export default authSlice.reducer; 