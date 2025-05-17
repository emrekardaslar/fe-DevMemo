/**
 * API response types for consistent handling across the application
 */

// Standard API response wrapper
export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  success: boolean;
  error?: string;
}

// Error response
export interface ApiErrorResponse {
  message?: string;
  error?: string;
  status?: number;
  [key: string]: any;
}

// Query parameters type
export type QueryParams = Record<string, any>; 