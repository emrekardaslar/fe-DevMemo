import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStandups, CreateStandupDto, UpdateStandupDto } from '../context/StandupContext';

/**
 * Custom hook for standup operations
 * Provides a clean interface for components to interact with standups
 */
export const useStandupOperations = () => {
  const {
    fetchStandups: fetchStandupsContext,
    fetchStandup: fetchStandupContext,
    createStandup: createStandupContext,
    updateStandup: updateStandupContext,
    deleteStandup: deleteStandupContext,
    toggleHighlight: toggleHighlightContext,
    clearStandup: clearStandupContext,
    resetSuccess: resetSuccessContext
  } = useStandups();
  
  const navigate = useNavigate();

  // Load standups list
  const loadStandups = useCallback(async (params?: Record<string, any>) => {
    try {
      await fetchStandupsContext();
      return true;
    } catch (error) {
      console.error('Failed to load standups:', error);
    }
    return null;
  }, [fetchStandupsContext]);

  // Load single standup
  const loadStandup = useCallback(async (date: string) => {
    try {
      await fetchStandupContext(date);
      return true;
    } catch (error) {
      console.error(`Failed to load standup for date ${date}:`, error);
    }
    return null;
  }, [fetchStandupContext]);

  // Create a new standup
  const createStandupOperation = useCallback(async (standupData: CreateStandupDto, navigateAfter = true) => {
    try {
      await createStandupContext(standupData);
      if (navigateAfter) {
        navigate('/standups');
      }
      return true;
    } catch (error) {
      console.error('Failed to create standup:', error);
      throw error;
    }
    return null;
  }, [createStandupContext, navigate]);

  // Update an existing standup
  const updateStandup = useCallback(async (date: string, standupData: UpdateStandupDto, navigateAfter = true) => {
    try {
      await updateStandupContext(date, standupData);
      if (navigateAfter) {
        navigate('/standups');
      }
      return true;
    } catch (error) {
      console.error(`Failed to update standup for date ${date}:`, error);
      throw error;
    }
    return null;
  }, [updateStandupContext, navigate]);

  // Delete a standup
  const deleteStandup = useCallback(async (date: string, navigateAfter = true) => {
    try {
      await deleteStandupContext(date);
      if (navigateAfter) {
        navigate('/standups');
      }
      return true;
    } catch (error) {
      console.error(`Failed to delete standup for date ${date}:`, error);
      throw error;
    }
    return false;
  }, [deleteStandupContext, navigate]);

  // Toggle highlight status
  const toggleHighlight = useCallback(async (date: string) => {
    try {
      await toggleHighlightContext(date);
      return true;
    } catch (error) {
      console.error(`Failed to toggle highlight for date ${date}:`, error);
      throw error;
    }
    return null;
  }, [toggleHighlightContext]);

  // Clear current standup
  const clearCurrentStandup = useCallback(() => {
    clearStandupContext();
  }, [clearStandupContext]);

  // Reset success state
  const resetSuccessState = useCallback(() => {
    resetSuccessContext();
  }, [resetSuccessContext]);

  return {
    loadStandups,
    loadStandup,
    createStandup: createStandupOperation,
    updateStandup,
    deleteStandup,
    toggleHighlight,
    clearCurrentStandup,
    resetSuccessState
  };
}; 