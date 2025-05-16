import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect } from 'vitest';
import StandupCard from '../../components/standups/StandupCard';
import { Standup } from '../../redux/standups/types';

// Create a mock store without middleware
const mockStore = configureStore([]);

describe('StandupCard Component', () => {
  const mockStandup: Standup = {
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
  };

  const highlightedStandup: Standup = {
    ...mockStandup,
    isHighlight: true
  };

  const initialState = {
    standups: {
      standups: [mockStandup],
      loading: false,
      error: null
    }
  };

  const store = mockStore(initialState);

  const renderWithProviders = (standup: Standup) => {
    const onToggleHighlight = vi.fn();
    const onDelete = vi.fn();

    render(
      <Provider store={store}>
        <BrowserRouter>
          <StandupCard
            standup={standup}
            onToggleHighlight={onToggleHighlight}
            onDelete={onDelete}
          />
        </BrowserRouter>
      </Provider>
    );

    return { onToggleHighlight, onDelete };
  };

  it('renders standup information correctly', () => {
    renderWithProviders(mockStandup);

    // Check date
    expect(screen.getByText('Monday, May 1, 2023')).toBeInTheDocument();
    
    // Check content
    expect(screen.getByText('Worked on API endpoints')).toBeInTheDocument();
    expect(screen.getByText('Working on tests')).toBeInTheDocument();
    expect(screen.getByText('None')).toBeInTheDocument();
    
    // Check tags
    expect(screen.getByText('#api')).toBeInTheDocument();
    expect(screen.getByText('#testing')).toBeInTheDocument();
    
    // Check mood and productivity
    expect(screen.getByText('Mood: 🙂 4/5')).toBeInTheDocument();
    expect(screen.getByText('Productivity: 🚀 5/5')).toBeInTheDocument();
  });

  it('handles highlight toggle', () => {
    const { onToggleHighlight } = renderWithProviders(mockStandup);
    
    // Find the highlight button by its title
    const highlightButton = screen.getByTitle('Highlight');
    fireEvent.click(highlightButton);
    
    expect(onToggleHighlight).toHaveBeenCalledWith(mockStandup.date);
  });

  it('handles delete action', () => {
    const { onDelete } = renderWithProviders(mockStandup);
    
    // Find the delete button by its title
    const deleteButton = screen.getByTitle('Delete');
    fireEvent.click(deleteButton);
    
    expect(onDelete).toHaveBeenCalledWith(mockStandup.date);
  });

  it('displays highlight status correctly', () => {
    renderWithProviders(highlightedStandup);
    
    // For highlighted standup, should show "Remove highlight" button
    expect(screen.getByTitle('Remove highlight')).toBeInTheDocument();
    
    // Re-render with non-highlighted standup
    renderWithProviders(mockStandup);
    
    // For non-highlighted standup, should show "Highlight" button
    expect(screen.getByTitle('Highlight')).toBeInTheDocument();
  });
}); 