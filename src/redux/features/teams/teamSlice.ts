import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Team, TeamMember, TeamMembershipRequest } from '../../../features/teams/types';

// Define the state interface
export interface TeamsState {
  teams: Team[];
  currentTeam: Team | null;
  members: TeamMember[];
  membershipRequests: TeamMembershipRequest[];
  loading: boolean;
  error: string | null;
  success?: boolean; // Adding success flag to match selectors
}

// Initial state
const initialState: TeamsState = {
  teams: [],
  currentTeam: null,
  members: [],
  membershipRequests: [],
  loading: false,
  error: null,
  success: false
};

// Create the placeholder slice with typed parameters
const teamSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    // Teams actions - typed parameters but no implementation
    setTeams: (state, action: PayloadAction<Team[]>) => state,
    setCurrentTeam: (state, action: PayloadAction<Team | null>) => state,
    
    // Add this to fix the reference issue
    clearCurrentTeam: (state) => state,
    
    // Members actions - typed parameters but no implementation
    setMembers: (state, action: PayloadAction<TeamMember[]>) => state,
    setMembershipRequests: (state, action: PayloadAction<TeamMembershipRequest[]>) => state,
    
    // Status actions - typed parameters but no implementation
    setLoading: (state, action: PayloadAction<boolean>) => state,
    setError: (state, action: PayloadAction<string | null>) => state,
    resetSuccess: (state) => state
  }
});

// Export actions and reducer
export const {
  setTeams,
  setCurrentTeam,
  clearCurrentTeam,
  setMembers,
  setMembershipRequests,
  setLoading,
  setError,
  resetSuccess
} = teamSlice.actions;

export default teamSlice.reducer; 