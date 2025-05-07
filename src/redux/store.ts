import { createStore, applyMiddleware, combineReducers, Action } from 'redux';
import { thunk, ThunkDispatch } from 'redux-thunk';
import standupReducer from './standups/reducer';

const rootReducer = combineReducers({
  standups: standupReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = ThunkDispatch<RootState, unknown, Action>;

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

export default store; 