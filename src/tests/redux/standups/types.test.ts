import {
  Standup,
  CreateStandupDto,
  UpdateStandupDto,
  StandupState,
  StandupActionTypes,
  StandupAction
} from '../../../redux/standups/types';

describe('Standup Types', () => {
  // Test Standup interface
  it('should validate Standup interface structure', () => {
    const standup: Standup = {
      date: '2023-05-01',
      yesterday: 'Worked on APIs',
      today: 'Writing tests',
      blockers: 'None',
      isBlockerResolved: false,
      tags: ['api', 'testing'],
      mood: 4,
      productivity: 5,
      isHighlight: false,
      createdAt: '2023-05-01T12:00:00Z',
      updatedAt: '2023-05-01T12:00:00Z'
    };

    // Check that all expected properties exist with the right types
    expect(standup).toHaveProperty('date');
    expect(typeof standup.date).toBe('string');
    
    expect(standup).toHaveProperty('yesterday');
    expect(typeof standup.yesterday).toBe('string');
    
    expect(standup).toHaveProperty('today');
    expect(typeof standup.today).toBe('string');
    
    expect(standup).toHaveProperty('blockers');
    expect(typeof standup.blockers).toBe('string');
    
    expect(standup).toHaveProperty('isBlockerResolved');
    expect(typeof standup.isBlockerResolved).toBe('boolean');
    
    expect(standup).toHaveProperty('tags');
    expect(Array.isArray(standup.tags)).toBe(true);
    
    expect(standup).toHaveProperty('mood');
    expect(typeof standup.mood).toBe('number');
    
    expect(standup).toHaveProperty('productivity');
    expect(typeof standup.productivity).toBe('number');
    
    expect(standup).toHaveProperty('isHighlight');
    expect(typeof standup.isHighlight).toBe('boolean');
    
    expect(standup).toHaveProperty('createdAt');
    expect(typeof standup.createdAt).toBe('string');
    
    expect(standup).toHaveProperty('updatedAt');
    expect(typeof standup.updatedAt).toBe('string');
  });

  // Test CreateStandupDto type
  it('should validate CreateStandupDto structure', () => {
    const newStandup: CreateStandupDto = {
      date: '2023-05-01',
      yesterday: 'Worked on APIs',
      today: 'Writing tests',
      blockers: 'None',
      isBlockerResolved: false,
      tags: ['api', 'testing'],
      mood: 4,
      productivity: 5,
      isHighlight: false
    };

    // Test with required fields
    expect(newStandup).toHaveProperty('date');
    expect(newStandup).toHaveProperty('yesterday');
    expect(newStandup).toHaveProperty('today');
    expect(newStandup).toHaveProperty('blockers');
    expect(newStandup).toHaveProperty('tags');
    expect(newStandup).toHaveProperty('isHighlight');
    expect(newStandup).toHaveProperty('mood');
    expect(newStandup).toHaveProperty('productivity');
    
    // These should not be present
    expect(newStandup).not.toHaveProperty('createdAt');
    expect(newStandup).not.toHaveProperty('updatedAt');
    
    // Create another standup with different mood/productivity
    const anotherStandup: CreateStandupDto = {
      date: '2023-05-02',
      yesterday: 'Worked on APIs',
      today: 'Writing more tests',
      blockers: 'None',
      isBlockerResolved: false,
      tags: ['api', 'testing'],
      mood: 5,
      productivity: 4,
      isHighlight: true
    };
    
    expect(anotherStandup.mood).toBe(5);
    expect(anotherStandup.productivity).toBe(4);
  });

  // Test UpdateStandupDto type
  it('should validate UpdateStandupDto structure', () => {
    // Test with a partial update (only some fields)
    const partialUpdate: UpdateStandupDto = {
      today: 'Updated task',
      tags: ['updated', 'testing']
    };
    
    expect(partialUpdate).toHaveProperty('today');
    expect(partialUpdate).toHaveProperty('tags');
    expect(partialUpdate).not.toHaveProperty('yesterday');
    expect(partialUpdate).not.toHaveProperty('date');
    
    // Test with a full update
    const fullUpdate: UpdateStandupDto = {
      date: '2023-05-01',
      yesterday: 'Worked on APIs',
      today: 'Writing tests',
      blockers: 'None',
      isBlockerResolved: false,
      tags: ['api', 'testing'],
      mood: 4,
      productivity: 5,
      isHighlight: false,
      createdAt: '2023-05-01T12:00:00Z',
      updatedAt: '2023-05-01T12:00:00Z'
    };
    
    expect(fullUpdate).toHaveProperty('date');
    expect(fullUpdate).toHaveProperty('yesterday');
    expect(fullUpdate).toHaveProperty('today');
    expect(fullUpdate).toHaveProperty('blockers');
    expect(fullUpdate).toHaveProperty('isBlockerResolved');
    expect(fullUpdate).toHaveProperty('tags');
    expect(fullUpdate).toHaveProperty('mood');
    expect(fullUpdate).toHaveProperty('productivity');
    expect(fullUpdate).toHaveProperty('isHighlight');
    expect(fullUpdate).toHaveProperty('createdAt');
    expect(fullUpdate).toHaveProperty('updatedAt');
  });

  // Test StandupState interface
  it('should validate StandupState interface structure', () => {
    const initialState: StandupState = {
      standups: [],
      currentStandup: null,
      loading: false,
      error: null,
      success: false
    };
    
    expect(initialState).toHaveProperty('standups');
    expect(Array.isArray(initialState.standups)).toBe(true);
    
    expect(initialState).toHaveProperty('currentStandup');
    expect(initialState.currentStandup).toBeNull();
    
    expect(initialState).toHaveProperty('loading');
    expect(typeof initialState.loading).toBe('boolean');
    
    expect(initialState).toHaveProperty('error');
    expect(initialState.error).toBeNull();
    
    expect(initialState).toHaveProperty('success');
    expect(typeof initialState.success).toBe('boolean');
  });

  // Test StandupActionTypes enum
  it('should contain all expected action types', () => {
    // Verify all action types exist
    expect(StandupActionTypes.FETCH_STANDUPS_REQUEST).toBeDefined();
    expect(StandupActionTypes.FETCH_STANDUPS_SUCCESS).toBeDefined();
    expect(StandupActionTypes.FETCH_STANDUPS_FAILURE).toBeDefined();
    
    expect(StandupActionTypes.FETCH_STANDUP_REQUEST).toBeDefined();
    expect(StandupActionTypes.FETCH_STANDUP_SUCCESS).toBeDefined();
    expect(StandupActionTypes.FETCH_STANDUP_FAILURE).toBeDefined();
    
    expect(StandupActionTypes.CREATE_STANDUP_REQUEST).toBeDefined();
    expect(StandupActionTypes.CREATE_STANDUP_SUCCESS).toBeDefined();
    expect(StandupActionTypes.CREATE_STANDUP_FAILURE).toBeDefined();
    
    expect(StandupActionTypes.UPDATE_STANDUP_REQUEST).toBeDefined();
    expect(StandupActionTypes.UPDATE_STANDUP_SUCCESS).toBeDefined();
    expect(StandupActionTypes.UPDATE_STANDUP_FAILURE).toBeDefined();
    
    expect(StandupActionTypes.DELETE_STANDUP_REQUEST).toBeDefined();
    expect(StandupActionTypes.DELETE_STANDUP_SUCCESS).toBeDefined();
    expect(StandupActionTypes.DELETE_STANDUP_FAILURE).toBeDefined();
    
    expect(StandupActionTypes.TOGGLE_HIGHLIGHT_REQUEST).toBeDefined();
    expect(StandupActionTypes.TOGGLE_HIGHLIGHT_SUCCESS).toBeDefined();
    expect(StandupActionTypes.TOGGLE_HIGHLIGHT_FAILURE).toBeDefined();
    
    expect(StandupActionTypes.CLEAR_STANDUP).toBeDefined();
    expect(StandupActionTypes.RESET_SUCCESS).toBeDefined();
  });

  // Test StandupAction union type
  it('should validate action object structures', () => {
    // Test FETCH_STANDUPS_REQUEST action
    const fetchStandupsRequestAction: StandupAction = {
      type: StandupActionTypes.FETCH_STANDUPS_REQUEST
    };
    expect(fetchStandupsRequestAction.type).toBe(StandupActionTypes.FETCH_STANDUPS_REQUEST);
    
    // Test FETCH_STANDUPS_SUCCESS action
    const standups: Standup[] = [{
      date: '2023-05-01',
      yesterday: 'Worked on APIs',
      today: 'Writing tests',
      blockers: 'None',
      isBlockerResolved: false,
      tags: ['api', 'testing'],
      mood: 4,
      productivity: 5,
      isHighlight: false,
      createdAt: '2023-05-01T12:00:00Z',
      updatedAt: '2023-05-01T12:00:00Z'
    }];
    
    const fetchStandupsSuccessAction: StandupAction = {
      type: StandupActionTypes.FETCH_STANDUPS_SUCCESS,
      payload: standups
    };
    expect(fetchStandupsSuccessAction.type).toBe(StandupActionTypes.FETCH_STANDUPS_SUCCESS);
    expect(fetchStandupsSuccessAction.payload).toEqual(standups);
    
    // Test FETCH_STANDUPS_FAILURE action
    const fetchStandupsFailureAction: StandupAction = {
      type: StandupActionTypes.FETCH_STANDUPS_FAILURE,
      payload: 'Error message'
    };
    expect(fetchStandupsFailureAction.type).toBe(StandupActionTypes.FETCH_STANDUPS_FAILURE);
    expect(typeof fetchStandupsFailureAction.payload).toBe('string');
    
    // Test CLEAR_STANDUP action
    const clearStandupAction: StandupAction = {
      type: StandupActionTypes.CLEAR_STANDUP
    };
    expect(clearStandupAction.type).toBe(StandupActionTypes.CLEAR_STANDUP);
  });
}); 