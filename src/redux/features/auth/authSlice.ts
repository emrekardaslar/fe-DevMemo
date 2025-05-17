import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from './types';

// Get stored auth data from localStorage if available
const getStoredAuthData = (): { token: string | null; user: User | null } => {
  try {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    
    return { token, user };
  } catch (error) {
    console.error('Failed to parse stored auth data:', error);
    return { token: null, user: null };
  }
};

// Initial state with localStorage data
const { token, user } = getStoredAuthData();
const initialState: AuthState = {
  isAuthenticated: !!token,
  user,
  token,
  loading: false,
  error: null,
};

// Create slice
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Login
    loginRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
      state.error = null;
      
      // Store auth data in localStorage
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = action.payload;
    },
    
    // Logout
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      
      // Remove auth data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    
    // Registration
    registerRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    registerSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
      state.error = null;
      
      // Store auth data in localStorage
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    registerFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Update user profile
    updateProfileRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateProfileSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
      
      // Update stored user data
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    updateProfileFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
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