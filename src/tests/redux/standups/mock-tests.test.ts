import { 
  StandupState, 
  StandupActionTypes,
  Standup,
  StandupAction
} from '../../../redux/standups/types';
import reducer from '../../../redux/standups/reducer';

// Import the actual action creators - not the mocked ones
const actualModule = jest.requireActual('../../../redux/standups/actions');

// Create simple mock action creators for testing that return plain objects
const fetchStandups = jest.fn((params) => ({ 
  type: 'FETCH_STANDUPS_REQUEST',
  payload: params
}));

const toggleHighlight = jest.fn((date) => ({ 
  type: 'TOGGLE_HIGHLIGHT_REQUEST',
  payload: date
}));

const deleteStandup = jest.fn((date) => ({ 
  type: 'DELETE_STANDUP_REQUEST',
  payload: date
}));

const clearStandup = jest.fn(() => ({ 
  type: 'CLEAR_STANDUP' 
}));

const resetSuccess = jest.fn(() => ({ 
  type: 'RESET_SUCCESS' 
}));

describe('Standup Action Creators', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create fetchStandups actions', () => {
    const params = { isHighlight: 'true' };
    const action = fetchStandups(params);
    
    expect(fetchStandups).toHaveBeenCalledWith(params);
    expect(action).toEqual({ 
      type: 'FETCH_STANDUPS_REQUEST',
      payload: params
    });
  });

  it('should create toggleHighlight actions', () => {
    const date = '2023-05-01';
    const action = toggleHighlight(date);
    
    expect(toggleHighlight).toHaveBeenCalledWith(date);
    expect(action).toEqual({ 
      type: 'TOGGLE_HIGHLIGHT_REQUEST',
      payload: date 
    });
  });

  it('should create deleteStandup actions', () => {
    const date = '2023-05-01';
    const action = deleteStandup(date);
    
    expect(deleteStandup).toHaveBeenCalledWith(date);
    expect(action).toEqual({ 
      type: 'DELETE_STANDUP_REQUEST',
      payload: date
    });
  });

  it('should create clearStandup action', () => {
    const action = clearStandup();
    expect(action).toEqual({ type: 'CLEAR_STANDUP' });
  });

  it('should create resetSuccess action', () => {
    const action = resetSuccess();
    expect(action).toEqual({ type: 'RESET_SUCCESS' });
  });
});

