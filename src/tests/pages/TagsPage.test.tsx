import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { BrowserRouter } from 'react-router-dom';
import * as TagsPageModule from '../../pages/TagsPage';
import { StandupActionTypes } from '../../redux/standups/types';

// Mock useAppDispatch hook
const mockDispatch = jest.fn();
jest.mock('../../hooks/useAppDispatch', () => ({
  useAppDispatch: () => mockDispatch
}));

// Define our actions
const actionCreators = {
  fetchStandups: () => ({ 
    type: StandupActionTypes.FETCH_STANDUPS_REQUEST 
  })
};

// Create a mock store
const mockStore = configureStore([]);

// Mock formatDate function to make tests more predictable
const formatDate = (dateString: string) => dateString;

// Helper to render the component with the Redux store
const renderWithStore = (initialState = {}) => {
  const store = mockStore(initialState);
  return {
    ...render(
      <Provider store={store}>
        <BrowserRouter>
          <TagsPageModule.default />
        </BrowserRouter>
      </Provider>
    ),
    store
  };
};

describe('TagsPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the TagsPage title', () => {
    const initialState = {
      standups: {
        standups: [],
        loading: false,
        error: null
      }
    };
    
    renderWithStore(initialState);
    
    // Check for title (use the first heading, which is the page title)
    const headings = screen.getAllByRole('heading', { name: /Tags/i });
    expect(headings.length).toBeGreaterThan(0);
    expect(screen.getByText(/Manage and explore standup tags/i)).toBeInTheDocument();
  });

  it('shows loading state when loading is true', () => {
    const initialState = {
      standups: {
        standups: [],
        loading: true,
        error: null
      }
    };
    
    renderWithStore(initialState);
    
    expect(screen.getByText(/Loading tags.../i)).toBeInTheDocument();
  });

  it('shows empty state when no tags are found', () => {
    const initialState = {
      standups: {
        standups: [],
        loading: false,
        error: null
      }
    };
    
    renderWithStore(initialState);
    
    expect(screen.getByText(/No tags found/i)).toBeInTheDocument();
    expect(screen.getByText(/Start adding tags to your standups to see them here/i)).toBeInTheDocument();
  });

  it('renders tags when standups with tags are available', () => {
    const initialState = {
      standups: {
        standups: [
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
            date: '2023-05-02',
            yesterday: 'Worked on UI components',
            today: 'Working on styling',
            blockers: 'None',
            isBlockerResolved: false,
            tags: ['ui', 'testing'],
            mood: 4,
            productivity: 5,
            isHighlight: false,
            createdAt: '2023-05-02T12:00:00Z',
            updatedAt: '2023-05-02T12:00:00Z'
          }
        ],
        loading: false,
        error: null
      }
    };
    
    renderWithStore(initialState);
    
    // Check for tag cards
    expect(screen.getByText('api')).toBeInTheDocument();
    expect(screen.getByText('testing')).toBeInTheDocument();
    expect(screen.getByText('ui')).toBeInTheDocument();
    
    // Check for tag counts
    const apiTagCount = screen.getByText('api').nextSibling;
    expect(apiTagCount).toHaveTextContent('1');
    
    const testingTagCount = screen.getByText('testing').nextSibling;
    expect(testingTagCount).toHaveTextContent('2');
  });

  it('filters tags based on search input', () => {
    const initialState = {
      standups: {
        standups: [
          {
            date: '2023-05-01',
            yesterday: 'Worked on API endpoints',
            today: 'Working on tests',
            blockers: 'None',
            isBlockerResolved: false,
            tags: ['api', 'backend', 'database'],
            mood: 4,
            productivity: 5,
            isHighlight: false,
            createdAt: '2023-05-01T12:00:00Z',
            updatedAt: '2023-05-01T12:00:00Z'
          },
          {
            date: '2023-05-02',
            yesterday: 'Worked on UI components',
            today: 'Working on styling',
            blockers: 'None',
            isBlockerResolved: false,
            tags: ['ui', 'frontend', 'design'],
            mood: 4,
            productivity: 5,
            isHighlight: false,
            createdAt: '2023-05-02T12:00:00Z',
            updatedAt: '2023-05-02T12:00:00Z'
          }
        ],
        loading: false,
        error: null
      }
    };
    
    renderWithStore(initialState);
    
    // Check all tags are initially displayed
    expect(screen.getByText('api')).toBeInTheDocument();
    expect(screen.getByText('backend')).toBeInTheDocument();
    expect(screen.getByText('frontend')).toBeInTheDocument();
    
    // Apply search filter
    const searchInput = screen.getByPlaceholderText(/Search tags.../i);
    fireEvent.change(searchInput, { target: { value: 'end' } });
    
    // Check only matching tags are displayed
    expect(screen.getByText('backend')).toBeInTheDocument();
    expect(screen.getByText('frontend')).toBeInTheDocument();
    expect(screen.queryByText('api')).not.toBeInTheDocument();
    
    // Change search to show no results
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    expect(screen.getByText(/No tags found for "nonexistent"/i)).toBeInTheDocument();
  });

  it('dispatches fetchStandups action on mount', () => {
    const initialState = {
      standups: {
        standups: [],
        loading: false,
        error: null
      }
    };
    
    renderWithStore(initialState);
    
    // Verify fetchStandups was dispatched
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('shows standup links in each tag card', () => {
    // Mock the formatDate function
    jest.spyOn(global.Date.prototype, 'toLocaleDateString').mockImplementation(() => 'Mocked Date');
    
    const initialState = {
      standups: {
        standups: [
          {
            date: '2023-05-01',
            yesterday: 'Worked on API endpoints',
            today: 'Working on tests',
            blockers: 'None',
            isBlockerResolved: false,
            tags: ['api'],
            mood: 4,
            productivity: 5,
            isHighlight: false,
            createdAt: '2023-05-01T12:00:00Z',
            updatedAt: '2023-05-01T12:00:00Z'
          },
          {
            date: '2023-05-02',
            yesterday: 'Worked on UI components',
            today: 'Working on styling',
            blockers: 'None',
            isBlockerResolved: false,
            tags: ['api'],
            mood: 4,
            productivity: 5,
            isHighlight: false,
            createdAt: '2023-05-02T12:00:00Z',
            updatedAt: '2023-05-02T12:00:00Z'
          }
        ],
        loading: false,
        error: null
      }
    };
    
    renderWithStore(initialState);
    
    // Check for standup links
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
    
    // Check for correct href attributes
    const standupLinks = links.filter(link => link.getAttribute('href')?.startsWith('/standups/'));
    expect(standupLinks.length).toBeGreaterThan(0);
    
    // Verify links by href instead of text content (which may be formatted differently)
    expect(standupLinks.some(link => link.getAttribute('href') === '/standups/2023-05-01')).toBe(true);
    expect(standupLinks.some(link => link.getAttribute('href') === '/standups/2023-05-02')).toBe(true);
    
    // Clean up mock
    jest.restoreAllMocks();
  });
}); 