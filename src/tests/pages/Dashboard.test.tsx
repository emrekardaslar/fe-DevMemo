import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../../pages/Dashboard';
import { fetchStandups } from '../../redux/standups/actions';
import { standupAPI } from '../../services/api';

// Mock React's useEffect to prevent it from running
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: jest.fn((f) => f())
}));

// Mock the redux actions
jest.mock('../../redux/standups/actions', () => ({
  fetchStandups: jest.fn(() => ({ type: 'FETCH_STANDUPS_REQUEST' }))
}));

// Mock the API service
jest.mock('../../services/api', () => ({
  standupAPI: {
    getStats: jest.fn(),
    getAll: jest.fn()
  },
  queryAPI: {
    query: jest.fn()
  }
}));

// Create a mock store
const mockStore = configureStore([]);

// Helper to render the component with the mock store
const renderWithStore = (initialState = {}) => {
  const store = mockStore(initialState);
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    </Provider>
  );
};

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mock responses
    (standupAPI.getStats as jest.Mock).mockResolvedValue({
      data: {
        totalStandups: 10,
        dateRange: {
          firstDate: '2023-01-01',
          lastDate: '2023-05-01',
          totalDays: 121
        },
        tagsStats: {
          uniqueTagsCount: 15,
          topTags: [
            { tag: 'frontend', count: 5 },
            { tag: 'api', count: 4 },
            { tag: 'testing', count: 3 }
          ]
        },
        blockersStats: {
          total: 3,
          percentage: 30
        },
        moodStats: {
          average: 4.2,
          entriesWithMood: 10
        },
        productivityStats: {
          average: 4.5,
          entriesWithProductivity: 10
        },
        highlights: {
          count: 3,
          dates: ['2023-04-15', '2023-04-20', '2023-04-25']
        }
      }
    });
    
    (standupAPI.getAll as jest.Mock).mockResolvedValue({
      data: [
        {
          date: '2023-05-01',
          yesterday: 'Worked on API endpoints',
          today: 'Working on tests',
          blockers: 'None',
          isBlockerResolved: false,
          tags: ['api', 'testing'],
          mood: 4,
          productivity: 5,
          isHighlight: false,
          createdAt: '2023-05-01T12:00:00Z',
          updatedAt: '2023-05-01T12:00:00Z'
        },
        {
          date: '2023-04-30',
          yesterday: 'Frontend components',
          today: 'More frontend work',
          blockers: 'CSS issues',
          isBlockerResolved: true,
          tags: ['frontend', 'css'],
          mood: 3,
          productivity: 4,
          isHighlight: true,
          createdAt: '2023-04-30T12:00:00Z',
          updatedAt: '2023-04-30T12:00:00Z'
        }
      ]
    });
  });

  it('renders the Dashboard with title and welcome message', async () => {
    const initialState = {
      standups: {
        standups: [],
        loading: false,
        error: null
      }
    };
    
    renderWithStore(initialState);
    
    // Check for title
    expect(screen.getByText(/Welcome to StandupSync/i)).toBeInTheDocument();
    expect(screen.getByText(/Track and manage your daily standups/i)).toBeInTheDocument();
  });

  it('calls fetchStandups when mounted', () => {
    const initialState = {
      standups: {
        standups: [],
        loading: false,
        error: null
      }
    };
    
    renderWithStore(initialState);
    
    // Check that the action creator was called
    expect(fetchStandups).toHaveBeenCalled();
    expect(standupAPI.getStats).toHaveBeenCalled();
    expect(standupAPI.getAll).toHaveBeenCalled();
  });

  it('handles API errors gracefully', async () => {
    const initialState = {
      standups: {
        standups: [],
        loading: false,
        error: null
      }
    };
    
    // Mock console.error to prevent test output noise
    const originalConsoleError = console.error;
    console.error = jest.fn();
    
    // Mock API error
    (standupAPI.getStats as jest.Mock).mockRejectedValueOnce(new Error('API error'));
    
    renderWithStore(initialState);
    
    // The component should not crash
    expect(screen.getByText(/Welcome to StandupSync/i)).toBeInTheDocument();
    
    // Restore console.error
    console.error = originalConsoleError;
  });
}); 