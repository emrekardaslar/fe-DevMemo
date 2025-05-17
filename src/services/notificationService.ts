import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Notification types
export enum NotificationType {
  SUCCESS = 'success',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error'
}

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  title?: string;
  timestamp: number;
  duration?: number; // in milliseconds, undefined means it won't auto-dismiss
  dismissible?: boolean;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  onClick: () => void;
  primary?: boolean;
}

// Create a unique ID for the notification
export function createNotificationId(): string {
  return `notification-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

// Create a notification object
export function createNotification(
  type: NotificationType,
  message: string,
  options: {
    title?: string;
    duration?: number;
    dismissible?: boolean;
    actions?: NotificationAction[];
  } = {}
): Notification {
  return {
    id: createNotificationId(),
    type,
    message,
    title: options.title,
    timestamp: Date.now(),
    duration: options.duration,
    dismissible: options.dismissible !== undefined ? options.dismissible : true,
    actions: options.actions
  };
}

// Create convenience functions for each notification type
export function createSuccessNotification(
  message: string,
  options?: Omit<Parameters<typeof createNotification>[2], 'type'>
): Notification {
  return createNotification(NotificationType.SUCCESS, message, {
    duration: 5000, // Default 5 seconds for success
    ...options
  });
}

export function createInfoNotification(
  message: string,
  options?: Omit<Parameters<typeof createNotification>[2], 'type'>
): Notification {
  return createNotification(NotificationType.INFO, message, {
    duration: 7000, // Default 7 seconds for info
    ...options
  });
}

export function createWarningNotification(
  message: string,
  options?: Omit<Parameters<typeof createNotification>[2], 'type'>
): Notification {
  return createNotification(NotificationType.WARNING, message, {
    duration: 10000, // Default 10 seconds for warnings
    ...options
  });
}

export function createErrorNotification(
  message: string,
  options?: Omit<Parameters<typeof createNotification>[2], 'type'>
): Notification {
  return createNotification(NotificationType.ERROR, message, {
    duration: undefined, // Errors don't auto-dismiss by default
    ...options
  });
}

// Redux slice for notification state
interface NotificationState {
  notifications: Notification[];
}

const initialState: NotificationState = {
  notifications: []
};

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.push(action.payload);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
    }
  }
});

export const { addNotification, removeNotification, clearAllNotifications } = notificationSlice.actions;
export default notificationSlice.reducer; 