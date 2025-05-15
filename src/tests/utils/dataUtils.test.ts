import {
  extractApiData,
  groupStandupsByTag,
  calculateStandupStats,
  extractUniqueTags,
  countTagFrequency,
  filterStandupsByTag,
  searchStandups,
  isValidStandup
} from '../../utils/dataUtils';
import { Standup } from '../../redux/standups/types';

describe('Data Utility Functions', () => {
  describe('extractApiData', () => {
    it('extracts data from { data: { data: [...] } } format', () => {
      const response = {
        data: {
          data: [{ id: 1 }, { id: 2 }]
        }
      };
      expect(extractApiData(response)).toEqual([{ id: 1 }, { id: 2 }]);
    });

    it('extracts data from { data: [...] } format', () => {
      const response = {
        data: [{ id: 1 }, { id: 2 }]
      };
      expect(extractApiData(response)).toEqual([{ id: 1 }, { id: 2 }]);
    });

    it('extracts data from { data: { success: true, data: {...} } } format', () => {
      const response = {
        data: {
          success: true,
          data: { id: 1, name: 'Test' }
        }
      };
      expect(extractApiData(response)).toEqual({ id: 1, name: 'Test' });
    });

    it('handles direct responses with no data property', () => {
      const response = [{ id: 1 }, { id: 2 }];
      expect(extractApiData(response)).toEqual([{ id: 1 }, { id: 2 }]);
    });

    it('handles null or undefined responses', () => {
      expect(extractApiData(null)).toBeNull();
      expect(extractApiData(undefined)).toBeNull();
    });
  });

  // Test data for standup-related functions
  const testStandups: Standup[] = [
    {
      date: '2023-05-01',
      yesterday: 'Worked on API',
      today: 'Testing',
      blockers: 'None',
      isBlockerResolved: false,
      tags: ['api', 'backend'],
      mood: 4,
      productivity: 5,
      isHighlight: false,
      createdAt: '2023-05-01T12:00:00Z',
      updatedAt: '2023-05-01T12:00:00Z'
    },
    {
      date: '2023-05-02',
      yesterday: 'Testing',
      today: 'Documentation',
      blockers: 'Waiting for API spec',
      isBlockerResolved: false,
      tags: ['documentation', 'testing'],
      mood: 3,
      productivity: 4,
      isHighlight: true,
      createdAt: '2023-05-02T12:00:00Z',
      updatedAt: '2023-05-02T12:00:00Z'
    },
    {
      date: '2023-05-03',
      yesterday: 'Documentation',
      today: 'Testing API',
      blockers: '',
      isBlockerResolved: true,
      tags: ['api', 'testing'],
      mood: 5,
      productivity: 5,
      isHighlight: false,
      createdAt: '2023-05-03T12:00:00Z',
      updatedAt: '2023-05-03T12:00:00Z'
    }
  ];

  describe('groupStandupsByTag', () => {
    it('groups standups by their tags', () => {
      const result = groupStandupsByTag(testStandups);
      
      expect(Object.keys(result).sort()).toEqual(['api', 'backend', 'documentation', 'testing'].sort());
      expect(result.api.length).toBe(2);
      expect(result.testing.length).toBe(2);
      expect(result.documentation.length).toBe(1);
      expect(result.backend.length).toBe(1);
    });

    it('returns an empty object for empty input', () => {
      expect(groupStandupsByTag([])).toEqual({});
    });

    it('handles standups with no tags', () => {
      const noTagsStandups: Standup[] = [
        {
          date: '2023-05-01',
          yesterday: 'Work',
          today: 'More work',
          blockers: '',
          isBlockerResolved: false,
          tags: [],
          mood: 3,
          productivity: 3,
          isHighlight: false,
          createdAt: '2023-05-01T12:00:00Z',
          updatedAt: '2023-05-01T12:00:00Z'
        }
      ];
      expect(groupStandupsByTag(noTagsStandups)).toEqual({});
    });
  });

  describe('calculateStandupStats', () => {
    it('calculates correct statistics for mood and productivity', () => {
      const result = calculateStandupStats(testStandups);
      
      expect(result.mood.average).toBeCloseTo(4);
      expect(result.mood.min).toBe(3);
      expect(result.mood.max).toBe(5);
      
      expect(result.productivity.average).toBeCloseTo(4.67, 1);
      expect(result.productivity.min).toBe(4);
      expect(result.productivity.max).toBe(5);
    });

    it('returns zeros for empty input', () => {
      const result = calculateStandupStats([]);
      
      expect(result).toEqual({
        mood: { average: 0, min: 0, max: 0 },
        productivity: { average: 0, min: 0, max: 0 }
      });
    });

    it('handles missing or undefined mood/productivity values', () => {
      const incompleteStandups: Standup[] = [
        {
          date: '2023-05-01',
          yesterday: 'Work',
          today: 'More work',
          blockers: '',
          isBlockerResolved: false,
          tags: [],
          mood: undefined as any,
          productivity: 3,
          isHighlight: false,
          createdAt: '2023-05-01T12:00:00Z',
          updatedAt: '2023-05-01T12:00:00Z'
        },
        {
          date: '2023-05-02',
          yesterday: 'Work',
          today: 'More work',
          blockers: '',
          isBlockerResolved: false,
          tags: [],
          mood: 4,
          productivity: null as any,
          isHighlight: false,
          createdAt: '2023-05-02T12:00:00Z',
          updatedAt: '2023-05-02T12:00:00Z'
        }
      ];
      
      const result = calculateStandupStats(incompleteStandups);
      
      expect(result.mood.average).toBe(4); // Only one valid value
      expect(result.productivity.average).toBe(3); // Only one valid value
    });
  });

  describe('extractUniqueTags', () => {
    it('returns all unique tags sorted alphabetically', () => {
      const result = extractUniqueTags(testStandups);
      expect(result).toEqual(['api', 'backend', 'documentation', 'testing']);
    });

    it('returns an empty array for empty input', () => {
      expect(extractUniqueTags([])).toEqual([]);
    });

    it('handles standups with no tags', () => {
      const noTagsStandups: Standup[] = [
        {
          date: '2023-05-01',
          yesterday: 'Work',
          today: 'More work',
          blockers: '',
          isBlockerResolved: false,
          tags: [],
          mood: 3,
          productivity: 3,
          isHighlight: false,
          createdAt: '2023-05-01T12:00:00Z',
          updatedAt: '2023-05-01T12:00:00Z'
        }
      ];
      expect(extractUniqueTags(noTagsStandups)).toEqual([]);
    });
  });

  describe('countTagFrequency', () => {
    it('counts the frequency of each tag', () => {
      const result = countTagFrequency(testStandups);
      
      expect(result).toEqual({
        'api': 2,
        'backend': 1,
        'documentation': 1,
        'testing': 2
      });
    });

    it('returns an empty object for empty input', () => {
      expect(countTagFrequency([])).toEqual({});
    });
  });

  describe('filterStandupsByTag', () => {
    it('filters standups containing the specified tag', () => {
      const result = filterStandupsByTag(testStandups, 'api');
      
      expect(result.length).toBe(2);
      expect(result[0].date).toBe('2023-05-01');
      expect(result[1].date).toBe('2023-05-03');
    });

    it('returns an empty array if no standups match the tag', () => {
      expect(filterStandupsByTag(testStandups, 'nonexistent')).toEqual([]);
    });
  });

  describe('searchStandups', () => {
    it('searches standups by keyword in yesterday field', () => {
      const result = searchStandups(testStandups, 'API');
      
      expect(result.length).toBeGreaterThanOrEqual(2);
      expect(result.find(s => s.date === '2023-05-01')).toBeTruthy();
      expect(result.find(s => s.date === '2023-05-03')).toBeTruthy();
    });

    it('searches standups by keyword in today field', () => {
      const result = searchStandups(testStandups, 'documentation');
      
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result.find(s => s.date === '2023-05-02')).toBeTruthy();
    });

    it('searches standups by keyword in blockers field', () => {
      const result = searchStandups(testStandups, 'waiting');
      
      expect(result.length).toBe(1);
      expect(result[0].date).toBe('2023-05-02');
    });

    it('searches standups by keyword in tags', () => {
      const result = searchStandups(testStandups, 'backend');
      
      expect(result.length).toBe(1);
      expect(result[0].date).toBe('2023-05-01');
    });

    it('returns all standups if keyword is empty', () => {
      expect(searchStandups(testStandups, '')).toEqual(testStandups);
    });

    it('returns empty array if no matches found', () => {
      expect(searchStandups(testStandups, 'nonexistent')).toEqual([]);
    });
  });

  describe('isValidStandup', () => {
    it('returns true for a valid standup with all required fields', () => {
      const validStandup = {
        date: '2023-05-01',
        yesterday: 'Worked on API',
        today: 'Testing',
        blockers: 'None'
      };
      
      expect(isValidStandup(validStandup)).toBe(true);
    });

    it('returns false for a standup missing date', () => {
      const invalidStandup = {
        yesterday: 'Worked on API',
        today: 'Testing',
        blockers: 'None'
      };
      
      expect(isValidStandup(invalidStandup)).toBe(false);
    });

    it('returns false for a standup missing yesterday', () => {
      const invalidStandup = {
        date: '2023-05-01',
        today: 'Testing',
        blockers: 'None'
      };
      
      expect(isValidStandup(invalidStandup)).toBe(false);
    });

    it('returns false for a standup missing today', () => {
      const invalidStandup = {
        date: '2023-05-01',
        yesterday: 'Worked on API',
        blockers: 'None'
      };
      
      expect(isValidStandup(invalidStandup)).toBe(false);
    });

    it('returns true even if optional fields are missing', () => {
      const validStandup = {
        date: '2023-05-01',
        yesterday: 'Worked on API',
        today: 'Testing'
      };
      
      expect(isValidStandup(validStandup)).toBe(true);
    });

    it('returns false for null or undefined input', () => {
      expect(isValidStandup(null as any)).toBe(false);
      expect(isValidStandup(undefined as any)).toBe(false);
    });
  });
}); 