import { createAsyncThunk } from '@reduxjs/toolkit';
import { teamAPI } from '../../../services/api';
import { 
  Team, 
  TeamMember, 
  CreateTeamDto, 
  UpdateTeamDto, 
  AddTeamMemberDto, 
  UpdateMemberRoleDto 
} from './types';
import { AppDispatch, RootState } from '../../store';

/**
 * Fetch all teams
 */
// Mock data for demo purposes until backend is implemented
const MOCK_TEAMS = [
  {
    id: '1',
    name: 'Engineering Team',
    description: 'Frontend and backend developers',
    createdAt: '2023-01-15T08:00:00.000Z',
    updatedAt: '2023-01-15T08:00:00.000Z',
    createdBy: 'user1',
    members: [
      {
        id: '101',
        userId: 'user1',
        teamId: '1',
        role: 'admin',
        joinedAt: '2023-01-15T08:00:00.000Z',
        username: 'John Doe',
        email: 'john@example.com'
      },
      {
        id: '102',
        userId: 'user2',
        teamId: '1',
        role: 'member',
        joinedAt: '2023-01-16T10:30:00.000Z',
        username: 'Jane Smith',
        email: 'jane@example.com'
      }
    ]
  },
  {
    id: '2',
    name: 'Design Team',
    description: 'UI/UX designers and researchers',
    createdAt: '2023-02-10T14:00:00.000Z',
    updatedAt: '2023-02-10T14:00:00.000Z',
    createdBy: 'user3',
    members: []
  }
];

export const fetchTeams = createAsyncThunk(
  'teams/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      // Use mock data in development until backend is available
      console.log('Backend not available, using mock data');
      // Simulate a network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return MOCK_TEAMS;
      
      // Original code:
      // const response = await teamAPI.getAllTeams();
      // console.log('Fetched teams:', response);
      // return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Failed to fetch teams:', errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Fetch a team by ID
 */
export const fetchTeamById = createAsyncThunk(
  'teams/fetchById',
  async (teamId: string, { rejectWithValue }) => {
    try {
      // Use mock data in development until backend is available
      console.log('Backend not available, using mock data');
      // Simulate a network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const team = MOCK_TEAMS.find(team => team.id === teamId);
      if (!team) {
        throw new Error(`Team with ID ${teamId} not found`);
      }
      
      return team;
      
      // Original code:
      // const response = await teamAPI.getTeamById(teamId);
      // console.log(`Fetched team with ID ${teamId}:`, response);
      // return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error(`Failed to fetch team with ID ${teamId}:`, errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Create a new team
 */
export const createTeam = createAsyncThunk(
  'teams/create',
  async (teamData: CreateTeamDto, { rejectWithValue }) => {
    try {
      const response = await teamAPI.createTeam(teamData);
      console.log('Created team:', response);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Failed to create team:', errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Update an existing team
 */
export const updateTeam = createAsyncThunk(
  'teams/update',
  async ({ teamId, teamData }: { teamId: string, teamData: UpdateTeamDto }, { rejectWithValue }) => {
    try {
      const response = await teamAPI.updateTeam(teamId, teamData);
      console.log('Updated team:', response);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Failed to update team:', errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Delete a team
 */
export const deleteTeam = createAsyncThunk(
  'teams/delete',
  async (teamId: string, { rejectWithValue }) => {
    try {
      await teamAPI.deleteTeam(teamId);
      return teamId;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Failed to delete team:', errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Fetch team members
 */
export const fetchTeamMembers = createAsyncThunk(
  'teams/fetchMembers',
  async (teamId: string, { rejectWithValue }) => {
    try {
      const response = await teamAPI.getTeamMembers(teamId);
      console.log(`Fetched members for team ${teamId}:`, response);
      return { teamId, members: response };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error(`Failed to fetch members for team ${teamId}:`, errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Add a member to a team
 */
export const addTeamMember = createAsyncThunk(
  'teams/addMember',
  async ({ teamId, memberData }: { teamId: string, memberData: AddTeamMemberDto }, { rejectWithValue }) => {
    try {
      const response = await teamAPI.addTeamMember(teamId, memberData);
      console.log('Added team member:', response);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Failed to add team member:', errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Update a member's role
 */
export const updateMemberRole = createAsyncThunk(
  'teams/updateMemberRole',
  async ({ teamId, memberId, roleData }: { teamId: string, memberId: string, roleData: UpdateMemberRoleDto }, { rejectWithValue }) => {
    try {
      const response = await teamAPI.updateMemberRole(teamId, memberId, roleData);
      console.log('Updated team member role:', response);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Failed to update member role:', errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Remove a member from a team
 */
export const removeTeamMember = createAsyncThunk(
  'teams/removeMember',
  async ({ teamId, memberId }: { teamId: string, memberId: string }, { rejectWithValue }) => {
    try {
      await teamAPI.removeTeamMember(teamId, memberId);
      return { teamId, memberId };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Failed to remove team member:', errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Leave a team (current user)
 */
export const leaveTeam = createAsyncThunk(
  'teams/leave',
  async (teamId: string, { rejectWithValue }) => {
    try {
      await teamAPI.leaveTeam(teamId);
      return teamId;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Failed to leave team:', errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Switch to a different team
 */
export const switchTeam = createAsyncThunk(
  'teams/switch',
  async (teamId: string, { rejectWithValue }) => {
    try {
      const response = await teamAPI.switchTeam(teamId);
      console.log('Switched to team:', response);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Failed to switch team:', errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
); 