import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { thunk, ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import StandupList from '../../pages/StandupList';
import { Standup } from '../../redux/standups/types';
import { StandupActionTypes } from '../../redux/standups/types';

// Mock the API service
vi.mock('../../services/standupAPI', () => ({
  default: {
    getAll: vi.fn(),
    delete: vi.fn()
  }
}));

// Mock the async action creators
vi.mock('../../redux/standups/actions', () => ({
  fetchStandups: () => ({ type: StandupActionTypes.FETCH_STANDUPS_REQUEST }),
  toggleHighlight: () => ({ type: StandupActionTypes.TOGGLE_HIGHLIGHT_REQUEST }),
  deleteStandup: () => ({ type: StandupActionTypes.DELETE_STANDUP_REQUEST })
}));

// Create a mock store with thunk middleware
const middlewares = [thunk as unknown as ThunkDispatch<any, any, AnyAction>];
const mockStore = configureStore(middlewares);

describe('StandupList Component', () => {
  const mockStandups: Standup[] = [
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
      yesterday: 'Worked on backend',
      today: 'Working on database',
      blockers: 'None',
      isBlockerResolved: false,
      tags: ['backend', 'database'],
      mood: 4,
      productivity: 5,
      isHighlight: true,
      createdAt: '2023-05-02T12:00:00Z',
      updatedAt: '2023-05-02T12:00:00Z'
    }
  ];

  const initialState = {
    standups: {
      standups: mockStandups,
      loading: false,
      error: null
    }
  };

  let store: ReturnType<typeof mockStore>;

  beforeEach(() => {
    store = mockStore(initialState);
    vi.clearAllMocks();
  });

  const renderWithProviders = () => {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <StandupList />
        </BrowserRouter>
      </Provider>
    );
  };

  it('renders the StandupList with title and New Standup button', () => {
    renderWithProviders();

    expect(screen.getByRole('heading', { name: /all standups/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /new standup/i })).toBeInTheDocument();
  });

  it('displays loading message when loading is true', () => {
    store = mockStore({
      standups: {
        ...initialState.standups,
        loading: true
      }
    });

    renderWithProviders();

    expect(screen.getByText(/loading standups/i)).toBeInTheDocument();
  });

  it('displays error message when there is an error', () => {
    store = mockStore({
      standups: {
        ...initialState.standups,
        error: 'Failed to load standups'
      }
    });

    renderWithProviders();

    expect(screen.getByText(/failed to load standups/i)).toBeInTheDocument();
  });

  it('displays empty message when there are no standups', () => {
    store = mockStore({
      standups: {
        ...initialState.standups,
        standups: []
      }
    });

    renderWithProviders();

    expect(screen.getByText(/no standups found/i)).toBeInTheDocument();
  });

  it('renders standup cards when standups are available', () => {
    renderWithProviders();

    expect(screen.getByText('Worked on API endpoints')).toBeInTheDocument();
    expect(screen.getByText('Worked on backend')).toBeInTheDocument();
  });

  it('calls fetchStandups action when mounted', () => {
    renderWithProviders();

    const actions = store.getActions();
    expect(actions).toContainEqual({ type: StandupActionTypes.FETCH_STANDUPS_REQUEST });
  });

  it('calls fetchStandups with isHighlight=true when filter is changed', async () => {
    renderWithProviders();

    const filterSelect = screen.getByRole('combobox');
    fireEvent.change(filterSelect, { target: { value: 'highlights' } });

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions).toContainEqual({ type: StandupActionTypes.FETCH_STANDUPS_REQUEST });
    });
  });

  it('calls toggleHighlight when highlight button is clicked', async () => {
    renderWithProviders();

    const highlightButton = screen.getAllByTitle(/highlight/i)[0];
    fireEvent.click(highlightButton);

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions).toContainEqual({ type: StandupActionTypes.TOGGLE_HIGHLIGHT_REQUEST });
    });
  });

  it('calls deleteStandup when delete button is clicked and confirmed', async () => {
    // Mock window.confirm
    const originalConfirm = window.confirm;
    window.confirm = vi.fn(() => true);

    renderWithProviders();

    const deleteButton = screen.getAllByTitle('Delete')[0];
    fireEvent.click(deleteButton);

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions).toContainEqual({ type: StandupActionTypes.DELETE_STANDUP_REQUEST });
    });

    // Restore window.confirm
    window.confirm = originalConfirm;
  });

  it('does not call deleteStandup when delete is canceled', async () => {
    // Mock window.confirm
    const originalConfirm = window.confirm;
    window.confirm = vi.fn(() => false);

    renderWithProviders();

    const deleteButton = screen.getAllByTitle('Delete')[0];
    fireEvent.click(deleteButton);

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions).not.toContainEqual({ type: StandupActionTypes.DELETE_STANDUP_REQUEST });
    });

    // Restore window.confirm
    window.confirm = originalConfirm;
  });
}); 