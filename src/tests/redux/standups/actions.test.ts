import { StandupActionTypes } from '../../../redux/standups/types';
import * as actions from '../../../redux/standups/actions';
import { standupAPI } from '../../../services/api';

// Mock the api service
jest.mock('../../../services/api', () => ({
  standupAPI: {
    getAll: jest.fn(),
    getByDate: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    toggleHighlight: jest.fn()
  }
}));

describe('Standup Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  // Simple action creators
  describe('Simple action creators', () => {
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
  
  // Fetch standups actions
  describe('fetchStandups', () => {
    it('should create FETCH_STANDUPS_SUCCESS when fetching standups has been successful', async () => {
      const standups = [
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
      
      // Mock API response
      (standupAPI.getAll as jest.Mock).mockResolvedValue({ data: standups });
      
      // Create mock dispatch function
      const dispatch = jest.fn();
      
      // Call the action creator
      await actions.fetchStandups()(dispatch, () => ({}), undefined);
      
      // Check dispatch was called correctly
      expect(dispatch).toHaveBeenCalledWith({ type: StandupActionTypes.FETCH_STANDUPS_REQUEST });
      expect(dispatch).toHaveBeenCalledWith({ 
        type: StandupActionTypes.FETCH_STANDUPS_SUCCESS,
        payload: standups
      });
      expect(standupAPI.getAll).toHaveBeenCalled();
    });
    
    it('should create FETCH_STANDUPS_FAILURE when fetching standups fails', async () => {
      const errorMessage = 'Network Error';
      
      // Mock API error
      (standupAPI.getAll as jest.Mock).mockRejectedValue(new Error(errorMessage));
      
      // Create mock dispatch function
      const dispatch = jest.fn();
      
      // Call the action creator
      await actions.fetchStandups()(dispatch, () => ({}), undefined);
      
      // Check dispatch was called correctly
      expect(dispatch).toHaveBeenCalledWith({ type: StandupActionTypes.FETCH_STANDUPS_REQUEST });
      expect(dispatch).toHaveBeenCalledWith({ 
        type: StandupActionTypes.FETCH_STANDUPS_FAILURE,
        payload: errorMessage
      });
    });
    
    it('should pass parameters to the API call', async () => {
      const params = { isHighlight: true };
      
      // Mock API response
      (standupAPI.getAll as jest.Mock).mockResolvedValue({ data: [] });
      
      // Create mock dispatch function
      const dispatch = jest.fn();
      
      // Call the action creator
      await actions.fetchStandups(params)(dispatch, () => ({}), undefined);
      
      // Check API was called with params
      expect(standupAPI.getAll).toHaveBeenCalledWith(params);
    });
  });
  
  // Fetch standup actions
  describe('fetchStandup', () => {
    it('should create FETCH_STANDUP_SUCCESS when fetching a standup has been successful', async () => {
      const date = '2023-05-01';
      const standup = {
        date,
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
      };
      
      // Mock API response
      (standupAPI.getByDate as jest.Mock).mockResolvedValue({ data: standup });
      
      // Create mock dispatch function
      const dispatch = jest.fn();
      
      // Call the action creator
      await actions.fetchStandup(date)(dispatch, () => ({}), undefined);
      
      // Check dispatch was called correctly
      expect(dispatch).toHaveBeenCalledWith({ type: StandupActionTypes.FETCH_STANDUP_REQUEST });
      expect(dispatch).toHaveBeenCalledWith({ 
        type: StandupActionTypes.FETCH_STANDUP_SUCCESS,
        payload: standup
      });
      expect(standupAPI.getByDate).toHaveBeenCalledWith(date);
    });
    
    it('should create FETCH_STANDUP_FAILURE when fetching a standup fails', async () => {
      const date = '2023-05-01';
      const errorMessage = 'Not Found';
      
      // Mock API error
      (standupAPI.getByDate as jest.Mock).mockRejectedValue(new Error(errorMessage));
      
      // Create mock dispatch function
      const dispatch = jest.fn();
      
      // Call the action creator
      await actions.fetchStandup(date)(dispatch, () => ({}), undefined);
      
      // Check dispatch was called correctly
      expect(dispatch).toHaveBeenCalledWith({ type: StandupActionTypes.FETCH_STANDUP_REQUEST });
      expect(dispatch).toHaveBeenCalledWith({ 
        type: StandupActionTypes.FETCH_STANDUP_FAILURE,
        payload: errorMessage
      });
    });
  });
  
  // Create standup actions
  describe('createStandup', () => {
    it('should create CREATE_STANDUP_SUCCESS when creating a standup has been successful', async () => {
      const newStandup = {
        date: '2023-05-01',
        yesterday: 'Worked on API endpoints',
        today: 'Working on tests',
        blockers: 'None',
        isBlockerResolved: false,
        tags: ['api', 'testing'],
        mood: 4,
        productivity: 5,
        isHighlight: false
      };
      
      const createdStandup = {
        ...newStandup,
        createdAt: '2023-05-01T12:00:00Z',
        updatedAt: '2023-05-01T12:00:00Z'
      };
      
      // Mock API response
      (standupAPI.create as jest.Mock).mockResolvedValue({ data: createdStandup });
      
      // Create mock dispatch function
      const dispatch = jest.fn();
      
      // Call the action creator
      await actions.createStandup(newStandup)(dispatch, () => ({}), undefined);
      
      // Check dispatch was called correctly
      expect(dispatch).toHaveBeenCalledWith({ type: StandupActionTypes.CREATE_STANDUP_REQUEST });
      expect(dispatch).toHaveBeenCalledWith({ 
        type: StandupActionTypes.CREATE_STANDUP_SUCCESS,
        payload: createdStandup
      });
      expect(standupAPI.create).toHaveBeenCalledWith(newStandup);
    });
    
    it('should create CREATE_STANDUP_FAILURE when creating a standup fails', async () => {
      const newStandup = {
        date: '2023-05-01',
        yesterday: 'Worked on API endpoints',
        today: 'Working on tests',
        blockers: 'None',
        isBlockerResolved: false,
        tags: ['api', 'testing'],
        mood: 4,
        productivity: 5,
        isHighlight: false
      };
      
      const errorMessage = 'Validation Error';
      
      // Mock API error
      (standupAPI.create as jest.Mock).mockRejectedValue(new Error(errorMessage));
      
      // Create mock dispatch function
      const dispatch = jest.fn();
      
      // Call the action creator
      await actions.createStandup(newStandup)(dispatch, () => ({}), undefined);
      
      // Check dispatch was called correctly
      expect(dispatch).toHaveBeenCalledWith({ type: StandupActionTypes.CREATE_STANDUP_REQUEST });
      expect(dispatch).toHaveBeenCalledWith({ 
        type: StandupActionTypes.CREATE_STANDUP_FAILURE,
        payload: errorMessage
      });
    });
  });
  
  // Update standup actions
  describe('updateStandup', () => {
    it('should create UPDATE_STANDUP_SUCCESS when updating a standup has been successful', async () => {
      const date = '2023-05-01';
      const updatedData = {
        today: 'Updated work',
        blockers: 'New blocker',
        tags: ['api', 'testing', 'update']
      };
      
      const updatedStandup = {
        date,
        yesterday: 'Worked on API endpoints',
        today: 'Updated work',
        blockers: 'New blocker',
        isBlockerResolved: false,
        tags: ['api', 'testing', 'update'],
        mood: 4,
        productivity: 5,
        isHighlight: false,
        createdAt: '2023-05-01T12:00:00Z',
        updatedAt: '2023-05-01T13:00:00Z'
      };
      
      // Mock API response
      (standupAPI.update as jest.Mock).mockResolvedValue({ data: updatedStandup });
      
      // Create mock dispatch function
      const dispatch = jest.fn();
      
      // Call the action creator
      await actions.updateStandup(date, updatedData)(dispatch, () => ({}), undefined);
      
      // Check dispatch was called correctly
      expect(dispatch).toHaveBeenCalledWith({ type: StandupActionTypes.UPDATE_STANDUP_REQUEST });
      expect(dispatch).toHaveBeenCalledWith({ 
        type: StandupActionTypes.UPDATE_STANDUP_SUCCESS,
        payload: updatedStandup
      });
      expect(standupAPI.update).toHaveBeenCalledWith(date, updatedData);
    });
    
    it('should create UPDATE_STANDUP_FAILURE when updating a standup fails', async () => {
      const date = '2023-05-01';
      const updatedData = {
        today: 'Updated work',
        blockers: 'New blocker'
      };
      
      const errorMessage = 'Not Found';
      
      // Mock API error
      (standupAPI.update as jest.Mock).mockRejectedValue(new Error(errorMessage));
      
      // Create mock dispatch function
      const dispatch = jest.fn();
      
      // Call the action creator
      await actions.updateStandup(date, updatedData)(dispatch, () => ({}), undefined);
      
      // Check dispatch was called correctly
      expect(dispatch).toHaveBeenCalledWith({ type: StandupActionTypes.UPDATE_STANDUP_REQUEST });
      expect(dispatch).toHaveBeenCalledWith({ 
        type: StandupActionTypes.UPDATE_STANDUP_FAILURE,
        payload: errorMessage
      });
    });
  });
  
  // Delete standup actions
  describe('deleteStandup', () => {
    it('should create DELETE_STANDUP_SUCCESS when deleting a standup has been successful', async () => {
      const date = '2023-05-01';
      
      // Mock API response
      (standupAPI.delete as jest.Mock).mockResolvedValue({});
      
      // Create mock dispatch function
      const dispatch = jest.fn();
      
      // Call the action creator
      await actions.deleteStandup(date)(dispatch, () => ({}), undefined);
      
      // Check dispatch was called correctly
      expect(dispatch).toHaveBeenCalledWith({ type: StandupActionTypes.DELETE_STANDUP_REQUEST });
      expect(dispatch).toHaveBeenCalledWith({ 
        type: StandupActionTypes.DELETE_STANDUP_SUCCESS,
        payload: date
      });
      expect(standupAPI.delete).toHaveBeenCalledWith(date);
    });
    
    it('should create DELETE_STANDUP_FAILURE when deleting a standup fails', async () => {
      const date = '2023-05-01';
      const errorMessage = 'Not Found';
      
      // Mock API error
      (standupAPI.delete as jest.Mock).mockRejectedValue(new Error(errorMessage));
      
      // Create mock dispatch function
      const dispatch = jest.fn();
      
      // Call the action creator
      await actions.deleteStandup(date)(dispatch, () => ({}), undefined);
      
      // Check dispatch was called correctly
      expect(dispatch).toHaveBeenCalledWith({ type: StandupActionTypes.DELETE_STANDUP_REQUEST });
      expect(dispatch).toHaveBeenCalledWith({ 
        type: StandupActionTypes.DELETE_STANDUP_FAILURE,
        payload: errorMessage
      });
    });
  });
  
  // Toggle highlight actions
  describe('toggleHighlight', () => {
    it('should create TOGGLE_HIGHLIGHT_SUCCESS when toggling highlight has been successful with nested data', async () => {
      const date = '2023-05-01';
      const standup = {
        date,
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
      
      // Mock API response with nested data format
      (standupAPI.toggleHighlight as jest.Mock).mockResolvedValue({
        status: 200,
        data: {
          success: true,
          data: standup
        }
      });
      
      // Create mock functions for dispatch and getState
      const dispatch = jest.fn();
      const getState = jest.fn().mockReturnValue({
        standups: {
          standups: [
            {
              date,
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
          ],
          currentStandup: null
        }
      });
      
      // Call the action creator
      await actions.toggleHighlight(date)(dispatch, getState, undefined);
      
      // Check dispatch was called correctly
      expect(dispatch).toHaveBeenCalledWith({ type: StandupActionTypes.TOGGLE_HIGHLIGHT_REQUEST });
      
      // Check for success action with the standup data
      const successCall = dispatch.mock.calls.find(
        call => call[0].type === StandupActionTypes.TOGGLE_HIGHLIGHT_SUCCESS
      );
      expect(successCall).toBeTruthy();
      expect(successCall[0].payload).toEqual(standup);
      
      // Check that API was called with the date
      expect(standupAPI.toggleHighlight).toHaveBeenCalledWith(date);
    });
    
    it('should create TOGGLE_HIGHLIGHT_SUCCESS when toggling highlight has been successful with direct data', async () => {
      const date = '2023-05-01';
      const standup = {
        date,
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
      
      // Mock API response with direct data format
      (standupAPI.toggleHighlight as jest.Mock).mockResolvedValue({
        status: 200,
        data: standup
      });
      
      // Create mock functions for dispatch and getState
      const dispatch = jest.fn();
      const getState = jest.fn().mockReturnValue({
        standups: {
          standups: [
            {
              date,
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
          ],
          currentStandup: null
        }
      });
      
      // Call the action creator
      await actions.toggleHighlight(date)(dispatch, getState, undefined);
      
      // Check dispatch was called correctly
      expect(dispatch).toHaveBeenCalledWith({ type: StandupActionTypes.TOGGLE_HIGHLIGHT_REQUEST });
      
      // Check for success action with the standup data
      const successCall = dispatch.mock.calls.find(
        call => call[0].type === StandupActionTypes.TOGGLE_HIGHLIGHT_SUCCESS
      );
      expect(successCall).toBeTruthy();
      expect(successCall[0].payload).toEqual(standup);
      
      // Check that API was called with the date
      expect(standupAPI.toggleHighlight).toHaveBeenCalledWith(date);
    });
    
    it('should create TOGGLE_HIGHLIGHT_FAILURE when toggling highlight fails', async () => {
      const date = '2023-05-01';
      const errorMessage = 'Network Error';
      
      // Mock API error
      (standupAPI.toggleHighlight as jest.Mock).mockRejectedValue(new Error(errorMessage));
      
      // Create mock functions for dispatch and getState
      const dispatch = jest.fn();
      const getState = jest.fn().mockReturnValue({
        standups: {
          standups: [],
          currentStandup: null
        }
      });
      
      // Call the action creator
      await actions.toggleHighlight(date)(dispatch, getState, undefined);
      
      // Check dispatch was called correctly
      expect(dispatch).toHaveBeenCalledWith({ type: StandupActionTypes.TOGGLE_HIGHLIGHT_REQUEST });
      
      // Check for failure action with the error message
      const failureCall = dispatch.mock.calls.find(
        call => call[0].type === StandupActionTypes.TOGGLE_HIGHLIGHT_FAILURE
      );
      expect(failureCall).toBeTruthy();
      expect(failureCall[0].payload).toEqual(errorMessage);
    });
    
    it('should refresh current standup if it matches the toggled date', async () => {
      const date = '2023-05-01';
      const standup = {
        date,
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
      
      // Mock API responses
      (standupAPI.toggleHighlight as jest.Mock).mockResolvedValue({
        status: 200,
        data: {
          success: true,
          data: standup
        }
      });
      (standupAPI.getByDate as jest.Mock).mockResolvedValue({ data: standup });
      (standupAPI.getAll as jest.Mock).mockResolvedValue({ data: [standup] });
      
      // Create mock functions for dispatch and getState
      const dispatch = jest.fn();
      const getState = jest.fn().mockReturnValue({
        standups: {
          standups: [standup],
          currentStandup: {
            ...standup,
            isHighlight: false
          }
        }
      });
      
      // Call the action creator
      await actions.toggleHighlight(date)(dispatch, getState, undefined);
      
      // Check for fetchStandup call after success
      const fetchStandupCall = dispatch.mock.calls.find(
        call => typeof call[0] === 'function' && call[0].toString().includes('FETCH_STANDUP')
      );
      
      expect(fetchStandupCall).toBeTruthy();
      
      // Check for fetchStandups call to refresh list
      const fetchStandupsCall = dispatch.mock.calls.find(
        call => typeof call[0] === 'function' && call[0].toString().includes('FETCH_STANDUPS')
      );
      
      expect(fetchStandupsCall).toBeTruthy();
    });
    
    it('should handle invalid response format', async () => {
      const date = '2023-05-01';
      
      // Mock API response with invalid format
      (standupAPI.toggleHighlight as jest.Mock).mockResolvedValue({
        status: 200,
        data: null // Invalid data
      });
      
      // Create mock functions for dispatch and getState
      const dispatch = jest.fn();
      const getState = jest.fn().mockReturnValue({
        standups: {
          standups: [],
          currentStandup: null
        }
      });
      
      // Call the action creator
      await actions.toggleHighlight(date)(dispatch, getState, undefined);
      
      // Check for failure action with error message about invalid response
      const failureCall = dispatch.mock.calls.find(
        call => call[0].type === StandupActionTypes.TOGGLE_HIGHLIGHT_FAILURE
      );
      expect(failureCall).toBeTruthy();
      expect(failureCall[0].payload).toContain('Invalid');
    });
  });
}); 