/**
 * UI types
 */

// UI Theme
export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system'
}

// Notification type
export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}

// Notification
export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  title?: string;
  autoClose?: boolean;
  duration?: number;
}

// UI state
export interface UIState {
  theme: Theme;
  sidebarOpen: boolean;
  notifications: Notification[];
  loading: {
    [key: string]: boolean;
  };
}

// UI Settings
export interface UISettings {
  theme: Theme;
  notificationDuration: number;
  defaultAutoClose: boolean;
  compactView: boolean;
} 