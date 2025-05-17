import { createAsyncThunk } from '@reduxjs/toolkit';
import { standupAPI } from '../../../services/api';
import { 
  setHighlightStatus
} from './standupSlice';
import { AppDispatch, RootState } from '../../store';
import { Standup, CreateStandupDto, UpdateStandupDto } from './types';

/**
 * Fetch all standups
 */
export const fetchStandups = createAsyncThunk(
  'standups/fetchAll',
  async (params: Record<string, any> | undefined, { rejectWithValue }) => {
    try {
      const response = await standupAPI.getAll(params);
      console.log('Fetched standups:', response);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Failed to fetch standups:', errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Fetch a standup by date
 */
export const fetchStandup = createAsyncThunk(
  'standups/fetchByDate',
  async (date: string, { rejectWithValue }) => {
    try {
      const response = await standupAPI.getByDate(date);
      console.log(`Fetched standup for date ${date}:`, response);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error(`Failed to fetch standup for date ${date}:`, errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Create a new standup
 */
export const createStandup = createAsyncThunk(
  'standups/create',
  async (standupData: CreateStandupDto, { rejectWithValue }) => {
    try {
      const response = await standupAPI.create(standupData);
      console.log('Created standup:', response);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Failed to create standup:', errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Update an existing standup
 */
export const updateStandup = createAsyncThunk(
  'standups/update',
  async ({ date, standupData }: { date: string, standupData: UpdateStandupDto }, { rejectWithValue }) => {
    try {
      const response = await standupAPI.update(date, standupData);
      console.log('Updated standup:', response);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Failed to update standup:', errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Delete a standup
 */
export const deleteStandup = createAsyncThunk(
  'standups/delete',
  async (date: string, { rejectWithValue }) => {
    try {
      await standupAPI.delete(date);
      return date;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Failed to delete standup:', errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Toggle a standup highlight status
 * Uses optimistic updates for better UX
 */
export const toggleHighlight = createAsyncThunk(
  'standups/toggleHighlight',
  async (date: string, { dispatch, getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const standup = state.standups.standups.find((s: Standup) => s.date === date);
    
    if (!standup) return rejectWithValue('Standup not found');
    
    // Optimistic update for immediate feedback
    const newHighlightStatus = !standup.isHighlight;
    dispatch(setHighlightStatus({ date, isHighlight: newHighlightStatus }));
    
    try {
      const response = await standupAPI.toggleHighlight(date);
      
      // Verify response
      if (!response.data || !response.data.date) {
        console.error('Invalid response data for highlight toggle:', response);
        throw new Error('Invalid response data for highlight toggle');
      }
      
      console.log('Toggle highlight response:', response.data);
      return response.data;
    } catch (error) {
      // Revert the optimistic update on failure
      dispatch(setHighlightStatus({ date, isHighlight: standup.isHighlight }));
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Failed to toggle highlight:', errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
); 