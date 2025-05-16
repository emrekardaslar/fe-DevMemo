import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import TagSelector from '../../../components/standups/TagSelector';
import { Standup } from '../../../redux/standups/types';

// Create a mock store without middleware
const mockStore = configureStore([]);

describe('TagSelector Component', () => {
  // Mock store with standups that have tags
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
      yesterday: 'Worked on tests',
      today: 'Writing documentation',
      blockers: 'None',
      isBlockerResolved: false,
      tags: ['testing', 'documentation'],
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

  const store = mockStore(initialState);

  // Mock props for TagSelector
  const mockProps = {
    selectedTags: [],
    onTagsChange: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders TagSelector with empty selected tags', () => {
    render(
      <Provider store={store}>
        <TagSelector {...mockProps} />
      </Provider>
    );

    // Input should be present with placeholder
    const input = screen.getByPlaceholderText('Add tags (press Enter)');
    expect(input).toBeInTheDocument();
  });

  it('renders TagSelector with pre-selected tags', () => {
    render(
      <Provider store={store}>
        <TagSelector 
          selectedTags={['api', 'testing']} 
          onTagsChange={mockProps.onTagsChange} 
        />
      </Provider>
    );

    // Selected tags should be displayed
    expect(screen.getByText('api')).toBeInTheDocument();
    expect(screen.getByText('testing')).toBeInTheDocument();
    
    // Input should be present with empty placeholder since we have tags
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', '');
  });

  it('shows suggestions when input is focused', () => {
    render(
      <Provider store={store}>
        <TagSelector {...mockProps} />
      </Provider>
    );

    const input = screen.getByPlaceholderText('Add tags (press Enter)');
    fireEvent.focus(input);

    // Should show suggestions from the store
    expect(screen.getByText('api')).toBeInTheDocument();
    expect(screen.getByText('testing')).toBeInTheDocument();
    expect(screen.getByText('frontend')).toBeInTheDocument();
  });

  it('filters suggestions based on input', () => {
    render(
      <Provider store={store}>
        <TagSelector {...mockProps} />
      </Provider>
    );

    const input = screen.getByPlaceholderText('Add tags (press Enter)');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'test' } });

    // Should only show suggestions containing 'test'
    expect(screen.getByText('testing')).toBeInTheDocument();
    expect(screen.queryByText('api')).not.toBeInTheDocument();
    expect(screen.queryByText('frontend')).not.toBeInTheDocument();
  });

  it('allows adding a tag by typing and pressing Enter', () => {
    render(
      <Provider store={store}>
        <TagSelector {...mockProps} />
      </Provider>
    );

    // Type a new tag and press Enter
    const input = screen.getByPlaceholderText('Add tags (press Enter)');
    fireEvent.change(input, { target: { value: 'newTag' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    
    // Check that onTagsChange was called with a tag (lowercase in implementation)
    expect(mockProps.onTagsChange).toHaveBeenCalledWith(['newtag']);
  });

  it('allows removing a tag by clicking the delete button', () => {
    render(
      <Provider store={store}>
        <TagSelector 
          selectedTags={['api', 'testing']} 
          onTagsChange={mockProps.onTagsChange} 
        />
      </Provider>
    );

    // Click the delete button for 'api' tag
    const deleteButton = screen.getAllByRole('button', { name: /remove tag/i })[0];
    fireEvent.click(deleteButton);
    
    // Check that onTagsChange was called with the right tags
    expect(mockProps.onTagsChange).toHaveBeenCalledWith(['testing']);
  });

  it('allows removing the last tag by pressing Backspace with empty input', () => {
    render(
      <Provider store={store}>
        <TagSelector 
          selectedTags={['api', 'testing']} 
          onTagsChange={mockProps.onTagsChange} 
        />
      </Provider>
    );

    // Press Backspace with empty input
    const input = screen.getByRole('textbox');
    fireEvent.keyDown(input, { key: 'Backspace', code: 'Backspace' });
    
    // Check that onTagsChange was called with the right tags
    expect(mockProps.onTagsChange).toHaveBeenCalledWith(['api']);
  });

  // Skip test that requires scrollIntoView in jsdom environment
  it.skip('supports keyboard navigation of suggestions with arrow keys', () => {
    // This test requires DOM scrolling which isn't available in jsdom
  });
}); 