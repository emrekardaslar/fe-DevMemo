import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { Notification, UIState } from './types';

// Basic selectors
export const selectUIState = (state: RootState): UIState => state.ui;

export const selectIsDrawerOpen = (state: RootState): boolean => state.ui.isDrawerOpen;

export const selectActiveTheme = (state: RootState): string => state.ui.activeTheme;

export const selectIsMobile = (state: RootState): boolean => state.ui.isMobile;

export const selectNotifications = (state: RootState): Notification[] => state.ui.notifications;

export const selectIsFullscreen = (state: RootState): boolean => state.ui.isFullscreen;

export const selectSelectedView = (state: RootState): string => state.ui.selectedView;

// Memoized selectors
export const selectUnreadNotificationsCount = createSelector(
  [selectNotifications],
  (notifications: Notification[]) => notifications.filter((notification) => !notification.isRead).length
);

export const selectNotificationsByType = (type: 'success' | 'error' | 'warning' | 'info') =>
  createSelector(
    [selectNotifications],
    (notifications: Notification[]) => notifications.filter((notification) => notification.type === type)
  );

export const selectLatestNotification = createSelector(
  [selectNotifications],
  (notifications: Notification[]) => {
    if (notifications.length === 0) return null;
    return notifications.reduce((latest, notification) => 
      notification.timestamp > latest.timestamp ? notification : latest
    );
  }
); 