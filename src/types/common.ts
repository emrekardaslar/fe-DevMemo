/**
 * Common types used across the application
 */

// ID type
export type ID = string | number;

// Pagination-related types
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Sorting options
export type SortDirection = 'asc' | 'desc';

export interface SortOption {
  field: string;
  direction: SortDirection;
}

// Filter options
export interface FilterOption {
  field: string;
  value: any;
  operator?: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'startsWith' | 'endsWith';
}

// Base entity properties
export interface BaseEntity {
  id?: ID;
  createdAt?: string;
  updatedAt?: string;
}

// Simple key-value object
export type Dictionary<T = any> = {
  [key: string]: T;
}; 