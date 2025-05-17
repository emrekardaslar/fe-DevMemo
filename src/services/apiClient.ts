import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { wrapResponse, handleApiError } from './apiUtils';
import { ApiResponse, QueryParams } from './types';

// Get API URL from environment
const API_URL: string = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

/**
 * Creates a configured Axios instance
 */
export function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Add request interceptor for auth token
  client.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return client;
}

// Default API client instance
const apiClient = createApiClient();

/**
 * Base API service with standardized methods
 */
export class ApiService {
  protected client: AxiosInstance;

  constructor(client: AxiosInstance = apiClient) {
    this.client = client;
  }

  /**
   * Performs a GET request
   */
  async get<T>(url: string, params?: QueryParams, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.get(url, { ...config, params });
      return wrapResponse<T>(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Performs a POST request
   */
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post(url, data, config);
      return wrapResponse<T>(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Performs a PUT request
   */
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.put(url, data, config);
      return wrapResponse<T>(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Performs a PATCH request
   */
  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.patch(url, data, config);
      return wrapResponse<T>(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Performs a DELETE request
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.delete(url, config);
      return wrapResponse<T>(response);
    } catch (error) {
      return handleApiError(error);
    }
  }
}

export default apiClient; 