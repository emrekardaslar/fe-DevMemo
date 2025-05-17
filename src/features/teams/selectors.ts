import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../redux/store';
import { TeamsState } from '../../redux/features/teams/teamSlice';

/**
 * Select the teams slice of the state
 */
export const selectTeamsState = (state: RootState) => state.teams as TeamsState;

/**
 * Select all teams
 */
export const selectAllTeams = createSelector(
  selectTeamsState,
  (teams) => teams.teams
);

/**
 * Select current team
 */
export const selectCurrentTeam = createSelector(
  selectTeamsState,
  (teams) => teams.currentTeam
);

/**
 * Select team members
 */
export const selectTeamMembers = createSelector(
  selectTeamsState,
  (teams) => teams.members
);

/**
 * Select team membership requests
 */
export const selectMembershipRequests = createSelector(
  selectTeamsState,
  (teams) => teams.membershipRequests
);

/**
 * Select teams loading state
 */
export const selectTeamsLoading = createSelector(
  selectTeamsState,
  (teams) => teams.loading
);

/**
 * Select teams error state
 */
export const selectTeamsError = createSelector(
  selectTeamsState,
  (teams) => teams.error
);

/**
 * Select team by ID
 */
export const selectTeamById = (teamId: string) => createSelector(
  selectAllTeams,
  (teams) => teams.find(team => team.id === teamId)
);

/**
 * Export all team selectors
 */
export const teamSelectors = {
  selectTeamsState,
  selectAllTeams,
  selectCurrentTeam,
  selectTeamMembers,
  selectMembershipRequests,
  selectTeamsLoading,
  selectTeamsError,
  selectTeamById
}; 