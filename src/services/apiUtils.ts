import axios, { AxiosError, AxiosResponse } from 'axios';
import { ApiResponse, ApiErrorResponse } from './types';

/**
 * Standardizes API responses into a consistent format
 */
export function wrapResponse<T>(response: AxiosResponse): ApiResponse<T> {
  const { data, status, statusText } = response;
  
  // Handle nested data structure that some endpoints return
  if (data && typeof data === 'object' && 'success' in data && 'data' in data) {
    return {
      data: data.data as T,
      status,
      statusText,
      success: data.success,
      error: data.error
    };
  }
  
  // Handle direct data response
  return {
    data: data as T,
    status,
    statusText,
    success: status >= 200 && status < 300,
    error: undefined
  };
}

/**
 * Handles API errors in a consistent manner
 */
export function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    
    // Response error (server responded with error status)
    if (axiosError.response?.data) {
      console.error('API Error:', axiosError.response.data);
      const responseData = axiosError.response.data;
      
      if (typeof responseData === 'string') {
        throw new Error(responseData);
      } else if (responseData.message) {
        throw new Error(responseData.message);
      } else if (responseData.error) {
        throw new Error(responseData.error);
      } else {
        throw new Error(`Error ${axiosError.response.status}: ${axiosError.response.statusText}`);
      }
    }
    
    // Network error (no response received)
    if (axiosError.request) {
      console.error('Network Error:', axiosError.message);
      throw new Error('Network error. Please check your connection and try again.');
    }
  }
  
  // Fallback for non-Axios errors
  console.error('Unexpected error:', error);
  throw new Error('An unexpected error occurred');
} 