/**
 * API-related types
 */

// Standard API response
export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  success: boolean;
  error?: string;
}

// API error response
export interface ApiErrorResponse {
  message?: string;
  error?: string;
  status?: number;
  [key: string]: any;
}

// Type for query parameters
export type QueryParams = Record<string, any>;

// Base API methods that all service interfaces should implement
export interface BaseApiService {
  get<T>(url: string, params?: QueryParams, config?: any): Promise<ApiResponse<T>>;
  post<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>>;
  put<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>>;
  patch<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>>;
  delete<T>(url: string, config?: any): Promise<ApiResponse<T>>;
}

// HTTP status codes
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500
} 