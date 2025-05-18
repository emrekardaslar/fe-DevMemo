import { AuthActionTypes, AuthState } from './types';

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null
};

// Reducer
const authReducer = (state = initialState, action: any): AuthState => {
  switch (action.type) {
    // Login
    case AuthActionTypes.LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case AuthActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false,
        error: null
      };
    
    case AuthActionTypes.LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    // Register
    case AuthActionTypes.REGISTER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case AuthActionTypes.REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null
      };
    
    case AuthActionTypes.REGISTER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    // Logout
    case AuthActionTypes.LOGOUT:
      return {
        ...initialState
      };
    
    // Get Profile
    case AuthActionTypes.GET_PROFILE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case AuthActionTypes.GET_PROFILE_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false,
        error: null
      };
    
    case AuthActionTypes.GET_PROFILE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    // Refresh Token
    case AuthActionTypes.REFRESH_TOKEN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case AuthActionTypes.REFRESH_TOKEN_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null
      };
    
    case AuthActionTypes.REFRESH_TOKEN_FAILURE:
      return {
        ...initialState // Reset to initial state on refresh failure
      };
    
    // Clear error
    case AuthActionTypes.CLEAR_AUTH_ERROR:
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};

export default authReducer; 