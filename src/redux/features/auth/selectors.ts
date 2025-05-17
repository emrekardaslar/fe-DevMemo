import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { AuthState, User } from './types';

// Basic selectors
export const selectAuthState = (state: RootState): AuthState => state.auth;

export const selectIsAuthenticated = (state: RootState): boolean => state.auth.isAuthenticated;

export const selectUser = (state: RootState): User | null => state.auth.user;

export const selectToken = (state: RootState): string | null => state.auth.token;

export const selectAuthLoading = (state: RootState): boolean => state.auth.loading;

export const selectAuthError = (state: RootState): string | null => state.auth.error;

// Memoized selectors
export const selectUserRole = createSelector(
  [selectUser],
  (user: User | null) => user?.role || null
);

export const selectIsAdmin = createSelector(
  [selectUserRole],
  (role) => role === 'admin'
);

export const selectUserProfile = createSelector(
  [selectUser],
  (user: User | null) => {
    if (!user) return null;
    return {
      id: user.id,
      name: user.name || user.username,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
    };
  }
); 