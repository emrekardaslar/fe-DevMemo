import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UIState, Notification } from './types';
import { v4 as uuidv4 } from 'uuid';

// Initial state
const initialState: UIState = {
  isDrawerOpen: false,
  activeTheme: 'system',
  isMobile: false,
  notifications: [],
  isFullscreen: false,
  selectedView: 'list',
};

// Create slice
export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Drawer actions
    toggleDrawer: (state) => {
      state.isDrawerOpen = !state.isDrawerOpen;
    },
    setDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.isDrawerOpen = action.payload;
    },
    
    // Theme actions
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.activeTheme = action.payload;
    },
    
    // Responsive layout actions
    setIsMobile: (state, action: PayloadAction<boolean>) => {
      state.isMobile = action.payload;
    },
    
    // Notification actions
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp' | 'isRead'>>) => {
      const { message, type, duration } = action.payload;
      const notification: Notification = {
        id: uuidv4(),
        message,
        type,
        duration: duration || 5000, // Default duration
        timestamp: Date.now(),
        isRead: false,
      };
      state.notifications = [notification, ...state.notifications];
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    markNotificationRead: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.map((notification) =>
        notification.id === action.payload
          ? { ...notification, isRead: true }
          : notification
      );
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
    
    // Fullscreen actions
    setFullscreen: (state, action: PayloadAction<boolean>) => {
      state.isFullscreen = action.payload;
    },
    
    // View selection actions
    setSelectedView: (state, action: PayloadAction<'list' | 'calendar' | 'kanban'>) => {
      state.selectedView = action.payload;
    },
  },
});

// Export actions
export const {
  toggleDrawer,
  setDrawerOpen,
  setTheme,
  setIsMobile,
  addNotification,
  removeNotification,
  markNotificationRead,
  clearAllNotifications,
  setFullscreen,
  setSelectedView,
} = uiSlice.actions;

// Export reducer
export default uiSlice.reducer; 