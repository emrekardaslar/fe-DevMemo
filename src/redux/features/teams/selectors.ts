import { RootState } from '../../store';

// Simplified selectors with no typings
const selectTeamsState = (state: RootState) => state.teams;

export const selectTeams = (state: RootState) => 
  selectTeamsState(state).teams;

export const selectCurrentTeam = (state: RootState) => 
  selectTeamsState(state).currentTeam;

export const selectTeamMembers = (state: RootState) => 
  selectTeamsState(state).members;

export const selectTeamLoading = (state: RootState) => 
  selectTeamsState(state).loading;

export const selectTeamError = (state: RootState) => 
  selectTeamsState(state).error;

export const selectTeamSuccess = (state: RootState) => 
  selectTeamsState(state).success;

// Export as default to allow importing all at once
export default {
  selectTeams,
  selectCurrentTeam,
  selectTeamMembers,
  selectTeamLoading,
  selectTeamError,
  selectTeamSuccess
}; 