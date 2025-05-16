import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { thunk, ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import TagsPage from '../../pages/TagsPage';
import { Standup } from '../../redux/standups/types';
import { StandupActionTypes } from '../../redux/standups/types';

// Mock the async action creators
vi.mock('../../redux/standups/actions', () => ({
  fetchStandups: () => ({ type: StandupActionTypes.FETCH_STANDUPS_REQUEST })
}));

// Create a mock store with thunk middleware
const middlewares = [thunk as unknown as ThunkDispatch<any, any, AnyAction>];
const mockStore = configureStore(middlewares);

describe('TagsPage Component', () => {
  const mockStandups: Standup[] = [
    {
      date: '2023-05-01',
      yesterday: 'Worked on API endpoints',
      today: 'Working on tests',
      blockers: 'None',
      isBlockerResolved: false,
      tags: ['api', 'testing', 'frontend'],
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
      tags: ['api', 'backend', 'database'],
      mood: 4,
      productivity: 5,
      isHighlight: false,
      createdAt: '2023-05-02T12:00:00Z',
      updatedAt: '2023-05-02T12:00:00Z'
    },
    {
      date: '2023-05-03',
      yesterday: 'Worked on frontend',
      today: 'Working on UI',
      blockers: 'None',
      isBlockerResolved: false,
      tags: ['frontend', 'ui', 'design'],
      mood: 4,
      productivity: 5,
      isHighlight: false,
      createdAt: '2023-05-03T12:00:00Z',
      updatedAt: '2023-05-03T12:00:00Z'
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
          <TagsPage />
        </BrowserRouter>
      </Provider>
    );
  };

  it('renders loading state', () => {
    store = mockStore({
      standups: {
        ...initialState.standups,
        loading: true
      }
    });

    renderWithProviders();

    expect(screen.getByText(/loading tags/i)).toBeInTheDocument();
  });

  it('renders empty state when no tags are available', () => {
    store = mockStore({
      standups: {
        ...initialState.standups,
        standups: []
      }
    });

    renderWithProviders();

    expect(screen.getByText(/no tags found/i)).toBeInTheDocument();
  });

  it('renders tags with their counts', () => {
    renderWithProviders();

    // Check tag names and counts separately
    expect(screen.getByText('api')).toBeInTheDocument();
    expect(screen.getAllByText('2')[0]).toBeInTheDocument();
    expect(screen.getByText('testing')).toBeInTheDocument();
    expect(screen.getAllByText('1')[0]).toBeInTheDocument();
    expect(screen.getByText('frontend')).toBeInTheDocument();
    expect(screen.getAllByText('2')[1]).toBeInTheDocument();
    expect(screen.getByText('backend')).toBeInTheDocument();
    expect(screen.getByText('database')).toBeInTheDocument();
    expect(screen.getByText('ui')).toBeInTheDocument();
    expect(screen.getByText('design')).toBeInTheDocument();
  });

  it('filters tags based on search input', () => {
    renderWithProviders();

    // Type in search input
    const searchInput = screen.getByPlaceholderText(/search tags/i);
    fireEvent.change(searchInput, { target: { value: 'api' } });

    // Should only show tags containing 'api'
    expect(screen.getByText('api')).toBeInTheDocument();
    expect(screen.getAllByText('2')[0]).toBeInTheDocument();
    expect(screen.queryByText('testing')).not.toBeInTheDocument();
    expect(screen.queryByText('frontend')).not.toBeInTheDocument();
  });

  it('displays recent standups for each tag', () => {
    renderWithProviders();

    // Check that standup dates are displayed for each tag
    expect(screen.getAllByText('May 1, 2023').length).toBeGreaterThan(0);
    expect(screen.getAllByText('May 2, 2023').length).toBeGreaterThan(0);
    expect(screen.getAllByText('May 3, 2023').length).toBeGreaterThan(0);
  });

  it('shows "View all" link when tag has more than 5 standups', () => {
    // Create a tag with more than 5 standups
    const manyStandups = Array.from({ length: 6 }, (_, i) => ({
      ...mockStandups[0],
      date: `2023-05-${i + 1}`,
      yesterday: `Work ${i + 1}`,
      tags: ['many-tag']
    }));

    store = mockStore({
      standups: {
        ...initialState.standups,
        standups: manyStandups
      }
    });

    renderWithProviders();

    // Should show "View all" link for the tag with many standups
    expect(screen.getByText(/view all/i)).toBeInTheDocument();
  });
}); 