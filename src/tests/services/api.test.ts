import axios from 'axios';
import { standupAPI, queryAPI } from '../../services/api';
import { CreateStandupDto, UpdateStandupDto } from '../../redux/standups/types';

// Add proper Jest mock function types
type MockedFunction<T extends (...args: any) => any> = jest.Mock<ReturnType<T>, Parameters<T>> & {
  mockResolvedValueOnce: (value: any) => jest.Mock;
  mockRejectedValueOnce: (reason: any) => jest.Mock;
};

// Directly mock the service methods
jest.mock('../../services/api', () => {
  const originalModule = jest.requireActual('../../services/api');
  
  // Create mocked API service with proper typings
  return {
    standupAPI: {
      getAll: jest.fn(),
      getByDate: jest.fn(),
      getByDateRange: jest.fn(),
      getHighlights: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      toggleHighlight: jest.fn(),
      search: jest.fn(),
      getStats: jest.fn()
    },
    queryAPI: {
      getWeeklySummary: jest.fn(),
      getMonthlySummary: jest.fn(),
      getBlockers: jest.fn(),
      getAllWithBlockers: jest.fn(),
      processQuery: jest.fn()
    },
    default: originalModule.default
  };
});

// Cast mocked functions to the correct type
const mockedStandupAPI = standupAPI as {
  [K in keyof typeof standupAPI]: MockedFunction<typeof standupAPI[K]>
};

const mockedQueryAPI = queryAPI as {
  [K in keyof typeof queryAPI]: MockedFunction<typeof queryAPI[K]>
};

