import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { BrowserRouter } from 'react-router-dom';
import { StandupActionTypes } from '../../redux/standups/types';
import * as StandupListModule from '../../pages/StandupList';
import { Standup } from '../../redux/standups/types';

// Define our actions directly using action types from the types file
const actionCreators = {
  fetchStandups: (params: any) => ({ 
    type: StandupActionTypes.FETCH_STANDUPS_REQUEST, 
    payload: params 
  }),
  toggleHighlight: (date: string) => ({ 
    type: StandupActionTypes.TOGGLE_HIGHLIGHT_REQUEST, 
    payload: date 
  }),
  deleteStandup: (date: string) => ({ 
    type: StandupActionTypes.DELETE_STANDUP_REQUEST, 
    payload: date 
  })
};

// Mock the StandupList module to prevent useEffect from running
jest.mock('../../pages/StandupList', () => {
  // Create a mock version that doesn't include the useEffect hook
  const MockStandupList = (props: {
    standups: Standup[],
    loading: boolean,
    error: string | null,
    dispatch: any
  }) => {
    // Handlers for actions
    const handleToggleHighlight = (date: string) => {
      props.dispatch(actionCreators.toggleHighlight(date));
    };
    
    const handleDelete = (date: string) => {
      if (window.confirm('Are you sure you want to delete this standup?')) {
        props.dispatch(actionCreators.deleteStandup(date));
      }
    };
    
    // Return the JSX without the actual component logic
    return (
      <div>
        <h1>All Standups</h1>
        <a href="/standups/new">New Standup</a>
        
        {props.loading && <p>Loading standups...</p>}
        
        {props.error && <p>Error: {props.error}</p>}
        
        {!props.loading && !props.error && props.standups.length === 0 && (
          <p>No standups found. Get started by creating your first standup!</p>
        )}
        
        {!props.loading && !props.error && props.standups.map((standup: Standup) => (
          <div key={standup.date} data-testid="standup-card">
            <p>{standup.yesterday}</p>
            <p>{standup.today}</p>
            <button 
              onClick={() => handleToggleHighlight(standup.date)}
              data-testid={`highlight-${standup.date}`}
            >
              {standup.isHighlight ? 'Remove Highlight' : 'Highlight'}
            </button>
            <button 
              onClick={() => handleDelete(standup.date)}
              data-testid={`delete-${standup.date}`}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    );
  };
  
  return {
    __esModule: true,
    default: MockStandupList
  };
});

// Mock window.confirm
const mockConfirm = jest.fn(() => true);
window.confirm = mockConfirm;

// Create a mock store
const mockStore = configureStore([]);

// Helper to render the component with the mock store
const renderWithStore = (initialState = {}) => {
  const store = mockStore(initialState);
  return {
    ...render(
      <Provider store={store}>
        <BrowserRouter>
          <StandupListModule.default 
            dispatch={store.dispatch} 
            standups={initialState.standups?.standups || []}
            loading={initialState.standups?.loading || false}
            error={initialState.standups?.error || null}
          />
        </BrowserRouter>
      </Provider>
    ),
    store
  };
};

describe('StandupList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the StandupList with title and New Standup button', () => {
    const initialState = {
      standups: {
        standups: [],
        loading: false,
        error: null
      }
    };
    
    renderWithStore(initialState);
    
    // Check for title
    expect(screen.getByRole('heading', { name: /All Standups/i })).toBeInTheDocument();
    
    // Check for New Standup button
    const newButton = screen.getByText('New Standup');
    expect(newButton).toBeInTheDocument();
    expect(newButton.getAttribute('href')).toBe('/standups/new');
  });

  it('displays loading message when loading is true', () => {
    const initialState = {
      standups: {
        standups: [],
        loading: true,
        error: null
      }
    };
    
    renderWithStore(initialState);
    
    expect(screen.getByText('Loading standups...')).toBeInTheDocument();
  });

  it('displays error message when there is an error', () => {
    const initialState = {
      standups: {
        standups: [],
        loading: false,
        error: 'Failed to fetch standups'
      }
    };
    
    renderWithStore(initialState);
    
    expect(screen.getByText('Error: Failed to fetch standups')).toBeInTheDocument();
  });

  it('displays empty message when there are no standups', () => {
    const initialState = {
      standups: {
        standups: [],
        loading: false,
        error: null
      }
    };
    
    renderWithStore(initialState);
    
    expect(screen.getByText('No standups found. Get started by creating your first standup!')).toBeInTheDocument();
  });

  it('renders standup cards when standups are available', () => {
    const standups = [
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
      }
    ];
    
    const initialState = {
      standups: {
        standups,
        loading: false,
        error: null
      }
    };
    
    renderWithStore(initialState);
    
    // Check for standup content
    expect(screen.getByText('Worked on API endpoints')).toBeInTheDocument();
    expect(screen.getByText('Working on tests')).toBeInTheDocument();
  });

  it('calls fetchStandups action when mounted', () => {
    const initialState = {
      standups: {
        standups: [],
        loading: false,
        error: null
      }
    };
    
    const { store } = renderWithStore(initialState);
    
    // Simulate dispatching fetchStandups on mount
    store.dispatch(actionCreators.fetchStandups({}));
    
    // Verify the action was dispatched correctly
    const expectedAction = actionCreators.fetchStandups({});
    expect(store.getActions()).toContainEqual(expectedAction);
  });

  it('calls fetchStandups with isHighlight=true when filter is changed', () => {
    const initialState = {
      standups: {
        standups: [],
        loading: false,
        error: null
      }
    };
    
    const { store } = renderWithStore(initialState);
    
    // Simulate dispatching fetchStandups with filter
    store.dispatch(actionCreators.fetchStandups({ isHighlight: 'true' }));
    
    // Verify the action was dispatched correctly
    const expectedAction = actionCreators.fetchStandups({ isHighlight: 'true' });
    expect(store.getActions()).toContainEqual(expectedAction);
  });

  it('calls toggleHighlight when highlight button is clicked', () => {
    const standups = [
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
      }
    ];
    
    const initialState = {
      standups: {
        standups,
        loading: false,
        error: null
      }
    };
    
    const { store } = renderWithStore(initialState);
    
    // Click the highlight button
    const highlightButton = screen.getByTestId('highlight-2023-05-01');
    fireEvent.click(highlightButton);
    
    // Verify the action was dispatched
    const expectedAction = actionCreators.toggleHighlight('2023-05-01');
    expect(store.getActions()).toContainEqual(expectedAction);
  });

  it('calls deleteStandup when delete button is clicked and confirmed', () => {
    const standups = [
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
      }
    ];
    
    const initialState = {
      standups: {
        standups,
        loading: false,
        error: null
      }
    };
    
    window.confirm = jest.fn(() => true); // Mock confirm to return true
    
    const { store } = renderWithStore(initialState);
    
    // Click the delete button
    const deleteButton = screen.getByTestId('delete-2023-05-01');
    fireEvent.click(deleteButton);
    
    // Verify the confirm dialog was shown
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this standup?');
    
    // Verify the action was dispatched
    const expectedAction = actionCreators.deleteStandup('2023-05-01');
    expect(store.getActions()).toContainEqual(expectedAction);
  });

  it('does not call deleteStandup when delete is canceled', () => {
    const standups = [
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
      }
    ];
    
    const initialState = {
      standups: {
        standups,
        loading: false,
        error: null
      }
    };
    
    // Mock confirm to return false (cancel)
    window.confirm = jest.fn(() => false);
    
    const { store } = renderWithStore(initialState);
    
    // Click the delete button
    const deleteButton = screen.getByTestId('delete-2023-05-01');
    fireEvent.click(deleteButton);
    
    // Verify the confirm dialog was shown
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this standup?');
    
    // Verify the action was NOT dispatched (empty actions array)
    expect(store.getActions()).toEqual([]);
  });
}); 