import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Team, TeamMember, TeamsState } from './types';
import {
  fetchTeams,
  fetchTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  fetchTeamMembers,
  addTeamMember,
  updateMemberRole,
  removeTeamMember,
  leaveTeam,
  switchTeam
} from './thunks';

// Initial state for the teams feature
const initialState: TeamsState = {
  teams: [],
  currentTeam: null,
  members: [],
  loading: false,
  error: null,
  success: false
};

// Create the teams slice
export const teamSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    // Clear current team
    clearCurrentTeam: (state) => {
      state.currentTeam = null;
      state.error = null;
    },

    // Reset success flag
    resetSuccess: (state) => {
      state.success = false;
      state.error = null;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch all teams
    builder
      .addCase(fetchTeams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeams.fulfilled, (state, action: PayloadAction<Team[]>) => {
        state.loading = false;
        state.teams = action.payload;
        state.error = null;
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch teams';
      });

    // Fetch team by ID
    builder
      .addCase(fetchTeamById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeamById.fulfilled, (state, action: PayloadAction<Team>) => {
        state.loading = false;
        state.currentTeam = action.payload;
        state.error = null;
      })
      .addCase(fetchTeamById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch team';
      });

    // Create team
    builder
      .addCase(createTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createTeam.fulfilled, (state, action: PayloadAction<Team>) => {
        state.loading = false;
        state.teams = [action.payload, ...state.teams];
        state.currentTeam = action.payload;
        state.error = null;
        state.success = true;
      })
      .addCase(createTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to create team';
        state.success = false;
      });

    // Update team
    builder
      .addCase(updateTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateTeam.fulfilled, (state, action: PayloadAction<Team>) => {
        state.loading = false;
        state.teams = state.teams.map(team => 
          team.id === action.payload.id ? action.payload : team
        );
        state.currentTeam = action.payload;
        state.error = null;
        state.success = true;
      })
      .addCase(updateTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to update team';
        state.success = false;
      });

    // Delete team
    builder
      .addCase(deleteTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteTeam.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.teams = state.teams.filter(team => team.id !== action.payload);
        if (state.currentTeam?.id === action.payload) {
          state.currentTeam = null;
        }
        state.error = null;
        state.success = true;
      })
      .addCase(deleteTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to delete team';
        state.success = false;
      });

    // Fetch team members
    builder
      .addCase(fetchTeamMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeamMembers.fulfilled, (state, action: PayloadAction<{ teamId: string, members: TeamMember[] }>) => {
        state.loading = false;
        state.members = action.payload.members;
        // Also update members in the current team if it matches
        if (state.currentTeam?.id === action.payload.teamId) {
          state.currentTeam = {
            ...state.currentTeam,
            members: action.payload.members
          };
        }
        state.error = null;
      })
      .addCase(fetchTeamMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch team members';
      });

    // Add team member
    builder
      .addCase(addTeamMember.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addTeamMember.fulfilled, (state, action: PayloadAction<TeamMember>) => {
        state.loading = false;
        state.members = [...state.members, action.payload];
        // Also update members in the current team if it matches
        if (state.currentTeam?.id === action.payload.teamId) {
          state.currentTeam = {
            ...state.currentTeam,
            members: state.currentTeam.members ? 
              [...state.currentTeam.members, action.payload] : 
              [action.payload]
          };
        }
        state.error = null;
        state.success = true;
      })
      .addCase(addTeamMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to add team member';
        state.success = false;
      });

    // Update member role
    builder
      .addCase(updateMemberRole.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateMemberRole.fulfilled, (state, action: PayloadAction<TeamMember>) => {
        state.loading = false;
        // Update the member in the members array
        state.members = state.members.map(member => 
          member.id === action.payload.id ? action.payload : member
        );
        // Also update the member in the current team if it matches
        if (state.currentTeam?.id === action.payload.teamId && state.currentTeam.members) {
          state.currentTeam = {
            ...state.currentTeam,
            members: state.currentTeam.members.map(member => 
              member.id === action.payload.id ? action.payload : member
            )
          };
        }
        state.error = null;
        state.success = true;
      })
      .addCase(updateMemberRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to update member role';
        state.success = false;
      });

    // Remove team member
    builder
      .addCase(removeTeamMember.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(removeTeamMember.fulfilled, (state, action: PayloadAction<{ teamId: string, memberId: string }>) => {
        state.loading = false;
        // Remove the member from the members array
        state.members = state.members.filter(member => member.id !== action.payload.memberId);
        // Also remove the member from the current team if it matches
        if (state.currentTeam?.id === action.payload.teamId && state.currentTeam.members) {
          state.currentTeam = {
            ...state.currentTeam,
            members: state.currentTeam.members.filter(member => 
              member.id !== action.payload.memberId
            )
          };
        }
        state.error = null;
        state.success = true;
      })
      .addCase(removeTeamMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to remove team member';
        state.success = false;
      });

    // Leave team
    builder
      .addCase(leaveTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(leaveTeam.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        // Remove the team from the teams array
        state.teams = state.teams.filter(team => team.id !== action.payload);
        // Also clear the current team if it matches
        if (state.currentTeam?.id === action.payload) {
          state.currentTeam = null;
        }
        state.error = null;
        state.success = true;
      })
      .addCase(leaveTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to leave team';
        state.success = false;
      });

    // Switch team
    builder
      .addCase(switchTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(switchTeam.fulfilled, (state, action: PayloadAction<Team>) => {
        state.loading = false;
        state.currentTeam = action.payload;
        // Update the team in the teams array if it exists
        state.teams = state.teams.map(team => 
          team.id === action.payload.id ? action.payload : team
        );
        state.error = null;
      })
      .addCase(switchTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to switch team';
      });
  }
});

// Export actions
export const {
  clearCurrentTeam,
  resetSuccess,
  clearError
} = teamSlice.actions;

// Export reducer
export default teamSlice.reducer; 