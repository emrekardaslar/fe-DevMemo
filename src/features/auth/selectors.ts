import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../redux/store';

/**
 * Select the auth slice of the state
 */
export const selectAuthState = (state: RootState) => state.auth;

/**
 * Select authentication status
 */
export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (auth) => auth.isAuthenticated
);

/**
 * Select current user
 */
export const selectCurrentUser = createSelector(
  selectAuthState,
  (auth) => auth.user
);

/**
 * Select user ID
 */
export const selectUserId = createSelector(
  selectCurrentUser,
  (user) => user?.id
);

/**
 * Select user role
 */
export const selectUserRole = createSelector(
  selectCurrentUser,
  (user) => user?.role
);

/**
 * Select auth loading state
 */
export const selectAuthLoading = createSelector(
  selectAuthState,
  (auth) => auth.loading
);

/**
 * Select auth error
 */
export const selectAuthError = createSelector(
  selectAuthState,
  (auth) => auth.error
);

/**
 * Export all auth selectors
 */
export const authSelectors = {
  selectAuthState,
  selectIsAuthenticated,
  selectCurrentUser,
  selectUserId,
  selectUserRole,
  selectAuthLoading,
  selectAuthError
}; 