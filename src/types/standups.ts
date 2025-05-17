import { BaseEntity } from './common';

/**
 * Standup types
 */

// Standup entity
export interface Standup extends BaseEntity {
  id: string;
  date: string;
  yesterday: string;
  today: string;
  blockers: string;
  mood?: number;
  productivity?: number;
  tags: string[];
  isHighlight: boolean;
}

// Standup create request
export interface StandupCreateRequest {
  date: string;
  yesterday: string;
  today: string;
  blockers: string;
  mood?: number;
  productivity?: number;
  tags?: string[];
  isHighlight?: boolean;
}

// Standup update request
export interface StandupUpdateRequest {
  yesterday?: string;
  today?: string;
  blockers?: string;
  mood?: number;
  productivity?: number;
  tags?: string[];
  isHighlight?: boolean;
}

// Standup query parameters
export interface StandupQueryParams {
  tag?: string;
  startDate?: string;
  endDate?: string;
  minMood?: number;
  maxMood?: number;
  minProductivity?: number;
  maxProductivity?: number;
  isHighlight?: boolean;
  search?: string;
} 