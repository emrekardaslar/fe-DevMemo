import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import QueryPage from '../../pages/QueryPage';
import { queryAPI } from '../../services/api';

// Mock the api services
vi.mock('../../services/api', () => ({
  queryAPI: {
    processQuery: vi.fn()
  }
}));

// Create a mock store
const mockStore = configureStore([]);

// Helper to render the component with the mock store
const renderWithStore = (initialState = {}) => {
  const store = mockStore(initialState);
  return {
    ...render(
      <Provider store={store}>
        <BrowserRouter>
          <QueryPage />
        </BrowserRouter>
      </Provider>
    ),
    store
  };
};

describe('QueryPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the query form', () => {
    renderWithStore();
    
    // Check for form elements
    expect(screen.getByPlaceholderText(/Ask a question about your standups/i)).toBeInTheDocument();
    expect(screen.getByTestId('query-submit-button')).toBeInTheDocument();
  });

  it('handles query submission', async () => {
    const mockResponseData = [
      {
        date: '2023-05-01',
        yesterday: 'Worked on API endpoints',
        today: 'Working on tests',
        blockers: 'None',
        tags: ['api', 'testing'],
        mood: 4,
        productivity: 5
      }
    ];
    
    const mockResponse = {
      data: {
        success: true,
        data: mockResponseData
      }
    };
    
    (queryAPI.processQuery as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockResponse);
    
    renderWithStore();
    
    // Enter query and submit
    const queryInput = screen.getByPlaceholderText(/Ask a question about your standups/i);
    const submitButton = screen.getByTestId('query-submit-button');
    
    fireEvent.change(queryInput, { target: { value: 'tag:api' } });
    fireEvent.click(submitButton);
    
    // Wait for results
    await waitFor(() => {
      expect(queryAPI.processQuery).toHaveBeenCalledWith('tag:api');
    });
    
    // Add a data-testid to make it easier to test
    await waitFor(() => {
      expect(screen.getByText(/Worked on API endpoints/i)).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    (queryAPI.processQuery as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('API error'));
    
    // Mock console.error to prevent test output noise
    const originalConsoleError = console.error;
    console.error = vi.fn();
    
    renderWithStore();
    
    // Enter query and submit
    const queryInput = screen.getByPlaceholderText(/Ask a question about your standups/i);
    const submitButton = screen.getByTestId('query-submit-button');
    
    fireEvent.change(queryInput, { target: { value: 'tag:api' } });
    fireEvent.click(submitButton);
    
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/An error occurred processing your query/i)).toBeInTheDocument();
    });
    
    // Restore console.error
    console.error = originalConsoleError;
  });
}); 