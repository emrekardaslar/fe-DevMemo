import { ThunkAction } from 'redux-thunk';
import { StandupActionTypes, StandupAction, Standup, CreateStandupDto, UpdateStandupDto } from './types';
import { RootState } from '../store';
import { standupAPI } from '../../services/api';

// Action creators
export const fetchStandups = (params = {}): ThunkAction<void, RootState, unknown, StandupAction> => {
  return async (dispatch) => {
    try {
      dispatch({ type: StandupActionTypes.FETCH_STANDUPS_REQUEST });
      const response = await standupAPI.getAll(params);
      dispatch({
        type: StandupActionTypes.FETCH_STANDUPS_SUCCESS,
        payload: response.data
      });
    } catch (error) {
      dispatch({
        type: StandupActionTypes.FETCH_STANDUPS_FAILURE,
        payload: (error as Error).message
      });
    }
  };
};

export const fetchStandup = (date: string): ThunkAction<void, RootState, unknown, StandupAction> => {
  return async (dispatch) => {
    try {
      dispatch({ type: StandupActionTypes.FETCH_STANDUP_REQUEST });
      const response = await standupAPI.getByDate(date);
      dispatch({
        type: StandupActionTypes.FETCH_STANDUP_SUCCESS,
        payload: response.data
      });
    } catch (error) {
      dispatch({
        type: StandupActionTypes.FETCH_STANDUP_FAILURE,
        payload: (error as Error).message
      });
    }
  };
};

export const createStandup = (
  standup: CreateStandupDto
): ThunkAction<void, RootState, unknown, StandupAction> => {
  return async (dispatch) => {
    try {
      dispatch({ type: StandupActionTypes.CREATE_STANDUP_REQUEST });
      const response = await standupAPI.create(standup);
      dispatch({
        type: StandupActionTypes.CREATE_STANDUP_SUCCESS,
        payload: response.data
      });
    } catch (error) {
      dispatch({
        type: StandupActionTypes.CREATE_STANDUP_FAILURE,
        payload: (error as Error).message
      });
    }
  };
};

export const updateStandup = (
  date: string,
  standup: UpdateStandupDto
): ThunkAction<void, RootState, unknown, StandupAction> => {
  return async (dispatch) => {
    try {
      dispatch({ type: StandupActionTypes.UPDATE_STANDUP_REQUEST });
      const response = await standupAPI.update(date, standup);
      dispatch({
        type: StandupActionTypes.UPDATE_STANDUP_SUCCESS,
        payload: response.data
      });
    } catch (error) {
      dispatch({
        type: StandupActionTypes.UPDATE_STANDUP_FAILURE,
        payload: (error as Error).message
      });
    }
  };
};

export const deleteStandup = (date: string): ThunkAction<void, RootState, unknown, StandupAction> => {
  return async (dispatch) => {
    try {
      dispatch({ type: StandupActionTypes.DELETE_STANDUP_REQUEST });
      await standupAPI.delete(date);
      dispatch({
        type: StandupActionTypes.DELETE_STANDUP_SUCCESS,
        payload: date
      });
    } catch (error) {
      dispatch({
        type: StandupActionTypes.DELETE_STANDUP_FAILURE,
        payload: (error as Error).message
      });
    }
  };
};

export const toggleHighlight = (date: string): ThunkAction<void, RootState, unknown, StandupAction> => {
  return async (dispatch, getState) => {
    try {
      const currentState = getState();
      
      dispatch({ type: StandupActionTypes.TOGGLE_HIGHLIGHT_REQUEST });
      
      // Call the API endpoint
      const response = await standupAPI.toggleHighlight(date);
      
      // Extract standup data from the response
      let standup;
      if (response.data && response.data.success === true && response.data.data) {
        // Response format: { success: true, data: { ...standup } }
        standup = response.data.data;
      } else if (response.data) {
        // Direct standup data or other response format
        standup = response.data;
      } else {
        throw new Error('Invalid response format from API');
      }
      
      // Verify we have valid standup data with a date
      if (!standup || !standup.date) {
        throw new Error(`Invalid standup data received: ${JSON.stringify(standup)}`);
      }
      
      // Dispatch success action with the standup data
      dispatch({
        type: StandupActionTypes.TOGGLE_HIGHLIGHT_SUCCESS,
        payload: standup
      });
      
      // Refresh the current standup if we're on the detail page
      const currentStandup = currentState.standups.currentStandup;
      if (currentStandup && currentStandup.date === date) {
        dispatch(fetchStandup(date));
      }
      
      // Refresh standups list to ensure state consistency
      dispatch(fetchStandups());
      
    } catch (error) {
      dispatch({
        type: StandupActionTypes.TOGGLE_HIGHLIGHT_FAILURE,
        payload: (error as Error).message
      });
    }
  };
};

export const clearStandup = (): StandupAction => ({
  type: StandupActionTypes.CLEAR_STANDUP
});

export const resetSuccess = (): StandupAction => ({
  type: StandupActionTypes.RESET_SUCCESS
}); 