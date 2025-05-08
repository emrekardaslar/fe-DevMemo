import { StandupActionTypes } from '../../../redux/standups/types';
import * as actions from '../../../redux/standups/actions';

describe('Standup Actions', () => {
  // Tests for action creators without middleware
  it('should create an action to clear standup', () => {
    const expectedAction = {
      type: StandupActionTypes.CLEAR_STANDUP
    };
    
    expect(actions.clearStandup()).toEqual(expectedAction);
  });

  it('should create an action to reset success', () => {
    const expectedAction = {
      type: StandupActionTypes.RESET_SUCCESS
    };
    
    expect(actions.resetSuccess()).toEqual(expectedAction);
  });
}); 