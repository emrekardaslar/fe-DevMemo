import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import TagSelector from '../../components/standups/TagSelector';

// Create a mock store
const mockStore = configureStore([]);

// Helper to render the component with the mock store
const renderWithStore = (selectedTags: string[] = [], onTagsChange = vi.fn()) => {
  const store = mockStore({
    standups: {
      standups: [
        { date: '2023-05-01', tags: ['api', 'testing', 'frontend'] },
        { date: '2023-05-02', tags: ['api', 'backend', 'database'] },
        { date: '2023-05-03', tags: ['testing', 'documentation'] }
      ]
    }
  });
  
  return {
    ...render(
      <Provider store={store}>
        <TagSelector selectedTags={selectedTags} onTagsChange={onTagsChange} />
      </Provider>
    ),
    store,
    onTagsChange
  };
};

describe('TagSelector Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders existing tags', () => {
    const mockTags = ['api', 'testing', 'frontend'];
    renderWithStore(mockTags);
    
    mockTags.forEach(tag => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  it('adds a new tag when pressing Enter', () => {
    const { onTagsChange } = renderWithStore();
    
    const input = screen.getByPlaceholderText('Add tags (press Enter)');
    fireEvent.change(input, { target: { value: 'new-tag' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    
    expect(onTagsChange).toHaveBeenCalledWith(['new-tag']);
  });

  it('adds a new tag when clicking a suggestion', () => {
    const { onTagsChange } = renderWithStore();
    
    const input = screen.getByPlaceholderText('Add tags (press Enter)');
    fireEvent.focus(input);
    
    // Click on the 'api' suggestion
    fireEvent.mouseDown(screen.getByText('api'));
    fireEvent.click(screen.getByText('api'));
    
    expect(onTagsChange).toHaveBeenCalledWith(['api']);
  });

  it('removes a tag when clicking the remove button', () => {
    const mockTags = ['api', 'testing'];
    const { onTagsChange } = renderWithStore(mockTags);
    
    const deleteButton = screen.getAllByRole('button', { name: /remove tag/i })[0];
    fireEvent.click(deleteButton);
    
    expect(onTagsChange).toHaveBeenCalledWith(['testing']);
  });

  it('does not add empty tags', () => {
    const { onTagsChange } = renderWithStore();
    
    const input = screen.getByPlaceholderText('Add tags (press Enter)');
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    
    expect(onTagsChange).not.toHaveBeenCalled();
  });

  it('does not add duplicate tags', () => {
    const mockTags = ['api'];
    const { onTagsChange } = renderWithStore(mockTags);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'api' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    
    expect(onTagsChange).not.toHaveBeenCalled();
  });

  it('trims whitespace from tags', () => {
    const { onTagsChange } = renderWithStore();
    
    const input = screen.getByPlaceholderText('Add tags (press Enter)');
    fireEvent.change(input, { target: { value: '  new-tag  ' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    
    expect(onTagsChange).toHaveBeenCalledWith(['new-tag']);
  });

  it('shows suggestions when input is focused', () => {
    renderWithStore();
    
    const input = screen.getByPlaceholderText('Add tags (press Enter)');
    fireEvent.focus(input);
    
    expect(screen.getByText('api')).toBeInTheDocument();
    expect(screen.getByText('testing')).toBeInTheDocument();
    expect(screen.getByText('frontend')).toBeInTheDocument();
  });

  it('filters suggestions based on input', () => {
    renderWithStore();
    
    const input = screen.getByPlaceholderText('Add tags (press Enter)');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'te' } });
    
    expect(screen.getByText('testing')).toBeInTheDocument();
    expect(screen.queryByText('api')).not.toBeInTheDocument();
  });
}); 