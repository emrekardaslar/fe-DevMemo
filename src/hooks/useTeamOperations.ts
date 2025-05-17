import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
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
} from '../redux/features/teams/thunks';
import { 
  clearCurrentTeam, 
  resetSuccess 
} from '../redux/features/teams/teamSlice';
import { 
  selectAllTeams, 
  selectCurrentTeam, 
  selectTeamMembers, 
  selectTeamsLoading, 
  selectTeamsError, 
  selectTeamsSuccess 
} from '../redux/features/teams/selectors';
import { 
  CreateTeamDto, 
  UpdateTeamDto, 
  AddTeamMemberDto, 
  UpdateMemberRoleDto 
} from '../redux/features/teams/types';
import { addNotification } from '../redux/features/ui/uiSlice';

/**
 * Custom hook for team operations
 */
export const useTeamOperations = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Select states from the store
  const teams = useAppSelector(selectAllTeams);
  const currentTeam = useAppSelector(selectCurrentTeam);
  const members = useAppSelector(selectTeamMembers);
  const loading = useAppSelector(selectTeamsLoading);
  const error = useAppSelector(selectTeamsError);
  const success = useAppSelector(selectTeamsSuccess);

  /**
   * Load all teams
   */
  const loadTeams = useCallback(async () => {
    try {
      await dispatch(fetchTeams()).unwrap();
      return true;
    } catch (err) {
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to load teams'
      }));
      return false;
    }
  }, [dispatch]);

  /**
   * Load a team by ID
   */
  const loadTeam = useCallback(async (teamId: string) => {
    try {
      await dispatch(fetchTeamById(teamId)).unwrap();
      return true;
    } catch (err) {
      dispatch(addNotification({
        type: 'error',
        message: `Failed to load team with ID ${teamId}`
      }));
      return false;
    }
  }, [dispatch]);

  /**
   * Create a new team
   */
  const createNewTeam = useCallback(async (teamData: CreateTeamDto, redirectToTeam = true) => {
    try {
      const result = await dispatch(createTeam(teamData)).unwrap();
      dispatch(addNotification({
        type: 'success',
        message: 'Team created successfully'
      }));
      
      if (redirectToTeam) {
        navigate(`/teams/${result.id}`);
      }
      
      return true;
    } catch (err) {
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to create team'
      }));
      return false;
    }
  }, [dispatch, navigate]);

  /**
   * Update a team
   */
  const updateExistingTeam = useCallback(async (teamId: string, teamData: UpdateTeamDto) => {
    setProcessingId(teamId);
    try {
      await dispatch(updateTeam({ teamId, teamData })).unwrap();
      dispatch(addNotification({
        type: 'success',
        message: 'Team updated successfully'
      }));
      setProcessingId(null);
      return true;
    } catch (err) {
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to update team'
      }));
      setProcessingId(null);
      return false;
    }
  }, [dispatch]);

  /**
   * Delete a team
   */
  const deleteExistingTeam = useCallback(async (teamId: string, navigateAfterDelete = true) => {
    setProcessingId(teamId);
    try {
      await dispatch(deleteTeam(teamId)).unwrap();
      dispatch(addNotification({
        type: 'success',
        message: 'Team deleted successfully'
      }));
      
      if (navigateAfterDelete) {
        navigate('/teams');
      }
      
      setProcessingId(null);
      return true;
    } catch (err) {
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to delete team'
      }));
      setProcessingId(null);
      return false;
    }
  }, [dispatch, navigate]);

  /**
   * Load team members
   */
  const loadTeamMembers = useCallback(async (teamId: string) => {
    try {
      await dispatch(fetchTeamMembers(teamId)).unwrap();
      return true;
    } catch (err) {
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to load team members'
      }));
      return false;
    }
  }, [dispatch]);

  /**
   * Add a team member
   */
  const addMember = useCallback(async (teamId: string, memberData: AddTeamMemberDto) => {
    try {
      await dispatch(addTeamMember({ teamId, memberData })).unwrap();
      dispatch(addNotification({
        type: 'success',
        message: 'Team member added successfully'
      }));
      return true;
    } catch (err) {
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to add team member'
      }));
      return false;
    }
  }, [dispatch]);

  /**
   * Update a member's role
   */
  const updateRole = useCallback(async (teamId: string, memberId: string, roleData: UpdateMemberRoleDto) => {
    setProcessingId(memberId);
    try {
      await dispatch(updateMemberRole({ teamId, memberId, roleData })).unwrap();
      dispatch(addNotification({
        type: 'success',
        message: 'Member role updated successfully'
      }));
      setProcessingId(null);
      return true;
    } catch (err) {
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to update member role'
      }));
      setProcessingId(null);
      return false;
    }
  }, [dispatch]);

  /**
   * Remove a team member
   */
  const removeMember = useCallback(async (teamId: string, memberId: string) => {
    setProcessingId(memberId);
    try {
      await dispatch(removeTeamMember({ teamId, memberId })).unwrap();
      dispatch(addNotification({
        type: 'success',
        message: 'Member removed successfully'
      }));
      setProcessingId(null);
      return true;
    } catch (err) {
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to remove team member'
      }));
      setProcessingId(null);
      return false;
    }
  }, [dispatch]);

  /**
   * Leave a team (current user)
   */
  const leaveCurrentTeam = useCallback(async (teamId: string, navigateAfterLeave = true) => {
    setProcessingId(teamId);
    try {
      await dispatch(leaveTeam(teamId)).unwrap();
      dispatch(addNotification({
        type: 'success',
        message: 'You have left the team'
      }));
      
      if (navigateAfterLeave) {
        navigate('/teams');
      }
      
      setProcessingId(null);
      return true;
    } catch (err) {
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to leave team'
      }));
      setProcessingId(null);
      return false;
    }
  }, [dispatch, navigate]);

  /**
   * Switch to a different team
   */
  const switchToTeam = useCallback(async (teamId: string) => {
    try {
      await dispatch(switchTeam(teamId)).unwrap();
      dispatch(addNotification({
        type: 'success',
        message: 'Switched team successfully'
      }));
      return true;
    } catch (err) {
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to switch team'
      }));
      return false;
    }
  }, [dispatch]);

  /**
   * Clear the current team
   */
  const clearTeam = useCallback(() => {
    dispatch(clearCurrentTeam());
  }, [dispatch]);

  /**
   * Reset success status
   */
  const resetSuccessStatus = useCallback(() => {
    dispatch(resetSuccess());
  }, [dispatch]);

  return {
    // State
    teams,
    currentTeam,
    members,
    loading,
    error,
    success,
    processingId,
    
    // Actions
    loadTeams,
    loadTeam,
    createNewTeam,
    updateExistingTeam,
    deleteExistingTeam,
    loadTeamMembers,
    addMember,
    updateRole,
    removeMember,
    leaveCurrentTeam,
    switchToTeam,
    clearTeam,
    resetSuccessStatus
  };
}; 