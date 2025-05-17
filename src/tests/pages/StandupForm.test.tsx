import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { type Action } from '@reduxjs/toolkit';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import StandupForm from '../../pages/StandupForm';
import { Standup } from '../../redux/features/standups/types';

// Mock the API service with properly formed response objects
vi.mock('../../services/api', () => ({
  standupAPI: {
    create: vi.fn().mockImplementation((data) => {
      return Promise.resolve({
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }),
    update: vi.fn().mockImplementation((date, data) => {
      return Promise.resolve({
        ...data,
        date,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }),
    getByDate: vi.fn().mockImplementation((date) => {
      return Promise.resolve({
        date,
        yesterday: 'Mocked yesterday',
        today: 'Mocked today',
        blockers: '',
        isBlockerResolved: false,
        tags: [],
        mood: 4,
        productivity: 5,
        isHighlight: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    })
  }
}));

// Custom middleware to handle async actions
const thunkMiddleware = () => (next: any) => (action: any) => {
  if (typeof action === 'function') {
    return action(store.dispatch, store.getState);
  }
  return next(action);
};

// Create a mock store with middleware
const middlewares = [thunkMiddleware];
const mockStore = configureStore(middlewares);
let store: ReturnType<typeof mockStore>;

describe('StandupForm Component', () => {
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
    }
  ];

  const initialState = {
    standups: {
      standups: mockStandups,
      currentStandup: null,
      loading: false,
      error: null,
      success: false
    }
  };

  beforeEach(() => {
    store = mockStore(initialState);
    vi.clearAllMocks();
  });

  const renderWithProviders = () => {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <StandupForm />
        </BrowserRouter>
      </Provider>
    );
  };

  it('renders the form with all fields', () => {
    renderWithProviders();

    // Check for form fields
    expect(screen.getByLabelText(/yesterday/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/today/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/blockers/i)).toBeInTheDocument();
    expect(screen.getByText(/how was your mood today/i)).toBeInTheDocument();
    expect(screen.getByText(/how productive were you/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/add tags/i)).toBeInTheDocument();
  });

  it('handles form submission for new standup', async () => {
    // Set up store with no standups so form is in create mode
    store = mockStore({
      standups: {
        standups: [],
        currentStandup: null,
        loading: false,
        error: null,
        success: false
      }
    });

    // Mock useParams to return no date
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useParams: () => ({})
      };
    });

    renderWithProviders();

    // Fill in form fields
    fireEvent.change(screen.getByLabelText(/yesterday/i), {
      target: { value: 'Worked on frontend' }
    });
    fireEvent.change(screen.getByLabelText(/today/i), {
      target: { value: 'Working on backend' }
    });
    fireEvent.change(screen.getByLabelText(/blockers/i), {
      target: { value: 'None' }
    });
    // Select mood and productivity by clicking the button
    fireEvent.click(screen.getAllByRole('button', { name: '4' })[0]); // Mood 4
    fireEvent.click(screen.getAllByRole('button', { name: '5' })[1]); // Productivity 5

    // Submit form
    const submitButton = screen.getByRole('button', { name: /create standup|update standup/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const actions = store.getActions();
      // Look for the Redux Toolkit update action
      expect(actions.some(action => action.type === 'standups/update/pending')).toBe(true);
    });
  });

  it('handles form submission for editing existing standup', async () => {
    // Mock the useParams hook to return a date
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useParams: () => ({ date: '2023-05-01' })
      };
    });

    renderWithProviders();

    // Fill in form fields
    fireEvent.change(screen.getByLabelText(/yesterday/i), {
      target: { value: 'Updated yesterday work' }
    });
    fireEvent.change(screen.getByLabelText(/today/i), {
      target: { value: 'Updated today work' }
    });
    // Select mood and productivity by clicking the button
    fireEvent.click(screen.getAllByRole('button', { name: '4' })[0]); // Mood 4
    fireEvent.click(screen.getAllByRole('button', { name: '5' })[1]); // Productivity 5

    // Submit form
    const submitButton = screen.getByRole('button', { name: /update standup/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions.some(action => action.type === 'standups/update/pending')).toBe(true);
    });
  });

  it('handles API errors gracefully', async () => {
    store = mockStore({
      standups: {
        ...initialState.standups,
        error: 'Failed to save standup'
      }
    });

    renderWithProviders();

    // Fill in form fields
    fireEvent.change(screen.getByLabelText(/yesterday/i), {
      target: { value: 'Worked on frontend' }
    });
    fireEvent.change(screen.getByLabelText(/today/i), {
      target: { value: 'Working on backend' }
    });
    // Select mood and productivity by clicking the button
    fireEvent.click(screen.getAllByRole('button', { name: '4' })[0]); // Mood 4
    fireEvent.click(screen.getAllByRole('button', { name: '5' })[1]); // Productivity 5

    // Submit form
    const submitButton = screen.getByRole('button', { name: /update standup/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/failed to save standup/i)).toBeInTheDocument();
    });
  });
}); 