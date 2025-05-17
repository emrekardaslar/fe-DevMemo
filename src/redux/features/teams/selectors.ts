import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { Team, TeamMember } from './types';

// Base selectors
const selectTeamsState = (state: RootState) => state.teams;

// Select all teams
export const selectAllTeams = createSelector(
  [selectTeamsState],
  (teamsState) => teamsState.teams
);

// Select current team
export const selectCurrentTeam = createSelector(
  [selectTeamsState],
  (teamsState) => teamsState.currentTeam
);

// Select team members
export const selectTeamMembers = createSelector(
  [selectTeamsState],
  (teamsState) => teamsState.members
);

// Select loading state
export const selectTeamsLoading = createSelector(
  [selectTeamsState],
  (teamsState) => teamsState.loading
);

// Select error state
export const selectTeamsError = createSelector(
  [selectTeamsState],
  (teamsState) => teamsState.error
);

// Select success state
export const selectTeamsSuccess = createSelector(
  [selectTeamsState],
  (teamsState) => teamsState.success
);

// Select a team by ID
export const selectTeamById = createSelector(
  [selectAllTeams, (_, teamId: string) => teamId],
  (teams, teamId) => teams.find((team: Team) => team.id === teamId) || null
);

// Select members of a specific team
export const selectMembersByTeamId = createSelector(
  [selectTeamMembers, (_, teamId: string) => teamId],
  (members, teamId) => members.filter((member: TeamMember) => member.teamId === teamId)
);

// Select members by role
export const selectMembersByRole = createSelector(
  [selectTeamMembers, (_, role: TeamMember['role']) => role],
  (members, role) => members.filter((member: TeamMember) => member.role === role)
);

// Select admin members of the current team
export const selectCurrentTeamAdmins = createSelector(
  [selectCurrentTeam],
  (currentTeam) => {
    if (!currentTeam || !currentTeam.members) return [];
    return currentTeam.members.filter((member: TeamMember) => member.role === 'admin');
  }
);

// Select whether the user is an admin of the current team (placeholder, to be implemented with auth)
export const selectIsCurrentTeamAdmin = createSelector(
  [selectCurrentTeam, (state: RootState) => state.auth.user?.id],
  (currentTeam, userId) => {
    // TEMPORARY: Return true for demo purposes until auth is implemented
    return true;
    
    // ORIGINAL IMPLEMENTATION:
    // if (!currentTeam || !currentTeam.members || !userId) return false;
    // const userMember = currentTeam.members.find((member: TeamMember) => member.userId === userId);
    // return userMember?.role === 'admin';
  }
); 