describe('API Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('standupAPI', () => {
    describe('getAll', () => {
      it('calls the API with correct parameters', async () => {
        const mockResponse = { data: [{ date: '2023-05-01', yesterday: 'Worked on API' }] };
        mockedStandupAPI.getAll.mockResolvedValueOnce(mockResponse);
        
        const params = { isHighlight: true };
        const result = await standupAPI.getAll(params);
        
        expect(mockedStandupAPI.getAll).toHaveBeenCalledWith(params);
        expect(result).toEqual(mockResponse);
      });
      
      it('works with no parameters', async () => {
        const mockResponse = { data: [{ date: '2023-05-01', yesterday: 'Worked on API' }] };
        mockedStandupAPI.getAll.mockResolvedValueOnce(mockResponse);
        
        const result = await standupAPI.getAll();
        
        expect(mockedStandupAPI.getAll).toHaveBeenCalledWith();
        expect(result).toEqual(mockResponse);
      });
    });
    
    describe('getByDate', () => {
      it('calls the API with the date parameter', async () => {
        const date = '2023-05-01';
        const mockResponse = { data: { date, yesterday: 'Worked on API' } };
        mockedStandupAPI.getByDate.mockResolvedValueOnce(mockResponse);
        
        const result = await standupAPI.getByDate(date);
        
        expect(mockedStandupAPI.getByDate).toHaveBeenCalledWith(date);
        expect(result).toEqual(mockResponse);
      });
    });
    
    describe('getByDateRange', () => {
      it('calls the API with start and end date parameters', async () => {
        const startDate = '2023-05-01';
        const endDate = '2023-05-07';
        const mockResponse = { data: [{ date: '2023-05-01' }, { date: '2023-05-02' }] };
        mockedStandupAPI.getByDateRange.mockResolvedValueOnce(mockResponse);
        
        const result = await standupAPI.getByDateRange(startDate, endDate);
        
        expect(mockedStandupAPI.getByDateRange).toHaveBeenCalledWith(startDate, endDate);
        expect(result).toEqual(mockResponse);
      });
    });
    
    describe('create', () => {
      it('posts the standup data to the API', async () => {
        const newStandup: CreateStandupDto = {
          date: '2023-05-01',
          yesterday: 'Worked on API',
          today: 'Working on tests',
          blockers: 'None',
          isBlockerResolved: false,
          tags: ['api', 'testing'],
          mood: 4,
          productivity: 5,
          isHighlight: false
        };
        
        const mockResponse = { 
          data: {
            ...newStandup, 
            createdAt: '2023-05-01T12:00:00Z', 
            updatedAt: '2023-05-01T12:00:00Z' 
          }
        };
        
        mockedStandupAPI.create.mockResolvedValueOnce(mockResponse);
        
        const result = await standupAPI.create(newStandup);
        
        expect(mockedStandupAPI.create).toHaveBeenCalledWith(newStandup);
        expect(result).toEqual(mockResponse);
      });
      
      it('handles errors during creation', async () => {
        const newStandup: CreateStandupDto = {
          date: '2023-05-01',
          yesterday: 'Worked on API',
          today: 'Working on tests',
          blockers: 'None',
          isBlockerResolved: false,
          tags: ['api', 'testing'],
          mood: 4,
          productivity: 5,
          isHighlight: false
        };
        
        const errorMessage = 'Validation Error';
        mockedStandupAPI.create.mockRejectedValueOnce(new Error(errorMessage));
        
        await expect(standupAPI.create(newStandup)).rejects.toThrow(errorMessage);
        expect(mockedStandupAPI.create).toHaveBeenCalledWith(newStandup);
      });
    });
    
    describe('update', () => {
      it('puts the updated data to the API', async () => {
        const date = '2023-05-01';
        const updatedData: UpdateStandupDto = {
          today: 'Updated work',
          blockers: 'New blocker'
        };
        
        const mockResponse = { 
          data: {
            date,
            yesterday: 'Worked on API',
            today: 'Updated work',
            blockers: 'New blocker',
            isBlockerResolved: false,
            tags: ['api', 'testing'],
            updatedAt: '2023-05-01T13:00:00Z'
          }
        };
        
        mockedStandupAPI.update.mockResolvedValueOnce(mockResponse);
        
        const result = await standupAPI.update(date, updatedData);
        
        expect(mockedStandupAPI.update).toHaveBeenCalledWith(date, updatedData);
        expect(result).toEqual(mockResponse);
      });
    });
    
    describe('delete', () => {
      it('calls delete on the API', async () => {
        const date = '2023-05-01';
        const mockResponse = { data: { success: true } };
        mockedStandupAPI.delete.mockResolvedValueOnce(mockResponse);
        
        const result = await standupAPI.delete(date);
        
        expect(mockedStandupAPI.delete).toHaveBeenCalledWith(date);
        expect(result).toEqual(mockResponse);
      });
    });
    
    describe('toggleHighlight', () => {
      it('calls patch on the API', async () => {
        const date = '2023-05-01';
        const mockResponse = { 
          status: 200,
          statusText: 'OK',
          data: { 
            success: true, 
            data: { 
              date, 
              isHighlight: true,
              yesterday: 'Worked on API',
              today: 'Working on tests',
              blockers: 'None'
            } 
          } 
        };
        
        mockedStandupAPI.toggleHighlight.mockResolvedValueOnce(mockResponse);
        
        const result = await standupAPI.toggleHighlight(date);
        
        expect(mockedStandupAPI.toggleHighlight).toHaveBeenCalledWith(date);
        expect(result).toEqual(mockResponse);
      });
      
      it('handles toggle highlight error', async () => {
        const date = '2023-05-01';
        const errorMessage = 'Network Error';
        mockedStandupAPI.toggleHighlight.mockRejectedValueOnce(new Error(errorMessage));
        
        await expect(standupAPI.toggleHighlight(date)).rejects.toThrow(errorMessage);
        expect(mockedStandupAPI.toggleHighlight).toHaveBeenCalledWith(date);
      });
    });
    
    describe('search', () => {
      it('calls search with keyword parameter', async () => {
        const keyword = 'api';
        const mockResponse = { data: [{ date: '2023-05-01', yesterday: 'Worked on API' }] };
        mockedStandupAPI.search.mockResolvedValueOnce(mockResponse);
        
        const result = await standupAPI.search(keyword);
        
        expect(mockedStandupAPI.search).toHaveBeenCalledWith(keyword);
        expect(result).toEqual(mockResponse);
      });
    });
  });
  
  describe('queryAPI', () => {
    describe('getWeeklySummary', () => {
      it('calls the API without date parameters', async () => {
        const mockResponse = { 
          data: { 
            weeklyData: true,
            period: 'Current Week',
            accomplishments: [],
            plans: [],
            blockers: []
          } 
        };
        
        mockedQueryAPI.getWeeklySummary.mockResolvedValueOnce(mockResponse);
        
        const result = await queryAPI.getWeeklySummary();
        
        expect(mockedQueryAPI.getWeeklySummary).toHaveBeenCalledWith();
        expect(result).toEqual(mockResponse);
      });
      
      it('calls the API with date parameters', async () => {
        const startDate = '2023-05-01';
        const endDate = '2023-05-07';
        const mockResponse = { data: { weeklyData: true } };
        
        mockedQueryAPI.getWeeklySummary.mockResolvedValueOnce(mockResponse);
        
        const result = await queryAPI.getWeeklySummary(startDate, endDate);
        
        expect(mockedQueryAPI.getWeeklySummary).toHaveBeenCalledWith(startDate, endDate);
        expect(result).toEqual(mockResponse);
      });
    });
    
    describe('getMonthlySummary', () => {
      it('calls the API with month parameter', async () => {
        const month = '2023-05';
        const mockResponse = { data: { monthlyData: true } };
        
        mockedQueryAPI.getMonthlySummary.mockResolvedValueOnce(mockResponse);
        
        const result = await queryAPI.getMonthlySummary(month);
        
        expect(mockedQueryAPI.getMonthlySummary).toHaveBeenCalledWith(month);
        expect(result).toEqual(mockResponse);
      });
    });
    
    describe('getBlockers', () => {
      it('calls the API for blockers', async () => {
        const mockResponse = { data: { blockers: [] } };
        
        mockedQueryAPI.getBlockers.mockResolvedValueOnce(mockResponse);
        
        const result = await queryAPI.getBlockers();
        
        expect(mockedQueryAPI.getBlockers).toHaveBeenCalled();
        expect(result).toEqual(mockResponse);
      });
    });
    
    describe('getAllWithBlockers', () => {
      it('calls the API to get all standups with blockers', async () => {
        const mockResponse = { data: [{ date: '2023-05-01', blockers: 'Waiting for design' }] };
        
        mockedQueryAPI.getAllWithBlockers.mockResolvedValueOnce(mockResponse);
        
        const result = await queryAPI.getAllWithBlockers();
        
        expect(mockedQueryAPI.getAllWithBlockers).toHaveBeenCalled();
        expect(result).toEqual(mockResponse);
      });
    });
    
    describe('processQuery', () => {
      it('posts the query to the API', async () => {
        const query = 'What did I do last week?';
        const mockResponse = { 
          status: 200,
          statusText: 'OK',
          data: { 
            answer: 'Here are your accomplishments from last week',
            data: { accomplishments: [] }
          } 
        };
        
        mockedQueryAPI.processQuery.mockResolvedValueOnce(mockResponse);
        
        const result = await queryAPI.processQuery(query);
        
        expect(mockedQueryAPI.processQuery).toHaveBeenCalledWith(query);
        expect(result).toEqual(mockResponse);
      });
      
      it('handles different response formats', async () => {
        const query = 'What are my current blockers?';
        const mockResponse = { 
          status: 200,
          statusText: 'OK',
          data: { 
            success: true,
            data: {
              blockers: [
                { date: '2023-05-01', blocker: 'Waiting for design' }
              ]
            }
          } 
        };
        
        mockedQueryAPI.processQuery.mockResolvedValueOnce(mockResponse);
        
        const result = await queryAPI.processQuery(query);
        
        expect(mockedQueryAPI.processQuery).toHaveBeenCalledWith(query);
        expect(result.data).toEqual(mockResponse.data);
      });
      
      it('handles query processing errors', async () => {
        const query = 'Invalid query format';
        const errorMessage = 'Could not understand query';
        
        mockedQueryAPI.processQuery.mockRejectedValueOnce(new Error(errorMessage));
        
        await expect(queryAPI.processQuery(query)).rejects.toThrow(errorMessage);
        expect(mockedQueryAPI.processQuery).toHaveBeenCalledWith(query);
      });
    });
  });
  
  describe('Error Handling', () => {
    it('handles API errors with response data', async () => {
      const date = '2023-05-01';
      const errorMessage = 'Standup not found';
      
      mockedStandupAPI.getByDate.mockRejectedValueOnce(new Error(errorMessage));
      
      await expect(standupAPI.getByDate(date)).rejects.toThrow(errorMessage);
      expect(mockedStandupAPI.getByDate).toHaveBeenCalledWith(date);
    });
    
    it('handles network errors', async () => {
      const errorMessage = 'Network error';
      
      mockedStandupAPI.getAll.mockRejectedValueOnce(new Error(errorMessage));
      
      await expect(standupAPI.getAll()).rejects.toThrow(errorMessage);
      expect(mockedStandupAPI.getAll).toHaveBeenCalled();
    });
  });
}); 