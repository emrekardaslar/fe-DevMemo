import React, { ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { ApiResponse } from '../../services/types';

// Mock store creator with generic type support
export function createMockStore(initialState: any = {}) {
  return configureStore({
    reducer: (state = initialState, action: any) => {
      // For testing we just return the state unmodified
      return state;
    },
    preloadedState: initialState
  });
}

// Mock render with standard providers
export function renderWithProviders(
  ui: React.ReactElement,
  {
    initialState = {},
    store = createMockStore(initialState),
    ...renderOptions
  }: {
    initialState?: any;
    store?: any;
  } & Omit<RenderOptions, 'wrapper'> = {}
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <Provider store={store}>
        <BrowserRouter>{children}</BrowserRouter>
      </Provider>
    );
  }
  
  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions })
  };
}

// Create standard mock API response
export function createMockApiResponse<T>(data: T, status = 200, success = true): ApiResponse<T> {
  return {
    data,
    status,
    statusText: success ? 'OK' : 'Error',
    success,
    error: success ? undefined : 'An error occurred'
  };
}

// Mock API service creator
export function createMockApiService(mockResponses: Record<string, any> = {}) {
  // Create base mock methods
  const mockService = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn()
  };
  
  // For each method, set up a default implementation
  Object.keys(mockService).forEach(method => {
    (mockService as any)[method].mockImplementation((path: string) => {
      // Check if there's a mock response for this path
      const mockPath = Object.keys(mockResponses).find(mockPath => path.includes(mockPath));
      
      if (mockPath) {
        const responseData = mockResponses[mockPath];
        return Promise.resolve(createMockApiResponse(responseData));
      }
      
      // Default empty response
      return Promise.resolve(createMockApiResponse({}));
    });
  });
  
  return mockService;
}

// Create standard mocked thunk result
export function createMockThunkResult(fulfilled = true, payload?: any, error?: string) {
  if (fulfilled) {
    return {
      meta: { requestStatus: 'fulfilled' },
      payload: payload || null
    };
  }
  
  return {
    meta: { requestStatus: 'rejected' },
    payload: error || 'An error occurred',
    error: new Error(error || 'An error occurred')
  };
}

// Create standard mocked hooks
export function createMockHooks(overrides: Record<string, any> = {}) {
  return {
    useNavigate: () => vi.fn(),
    ...overrides
  };
} 