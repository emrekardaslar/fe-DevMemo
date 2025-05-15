/**
 * Utility functions for data transformation in the StandupSync application
 */
import { Standup } from '../redux/standups/types';

/**
 * Extracts nested data from an API response
 * Handles different response formats:
 * - { data: { data: [...] } }
 * - { data: [...] }
 * - { data: { success: true, data: {...} } }
 * @param response API response object
 * @returns Extracted data
 */
export const extractApiData = <T>(response: any): T => {
  if (!response) return null as unknown as T;
  
  // Handle direct response
  if (!response.data) return response as T;
  
  // Handle { data: [...] } format
  if (!response.data.data && !response.data.success) {
    return response.data as T;
  }
  
  // Handle { data: { data: [...] } } format
  if (response.data.data) {
    return response.data.data as T;
  }
  
  // Handle { data: { success: true, data: {...} } } format
  if (response.data.success && response.data.data) {
    return response.data.data as T;
  }
  
  return response.data as T;
};

/**
 * Groups standups by tag
 * @param standups List of standups
 * @returns Object with tags as keys and arrays of standups as values
 */
export const groupStandupsByTag = (standups: Standup[]): Record<string, Standup[]> => {
  const result: Record<string, Standup[]> = {};
  
  standups.forEach(standup => {
    if (standup.tags && standup.tags.length > 0) {
      standup.tags.forEach(tag => {
        if (!result[tag]) {
          result[tag] = [];
        }
        result[tag].push(standup);
      });
    }
  });
  
  return result;
};

/**
 * Calculates statistics for mood and productivity from standups
 * @param standups List of standups
 * @returns Object with mood and productivity statistics
 */
export const calculateStandupStats = (standups: Standup[]): {
  mood: { average: number; min: number; max: number };
  productivity: { average: number; min: number; max: number };
} => {
  if (!standups || standups.length === 0) {
    return {
      mood: { average: 0, min: 0, max: 0 },
      productivity: { average: 0, min: 0, max: 0 }
    };
  }
  
  const moodValues = standups.map(s => s.mood).filter(v => v !== undefined && v !== null) as number[];
  const productivityValues = standups.map(s => s.productivity).filter(v => v !== undefined && v !== null) as number[];
  
  return {
    mood: {
      average: moodValues.length > 0 ? moodValues.reduce((a, b) => a + b, 0) / moodValues.length : 0,
      min: moodValues.length > 0 ? Math.min(...moodValues) : 0,
      max: moodValues.length > 0 ? Math.max(...moodValues) : 0
    },
    productivity: {
      average: productivityValues.length > 0 ? productivityValues.reduce((a, b) => a + b, 0) / productivityValues.length : 0,
      min: productivityValues.length > 0 ? Math.min(...productivityValues) : 0,
      max: productivityValues.length > 0 ? Math.max(...productivityValues) : 0
    }
  };
};

/**
 * Extracts unique tags from a list of standups
 * @param standups List of standups
 * @returns Array of unique tags
 */
export const extractUniqueTags = (standups: Standup[]): string[] => {
  const tagSet = new Set<string>();
  
  standups.forEach(standup => {
    if (standup.tags && standup.tags.length > 0) {
      standup.tags.forEach(tag => {
        tagSet.add(tag);
      });
    }
  });
  
  return Array.from(tagSet).sort();
};

/**
 * Counts the frequency of each tag in a list of standups
 * @param standups List of standups
 * @returns Object with tags as keys and counts as values
 */
export const countTagFrequency = (standups: Standup[]): Record<string, number> => {
  const tagCounts: Record<string, number> = {};
  
  standups.forEach(standup => {
    if (standup.tags && standup.tags.length > 0) {
      standup.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
  });
  
  return tagCounts;
};

/**
 * Filters standups by tag
 * @param standups List of standups
 * @param tag Tag to filter by
 * @returns Filtered list of standups
 */
export const filterStandupsByTag = (standups: Standup[], tag: string): Standup[] => {
  return standups.filter(standup => 
    standup.tags && standup.tags.includes(tag)
  );
};

/**
 * Searches standups for a keyword in various fields
 * @param standups List of standups
 * @param keyword Keyword to search for
 * @returns Filtered list of standups that match the keyword
 */
export const searchStandups = (standups: Standup[], keyword: string): Standup[] => {
  if (!keyword) return standups;
  
  const lowerKeyword = keyword.toLowerCase();
  
  return standups.filter(standup => {
    return (
      (standup.yesterday && standup.yesterday.toLowerCase().includes(lowerKeyword)) ||
      (standup.today && standup.today.toLowerCase().includes(lowerKeyword)) ||
      (standup.blockers && standup.blockers.toLowerCase().includes(lowerKeyword)) ||
      (standup.tags && standup.tags.some(tag => tag.toLowerCase().includes(lowerKeyword)))
    );
  });
};

/**
 * Validates if a standup object has all required fields
 * @param standup Standup object to validate
 * @returns True if valid, false otherwise
 */
export const isValidStandup = (standup: Partial<Standup>): boolean => {
  return !!(
    standup &&
    standup.date &&
    standup.yesterday !== undefined &&
    standup.today !== undefined
  );
}; 