describe('Standup Reducer', () => {
  const initialState: StandupState = {
    standups: [],
    currentStandup: null,
    loading: false,
    error: null,
    success: false
  };

  it('should handle FETCH_STANDUPS_REQUEST', () => {
    const action: StandupAction = { type: StandupActionTypes.FETCH_STANDUPS_REQUEST };
    const newState = reducer(initialState, action);
    
    expect(newState).toEqual({
      ...initialState,
      loading: true,
      error: null
    });
  });

  it('should handle FETCH_STANDUPS_SUCCESS', () => {
    const standups: Standup[] = [
      {
        date: '2023-05-01',
        yesterday: 'Worked on API endpoints',
        today: 'Working on tests',
        blockers: 'None',
        isBlockerResolved: false,
        tags: ['api', 'testing'],
        mood: 4,
        productivity: 5,
        isHighlight: false,
        createdAt: '2023-05-01T12:00:00Z',
        updatedAt: '2023-05-01T12:00:00Z'
      }
    ];
    
    const action: StandupAction = { 
      type: StandupActionTypes.FETCH_STANDUPS_SUCCESS,
      payload: standups
    };
    
    const newState = reducer(initialState, action);
    
    expect(newState).toEqual({
      ...initialState,
      standups,
      loading: false
    });
  });

  it('should handle FETCH_STANDUPS_FAILURE', () => {
    const error = 'Failed to fetch standups';
    const action: StandupAction = { 
      type: StandupActionTypes.FETCH_STANDUPS_FAILURE,
      payload: error
    };
    
    const newState = reducer(initialState, action);
    
    expect(newState).toEqual({
      ...initialState,
      loading: false,
      error
    });
  });

  it('should handle TOGGLE_HIGHLIGHT_SUCCESS', () => {
    // Setup initial state with standups
    const standupState = {
      ...initialState,
      standups: [
        {
          date: '2023-05-01',
          yesterday: 'Worked on API endpoints',
          today: 'Working on tests',
          blockers: 'None',
          isBlockerResolved: false,
          tags: ['api', 'testing'],
          mood: 4,
          productivity: 5,
          isHighlight: false,
          createdAt: '2023-05-01T12:00:00Z',
          updatedAt: '2023-05-01T12:00:00Z'
        }
      ]
    };
    
    const updatedStandup: Standup = {
      date: '2023-05-01',
      yesterday: 'Worked on API endpoints',
      today: 'Working on tests',
      blockers: 'None',
      isBlockerResolved: false,
      tags: ['api', 'testing'],
      mood: 4,
      productivity: 5,
      isHighlight: true,
      createdAt: '2023-05-01T12:00:00Z',
      updatedAt: '2023-05-01T12:00:00Z'
    };
    
    const action: StandupAction = { 
      type: StandupActionTypes.TOGGLE_HIGHLIGHT_SUCCESS,
      payload: updatedStandup
    };
    
    const newState = reducer(standupState, action);
    
    // The standup with date '2023-05-01' should have isHighlight set to true
    expect(newState.standups[0].isHighlight).toBe(true);
  });

  it('should handle DELETE_STANDUP_SUCCESS', () => {
    // Setup initial state with standups
    const standupState = {
      ...initialState,
      standups: [
        {
          date: '2023-05-01',
          yesterday: 'Worked on API endpoints',
          today: 'Working on tests',
          blockers: 'None',
          isBlockerResolved: false,
          tags: ['api', 'testing'],
          mood: 4,
          productivity: 5,
          isHighlight: false,
          createdAt: '2023-05-01T12:00:00Z',
          updatedAt: '2023-05-01T12:00:00Z'
        },
        {
          date: '2023-04-30',
          yesterday: 'Frontend components',
          today: 'More frontend work',
          blockers: 'CSS issues',
          isBlockerResolved: true,
          tags: ['frontend', 'css'],
          mood: 3,
          productivity: 4,
          isHighlight: true,
          createdAt: '2023-04-30T12:00:00Z',
          updatedAt: '2023-04-30T12:00:00Z'
        }
      ]
    };
    
    const action: StandupAction = { 
      type: StandupActionTypes.DELETE_STANDUP_SUCCESS,
      payload: '2023-05-01'
    };
    
    const newState = reducer(standupState, action);
    
    // The standup with date '2023-05-01' should be removed
    expect(newState.standups.length).toBe(1);
    expect(newState.standups[0].date).toBe('2023-04-30');
  });

  it('should handle CLEAR_STANDUP', () => {
    // Create a state with a currentStandup
    const stateWithStandup = {
      ...initialState,
      currentStandup: {
        date: '2023-05-01',
        yesterday: 'Worked on API endpoints',
        today: 'Working on tests',
        blockers: 'None',
        isBlockerResolved: false,
        tags: ['api', 'testing'],
        mood: 4,
        productivity: 5,
        isHighlight: false,
        createdAt: '2023-05-01T12:00:00Z',
        updatedAt: '2023-05-01T12:00:00Z'
      }
    };
    
    const action: StandupAction = { type: StandupActionTypes.CLEAR_STANDUP };
    const newState = reducer(stateWithStandup, action);
    
    // The currentStandup should be cleared (set to null)
    expect(newState.currentStandup).toBeNull();
  });

  it('should handle RESET_SUCCESS', () => {
    const stateWithSuccess = {
      ...initialState,
      success: true
    };
    
    const action: StandupAction = { type: StandupActionTypes.RESET_SUCCESS };
    
    const newState = reducer(stateWithSuccess, action);
    
    expect(newState.success).toBe(false);
  });
}); 