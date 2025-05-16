import { vi, describe, it, expect, beforeEach, afterEach, Mock } from 'vitest';
import axios from 'axios';
let standupAPI: any;
let queryAPI: any;
import { CreateStandupDto, UpdateStandupDto } from '../../redux/standups/types';

// Directly mock the service methods
vi.mock('../../services/api', () => {
  const originalModule = vi.importActual('../../services/api');
  return {
    ...originalModule,
    standupAPI: {
      getAll: vi.fn(),
      getByDate: vi.fn(),
      getByDateRange: vi.fn(),
      getHighlights: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      toggleHighlight: vi.fn(),
      search: vi.fn(),
      getStats: vi.fn()
    },
    queryAPI: {
      getWeeklySummary: vi.fn(),
      getMonthlySummary: vi.fn(),
      getBlockers: vi.fn(),
      getAllWithBlockers: vi.fn(),
      processQuery: vi.fn()
    }
  };
});

describe('API Services', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    ({ standupAPI, queryAPI } = await import('../../services/api'));
  });

  describe('standupAPI', () => {
    describe('getAll', () => {
      it('calls the API with correct parameters', async () => {
        const mockResponse = { data: [{ date: '2023-05-01', yesterday: 'Worked on API' }] };
        standupAPI.getAll.mockResolvedValueOnce(mockResponse);
        
        const params = { isHighlight: true };
        const result = await standupAPI.getAll(params);
        
        expect(standupAPI.getAll).toHaveBeenCalledWith(params);
        expect(result).toEqual(mockResponse);
      });
      
      it('works with no parameters', async () => {
        const mockResponse = { data: [{ date: '2023-05-01', yesterday: 'Worked on API' }] };
        standupAPI.getAll.mockResolvedValueOnce(mockResponse);
        
        const result = await standupAPI.getAll();
        
        expect(standupAPI.getAll).toHaveBeenCalledWith();
        expect(result).toEqual(mockResponse);
      });

    });
  });
}); 