import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { Standup, StandupsState } from './types';

// Basic selectors
export const selectStandupsState = (state: RootState): StandupsState => state.standups;

export const selectAllStandups = (state: RootState): Standup[] => state.standups.standups;

export const selectCurrentStandup = (state: RootState): Standup | null => state.standups.currentStandup;

export const selectStandupsLoading = (state: RootState): boolean => state.standups.loading;

export const selectStandupsError = (state: RootState): string | null => state.standups.error;

export const selectStandupsSuccess = (state: RootState): boolean => state.standups.success;

// Memoized selectors
export const selectStandupByDate = (date: string) => 
  createSelector(
    [selectAllStandups],
    (standups: Standup[]) => standups.find((standup: Standup) => standup.date === date)
  );

export const selectHighlightedStandups = createSelector(
  [selectAllStandups],
  (standups: Standup[]) => standups.filter((standup: Standup) => standup.isHighlight)
);

export const selectStandupsByDateRange = (startDate: string, endDate: string) =>
  createSelector(
    [selectAllStandups],
    (standups: Standup[]) => standups.filter((standup: Standup) => 
      standup.date >= startDate && standup.date <= endDate
    )
  );

export const selectStandupsByTags = (tags: string[]) =>
  createSelector(
    [selectAllStandups],
    (standups: Standup[]) => standups.filter((standup: Standup) => 
      tags.every(tag => standup.tags.includes(tag))
    )
  );

export const selectAverageProductivity = createSelector(
  [selectAllStandups],
  (standups: Standup[]) => {
    if (standups.length === 0) return 0;
    const sum = standups.reduce((total: number, standup: Standup) => total + standup.productivity, 0);
    return sum / standups.length;
  }
);

export const selectAverageMood = createSelector(
  [selectAllStandups],
  (standups: Standup[]) => {
    if (standups.length === 0) return 0;
    const sum = standups.reduce((total: number, standup: Standup) => total + standup.mood, 0);
    return sum / standups.length;
  }
);

export const selectAllTags = createSelector(
  [selectAllStandups],
  (standups: Standup[]) => {
    const tagsMap = new Map<string, number>();
    
    standups.forEach((standup: Standup) => {
      standup.tags.forEach((tag: string) => {
        const count = tagsMap.get(tag) || 0;
        tagsMap.set(tag, count + 1);
      });
    });
    
    return Array.from(tagsMap.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  }
); 