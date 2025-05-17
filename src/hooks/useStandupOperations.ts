import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../redux/hooks';
import {
  fetchStandups,
  fetchStandup,
  createStandup,
  updateStandup as updateStandupThunk,
  deleteStandup as deleteStandupThunk,
  toggleHighlight as toggleHighlightThunk
} from '../redux/features/standups/thunks';
import {
  clearStandup,
  resetSuccess
} from '../redux/features/standups/standupSlice';
import { CreateStandupDto, UpdateStandupDto } from '../redux/features/standups/types';

/**
 * Custom hook for standup operations
 * Provides a clean interface for components to interact with standups
 */
export const useStandupOperations = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Load standups list
  const loadStandups = useCallback(async (params?: Record<string, any>) => {
    try {
      const resultAction = await dispatch(fetchStandups(params));
      if (fetchStandups.fulfilled.match(resultAction)) {
        return resultAction.payload;
      }
    } catch (error) {
      console.error('Failed to load standups:', error);
    }
    return null;
  }, [dispatch]);

  // Load single standup
  const loadStandup = useCallback(async (date: string) => {
    try {
      const resultAction = await dispatch(fetchStandup(date));
      if (fetchStandup.fulfilled.match(resultAction)) {
        return resultAction.payload;
      }
    } catch (error) {
      console.error(`Failed to load standup for date ${date}:`, error);
    }
    return null;
  }, [dispatch]);

  // Create a new standup
  const createStandupOperation = useCallback(async (standupData: CreateStandupDto, navigateAfter = true) => {
    try {
      const resultAction = await dispatch(createStandup(standupData));
      if (createStandup.fulfilled.match(resultAction)) {
        if (navigateAfter) {
          navigate('/standups');
        }
        return resultAction.payload;
      } else if (createStandup.rejected.match(resultAction)) {
        throw new Error(resultAction.payload as string || 'Failed to create standup');
      }
    } catch (error) {
      console.error('Failed to create standup:', error);
      throw error;
    }
    return null;
  }, [dispatch, navigate]);

  // Update an existing standup
  const updateStandup = useCallback(async (date: string, standupData: UpdateStandupDto, navigateAfter = true) => {
    try {
      const resultAction = await dispatch(updateStandupThunk({ date, standupData }));
      if (updateStandupThunk.fulfilled.match(resultAction)) {
        if (navigateAfter) {
          navigate('/standups');
        }
        return resultAction.payload;
      } else if (updateStandupThunk.rejected.match(resultAction)) {
        throw new Error(resultAction.payload as string || 'Failed to update standup');
      }
    } catch (error) {
      console.error(`Failed to update standup for date ${date}:`, error);
      throw error;
    }
    return null;
  }, [dispatch, navigate]);

  // Delete a standup
  const deleteStandup = useCallback(async (date: string, navigateAfter = true) => {
    try {
      const resultAction = await dispatch(deleteStandupThunk(date));
      if (deleteStandupThunk.fulfilled.match(resultAction)) {
        if (navigateAfter) {
          navigate('/standups');
        }
        return true;
      } else if (deleteStandupThunk.rejected.match(resultAction)) {
        throw new Error(resultAction.payload as string || 'Failed to delete standup');
      }
    } catch (error) {
      console.error(`Failed to delete standup for date ${date}:`, error);
      throw error;
    }
    return false;
  }, [dispatch, navigate]);

  // Toggle highlight status
  const toggleHighlight = useCallback(async (date: string) => {
    try {
      const resultAction = await dispatch(toggleHighlightThunk(date));
      if (toggleHighlightThunk.fulfilled.match(resultAction)) {
        return resultAction.payload;
      } else if (toggleHighlightThunk.rejected.match(resultAction)) {
        throw new Error(resultAction.payload as string || 'Failed to toggle highlight');
      }
    } catch (error) {
      console.error(`Failed to toggle highlight for date ${date}:`, error);
      throw error;
    }
    return null;
  }, [dispatch]);

  // Clear current standup
  const clearCurrentStandup = useCallback(() => {
    dispatch(clearStandup());
  }, [dispatch]);

  // Reset success state
  const resetSuccessState = useCallback(() => {
    dispatch(resetSuccess());
  }, [dispatch]);

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