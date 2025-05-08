import standupReducer from '../../../redux/standups/reducer';
import { StandupActionTypes } from '../../../redux/standups/types';

describe('Standup Reducer', () => {
  const initialState = {
    standups: [],
    currentStandup: null,
    loading: false,
    error: null,
    success: false
  };

  // Sample standup data for tests
  const sampleStandup = {
    date: '2023-05-01',
    yesterday: 'Worked on API endpoints',
    today: 'Writing tests',
    blockers: 'None',
    tags: ['api', 'testing'],
    mood: 4,
    productivity: 5,
    isHighlight: false,
    createdAt: '2023-05-01T12:00:00Z',
    updatedAt: '2023-05-01T12:00:00Z'
  };

  it('should return initial state', () => {
    // @ts-ignore - passing undefined action to get initial state
    expect(standupReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle FETCH_STANDUPS_REQUEST', () => {
    const action = {
      type: StandupActionTypes.FETCH_STANDUPS_REQUEST
    };
    
    expect(standupReducer(initialState, action)).toEqual({
      ...initialState,
      loading: true,
      error: null
    });
  });

  it('should handle FETCH_STANDUPS_SUCCESS', () => {
    const standups = [sampleStandup];
    const action = {
      type: StandupActionTypes.FETCH_STANDUPS_SUCCESS,
      payload: standups
    };
    
    expect(standupReducer(initialState, action)).toEqual({
      ...initialState,
      loading: false,
      standups,
      error: null
    });
  });

  it('should handle FETCH_STANDUPS_FAILURE', () => {
    const errorMessage = 'Failed to fetch standups';
    const action = {
      type: StandupActionTypes.FETCH_STANDUPS_FAILURE,
      payload: errorMessage
    };
    
    expect(standupReducer(initialState, action)).toEqual({
      ...initialState,
      loading: false,
      error: errorMessage
    });
  });

  it('should handle CREATE_STANDUP_SUCCESS', () => {
    const newStandup = sampleStandup;
    const action = {
      type: StandupActionTypes.CREATE_STANDUP_SUCCESS,
      payload: newStandup
    };
    
    expect(standupReducer(initialState, action)).toEqual({
      ...initialState,
      loading: false,
      standups: [newStandup],
      currentStandup: newStandup,
      error: null,
      success: true
    });
  });

  it('should handle UPDATE_STANDUP_SUCCESS', () => {
    // Start with a state that already has standups
    const existingState = {
      ...initialState,
      standups: [sampleStandup]
    };
    
    // Create an updated standup
    const updatedStandup = {
      ...sampleStandup,
      today: 'Updated today task',
      tags: ['api', 'testing', 'updated']
    };
    
    const action = {
      type: StandupActionTypes.UPDATE_STANDUP_SUCCESS,
      payload: updatedStandup
    };
    
    expect(standupReducer(existingState, action)).toEqual({
      ...existingState,
      loading: false,
      standups: [updatedStandup],
      currentStandup: updatedStandup,
      error: null,
      success: true
    });
  });

  it('should handle DELETE_STANDUP_SUCCESS', () => {
    // Start with a state that already has standups
    const existingState = {
      ...initialState,
      standups: [sampleStandup],
      currentStandup: sampleStandup
    };
    
    const action = {
      type: StandupActionTypes.DELETE_STANDUP_SUCCESS,
      payload: sampleStandup.date
    };
    
    expect(standupReducer(existingState, action)).toEqual({
      ...existingState,
      loading: false,
      standups: [],
      currentStandup: null,
      error: null,
      success: true
    });
  });

  it('should handle TOGGLE_HIGHLIGHT_SUCCESS', () => {
    // Start with a state that already has standups
    const existingState = {
      ...initialState,
      standups: [sampleStandup]
    };
    
    // Create a standup with toggled highlight
    const highlightedStandup = {
      ...sampleStandup,
      isHighlight: true
    };
    
    const action = {
      type: StandupActionTypes.TOGGLE_HIGHLIGHT_SUCCESS,
      payload: highlightedStandup
    };
    
    expect(standupReducer(existingState, action)).toEqual({
      ...existingState,
      loading: false,
      standups: [highlightedStandup],
      error: null
    });
  });

  it('should handle CLEAR_STANDUP', () => {
    // Start with a state that has a current standup
    const existingState = {
      ...initialState,
      currentStandup: sampleStandup,
      error: 'Some error'
    };
    
    const action = {
      type: StandupActionTypes.CLEAR_STANDUP
    };
    
    expect(standupReducer(existingState, action)).toEqual({
      ...existingState,
      currentStandup: null,
      error: null
    });
  });

  it('should handle RESET_SUCCESS', () => {
    // Start with a state that has success=true
    const existingState = {
      ...initialState,
      success: true,
      error: 'Some error'
    };
    
    const action = {
      type: StandupActionTypes.RESET_SUCCESS
    };
    
    expect(standupReducer(existingState, action)).toEqual({
      ...existingState,
      success: false,
      error: null
    });
  });
}); 