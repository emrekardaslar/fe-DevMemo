import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { selectTeamsState } from '../selectors';
import { teamAPI } from '../services/teamService';
import {
  CreateTeamRequest,
  UpdateTeamRequest,
  AddTeamMemberRequest,
  UpdateTeamMemberRequest,
  TeamFilterOptions
} from '../types';

/**
 * Custom hook for team operations
 */
export const useTeams = () => {
  const dispatch = useAppDispatch();
  const teams = useAppSelector(selectTeamsState);

  // Get all teams
  const getTeams = useCallback(async (filter?: TeamFilterOptions) => {
    try {
      return await teamAPI.getTeams(filter);
    } catch (error: any) {
      console.error('Failed to get teams:', error);
      throw error;
    }
  }, []);

  // Get team by ID
  const getTeam = useCallback(async (teamId: string) => {
    try {
      return await teamAPI.getTeam(teamId);
    } catch (error: any) {
      console.error(`Failed to get team ${teamId}:`, error);
      throw error;
    }
  }, []);

  // Create a new team
  const createTeam = useCallback(async (data: CreateTeamRequest) => {
    try {
      return await teamAPI.createTeam(data);
    } catch (error: any) {
      console.error('Failed to create team:', error);
      throw error;
    }
  }, []);

  // Update team
  const updateTeam = useCallback(async (teamId: string, data: UpdateTeamRequest) => {
    try {
      return await teamAPI.updateTeam(teamId, data);
    } catch (error: any) {
      console.error(`Failed to update team ${teamId}:`, error);
      throw error;
    }
  }, []);

  // Delete team
  const deleteTeam = useCallback(async (teamId: string) => {
    try {
      return await teamAPI.deleteTeam(teamId);
    } catch (error: any) {
      console.error(`Failed to delete team ${teamId}:`, error);
      throw error;
    }
  }, []);

  // Get team members
  const getTeamMembers = useCallback(async (teamId: string) => {
    try {
      return await teamAPI.getTeamMembers(teamId);
    } catch (error: any) {
      console.error(`Failed to get members for team ${teamId}:`, error);
      throw error;
    }
  }, []);

  // Add team member
  const addTeamMember = useCallback(async (teamId: string, data: AddTeamMemberRequest) => {
    try {
      return await teamAPI.addTeamMember(teamId, data);
    } catch (error: any) {
      console.error(`Failed to add member to team ${teamId}:`, error);
      throw error;
    }
  }, []);

  // Update team member
  const updateTeamMember = useCallback(
    async (teamId: string, userId: string, data: UpdateTeamMemberRequest) => {
      try {
        return await teamAPI.updateTeamMember(teamId, userId, data);
      } catch (error: any) {
        console.error(`Failed to update member in team ${teamId}:`, error);
        throw error;
      }
    },
    []
  );

  // Remove team member
  const removeTeamMember = useCallback(async (teamId: string, userId: string) => {
    try {
      return await teamAPI.removeTeamMember(teamId, userId);
    } catch (error: any) {
      console.error(`Failed to remove member from team ${teamId}:`, error);
      throw error;
    }
  }, []);

  // Get user's teams
  const getUserTeams = useCallback(async () => {
    try {
      return await teamAPI.getUserTeams();
    } catch (error: any) {
      console.error('Failed to get user teams:', error);
      throw error;
    }
  }, []);

  return {
    teams: teams.teams,
    currentTeam: teams.currentTeam,
    members: teams.members,
    loading: teams.loading,
    error: teams.error,
    
    // Team operations
    getTeams,
    getTeam,
    createTeam,
    updateTeam,
    deleteTeam,
    
    // Team member operations
    getTeamMembers,
    addTeamMember,
    updateTeamMember,
    removeTeamMember,
    getUserTeams
  };
}; 