import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk, ThunkDispatch } from 'redux-thunk';
import standupReducer from './standups/reducer';
import authReducer from './auth/reducer';
import { StandupAction } from './standups/types';
import { AuthActionTypes } from './auth/types';

// Define the root reducer
const rootReducer = combineReducers({
  standups: standupReducer,
  auth: authReducer
});

// Define types for TypeScript
export type RootState = ReturnType<typeof rootReducer>;
export type AppAction = StandupAction | { type: AuthActionTypes; payload?: any };
export type AppDispatch = ThunkDispatch<RootState, unknown, AppAction>;

// Create Redux store
const store = createStore(
  rootReducer as typeof rootReducer,
  undefined,
  applyMiddleware(thunk)
);

export default store; 