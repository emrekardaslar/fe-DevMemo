import { useCallback } from 'react';
import { useAppDispatch } from '../redux/hooks';
import {
  toggleDrawer,
  setDrawerOpen,
  setTheme,
  setIsMobile,
  addNotification,
  removeNotification,
  markNotificationRead,
  clearAllNotifications,
  setFullscreen,
  setSelectedView
} from '../redux/features/ui/uiSlice';
import { Notification } from '../redux/features/ui/types';

/**
 * Custom hook for UI operations
 * Provides a clean interface for components to interact with UI state
 */
export const useUIOperations = () => {
  const dispatch = useAppDispatch();

  // Drawer operations
  const toggleSidebar = useCallback(() => {
    dispatch(toggleDrawer());
  }, [dispatch]);

  const setSidebarOpen = useCallback((isOpen: boolean) => {
    dispatch(setDrawerOpen(isOpen));
  }, [dispatch]);

  // Theme operations
  const changeTheme = useCallback((theme: 'light' | 'dark' | 'system') => {
    dispatch(setTheme(theme));
    
    // Apply theme to document
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark-theme');
      root.classList.remove('light-theme');
    } else if (theme === 'light') {
      root.classList.add('light-theme');
      root.classList.remove('dark-theme');
    } else {
      // System theme based on prefers-color-scheme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark-theme');
        root.classList.remove('light-theme');
      } else {
        root.classList.add('light-theme');
        root.classList.remove('dark-theme');
      }
    }
  }, [dispatch]);

  // Responsive layout operations
  const setMobileView = useCallback((isMobile: boolean) => {
    dispatch(setIsMobile(isMobile));
  }, [dispatch]);

  // Notification operations
  const showNotification = useCallback((
    message: string, 
    type: 'success' | 'error' | 'warning' | 'info' = 'info',
    duration?: number
  ) => {
    dispatch(addNotification({ message, type, duration }));
  }, [dispatch]);

  const dismissNotification = useCallback((id: string) => {
    dispatch(removeNotification(id));
  }, [dispatch]);

  const markAsRead = useCallback((id: string) => {
    dispatch(markNotificationRead(id));
  }, [dispatch]);

  const clearNotifications = useCallback(() => {
    dispatch(clearAllNotifications());
  }, [dispatch]);

  // Fullscreen operations
  const toggleFullscreen = useCallback((isFullscreen: boolean) => {
    dispatch(setFullscreen(isFullscreen));
  }, [dispatch]);

  // View selection operations
  const selectView = useCallback((view: 'list' | 'calendar' | 'kanban') => {
    dispatch(setSelectedView(view));
  }, [dispatch]);

  return {
    // Drawer
    toggleSidebar,
    setSidebarOpen,
    
    // Theme
    changeTheme,
    
    // Responsive
    setMobileView,
    
    // Notifications
    showNotification,
    dismissNotification,
    markAsRead,
    clearNotifications,
    
    // Fullscreen
    toggleFullscreen,
    
    // View
    selectView
  };
}; 