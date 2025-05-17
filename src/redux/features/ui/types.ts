// UI state types
export interface UIState {
  isDrawerOpen: boolean;
  activeTheme: 'light' | 'dark' | 'system';
  isMobile: boolean;
  notifications: Notification[];
  isFullscreen: boolean;
  selectedView: 'list' | 'calendar' | 'kanban';
}

// Notification model
export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  timestamp: number;
  isRead: boolean;
} 