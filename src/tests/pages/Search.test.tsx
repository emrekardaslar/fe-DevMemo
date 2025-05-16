import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Search from '../../pages/Search';
import { standupAPI } from '../../services/api';

// Mock StandupCard component
vi.mock('../../components/standups/StandupCard', () => {
  return {
    __esModule: true,
    default: ({ standup }: { standup: any }) => (
      <div data-testid="standup-card">
        <div data-testid="standup-date">{standup.date}</div>
        <div data-testid="standup-yesterday">{standup.yesterday}</div>
        <div data-testid="standup-today">{standup.today}</div>
        <div data-testid="standup-tags">
          {standup.tags.map((tag: string) => (
            <span key={tag} data-testid={`tag-${tag}`}>{tag}</span>
          ))}
        </div>
      </div>
    )
  };
});

// Mock the API service
vi.mock('../../services/api', () => ({
  standupAPI: {
    search: vi.fn()
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
          <Search />
        </BrowserRouter>
      </Provider>
    ),
    store
  };
};

describe('Search Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the search form', () => {
    renderWithStore();
    
    // Check for form elements
    expect(screen.getByPlaceholderText(/Search for keywords or content/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('handles search submission', async () => {
    const mockResponse = {
      data: [
        {
          date: '2023-05-01',
          yesterday: 'Worked on API endpoints',
          today: 'Working on tests',
          blockers: 'None',
          tags: ['api', 'testing'],
          mood: 4,
          productivity: 5
        }
      ]
    };
    
    (standupAPI.search as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockResponse);
    
    renderWithStore();
    
    // Enter search query and submit
    const searchInput = screen.getByPlaceholderText(/Search for keywords or content/i);
    const submitButton = screen.getByRole('button', { name: /search/i });
    
    fireEvent.change(searchInput, { target: { value: 'api' } });
    fireEvent.click(submitButton);
    
    // Wait for results
    await waitFor(() => {
      expect(standupAPI.search).toHaveBeenCalledWith('api');
      expect(screen.getByTestId('standup-card')).toBeInTheDocument();
      expect(screen.getByTestId('standup-date')).toHaveTextContent('2023-05-01');
      expect(screen.getByTestId('standup-yesterday')).toHaveTextContent('Worked on API endpoints');
      expect(screen.getByTestId('standup-today')).toHaveTextContent('Working on tests');
      expect(screen.getByTestId('tag-api')).toBeInTheDocument();
      expect(screen.getByTestId('tag-testing')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    (standupAPI.search as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('API error'));
    
    // Mock console.error to prevent test output noise
    const originalConsoleError = console.error;
    console.error = vi.fn();
    
    renderWithStore();
    
    // Enter search query and submit
    const searchInput = screen.getByPlaceholderText(/Search for keywords or content/i);
    const submitButton = screen.getByRole('button', { name: /search/i });
    
    fireEvent.change(searchInput, { target: { value: 'api' } });
    fireEvent.click(submitButton);
    
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/An error occurred while searching. Please try again./i)).toBeInTheDocument();
    });
    
    // Restore console.error
    console.error = originalConsoleError;
  });
}); 