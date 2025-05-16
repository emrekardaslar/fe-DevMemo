import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk, ThunkDispatch } from 'redux-thunk';
import standupReducer from './standups/reducer';
import { StandupAction } from './standups/types';

const rootReducer = combineReducers({
  standups: standupReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = ThunkDispatch<RootState, unknown, StandupAction>;

const store = createStore(
  rootReducer as typeof rootReducer,
  undefined,
  applyMiddleware(thunk)
);

export default store; 