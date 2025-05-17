import { configureStore } from '@reduxjs/toolkit';
import standupReducer from './features/standups/standupSlice';
import uiReducer from './features/ui/uiSlice';
import authReducer from './features/auth/authSlice';
import teamReducer from './features/teams/teamSlice';

// Define the root state type
export interface RootState {
  standups: ReturnType<typeof standupReducer>;
  ui: ReturnType<typeof uiReducer>;
  auth: ReturnType<typeof authReducer>;
  teams: ReturnType<typeof teamReducer>;
}

export const store = configureStore({
  reducer: {
    standups: standupReducer,
    ui: uiReducer,
    auth: authReducer,
    teams: teamReducer,
  },
  // Enable Redux DevTools extension
  devTools: process.env.NODE_ENV !== 'production',
});

// Export types for use throughout the app
export type AppDispatch = typeof store.dispatch; 