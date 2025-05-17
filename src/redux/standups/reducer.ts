import { StandupState, StandupAction, StandupActionTypes } from './types';

const initialState: StandupState = {
  standups: [],
  currentStandup: null,
  loading: false,
  error: null,
  success: false
};

const standupReducer = (state = initialState, action: StandupAction): StandupState => {
  switch (action.type) {
    // Fetch all standups
    case StandupActionTypes.FETCH_STANDUPS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case StandupActionTypes.FETCH_STANDUPS_SUCCESS:
      return {
        ...state,
        loading: false,
        standups: action.payload,
        error: null
      };
    case StandupActionTypes.FETCH_STANDUPS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
      
    // Fetch single standup
    case StandupActionTypes.FETCH_STANDUP_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case StandupActionTypes.FETCH_STANDUP_SUCCESS:
      return {
        ...state,
        loading: false,
        currentStandup: action.payload,
        error: null
      };
    case StandupActionTypes.FETCH_STANDUP_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
      
    // Create standup
    case StandupActionTypes.CREATE_STANDUP_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: false
      };
    case StandupActionTypes.CREATE_STANDUP_SUCCESS:
      return {
        ...state,
        loading: false,
        standups: [action.payload, ...state.standups],
        currentStandup: action.payload,
        error: null,
        success: true
      };
    case StandupActionTypes.CREATE_STANDUP_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false
      };
      
    // Update standup
    case StandupActionTypes.UPDATE_STANDUP_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: false
      };
    case StandupActionTypes.UPDATE_STANDUP_SUCCESS:
      return {
        ...state,
        loading: false,
        standups: state.standups.map(standup => 
          standup.date === action.payload.date ? action.payload : standup
        ),
        currentStandup: action.payload,
        error: null,
        success: true
      };
    case StandupActionTypes.UPDATE_STANDUP_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false
      };
      
    // Delete standup
    case StandupActionTypes.DELETE_STANDUP_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: false
      };
    case StandupActionTypes.DELETE_STANDUP_SUCCESS:
      return {
        ...state,
        loading: false,
        standups: state.standups.filter(standup => standup.date !== action.payload),
        currentStandup: state.currentStandup?.date === action.payload ? null : state.currentStandup,
        error: null,
        success: true
      };
    case StandupActionTypes.DELETE_STANDUP_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false
      };
      
    // Toggle highlight
    case StandupActionTypes.TOGGLE_HIGHLIGHT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case StandupActionTypes.TOGGLE_HIGHLIGHT_SUCCESS:
      // Make sure we have valid payload data
      if (!action.payload || !action.payload.date) {
        return {
          ...state,
          loading: false,
          error: 'Invalid response data for highlight toggle'
        };
      }
      
      return {
        ...state,
        loading: false,
        standups: state.standups.map(standup => 
          standup.date === action.payload.date ? action.payload : standup
        ),
        currentStandup: state.currentStandup?.date === action.payload.date ? 
          action.payload : state.currentStandup,
        error: null
      };
    case StandupActionTypes.TOGGLE_HIGHLIGHT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    // Clear current standup
    case StandupActionTypes.CLEAR_STANDUP:
      return {
        ...state,
        currentStandup: null,
        error: null
      };
      
    // Reset success flag
    case StandupActionTypes.RESET_SUCCESS:
      return {
        ...state,
        success: false,
        error: null
      };
      
    default:
      return state;
  }
};

export default standupReducer; 