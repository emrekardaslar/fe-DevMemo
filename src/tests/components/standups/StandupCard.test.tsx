import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import StandupCard from '../../../components/standups/StandupCard';
import { Standup } from '../../../redux/standups/types';
import { vi } from 'vitest';

// Needed to render Link components
const renderWithRouter = (ui: React.ReactNode) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('StandupCard Component', () => {
  // Mock standup data for testing
  const mockStandup: Standup = {
    date: '2023-05-01',
    yesterday: 'Worked on API endpoints',
    today: 'Writing tests',
    blockers: 'None',
    tags: ['api', 'testing'],
    mood: 4,
    productivity: 5,
    isHighlight: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Mock handler functions
  const mockToggleHighlight = vi.fn();
  const mockDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders standup card with correct content', () => {
    renderWithRouter(
      <StandupCard 
        standup={mockStandup} 
        onToggleHighlight={mockToggleHighlight} 
        onDelete={mockDelete} 
      />
    );

    // Check date is rendered
    expect(screen.getByText(/Monday, May 1, 2023/i)).toBeInTheDocument();
    
    // Check content sections
    expect(screen.getByText('Yesterday')).toBeInTheDocument();
    expect(screen.getByText('Worked on API endpoints')).toBeInTheDocument();
    
    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByText('Writing tests')).toBeInTheDocument();
    
    expect(screen.getByText('Blockers')).toBeInTheDocument();
    expect(screen.getByText('None')).toBeInTheDocument();
    
    // Check tags
    expect(screen.getByText('#api')).toBeInTheDocument();
    expect(screen.getByText('#testing')).toBeInTheDocument();
    
    // Check mood and productivity indicators
    expect(screen.getByText(/Mood:/i)).toBeInTheDocument();
    expect(screen.getByText(/Productivity:/i)).toBeInTheDocument();
  });

  it('calls onToggleHighlight when highlight button is clicked', () => {
    renderWithRouter(
      <StandupCard 
        standup={mockStandup} 
        onToggleHighlight={mockToggleHighlight} 
        onDelete={mockDelete} 
      />
    );

    // Find and click the highlight button
    const highlightButton = screen.getByTitle('Highlight');
    fireEvent.click(highlightButton);
    
    // Check if the handler was called with the correct date
    expect(mockToggleHighlight).toHaveBeenCalledWith(mockStandup.date);
  });

  it('calls onDelete when delete button is clicked', () => {
    renderWithRouter(
      <StandupCard 
        standup={mockStandup} 
        onToggleHighlight={mockToggleHighlight} 
        onDelete={mockDelete} 
      />
    );

    // Find and click the delete button
    const deleteButton = screen.getByTitle('Delete');
    fireEvent.click(deleteButton);
    
    // Check if the handler was called with the correct date
    expect(mockDelete).toHaveBeenCalledWith(mockStandup.date);
  });

  it('renders a highlighted standup with correct styling', () => {
    // Create a highlighted standup
    const highlightedStandup = { ...mockStandup, isHighlight: true };
    
    const { container } = renderWithRouter(
      <StandupCard 
        standup={highlightedStandup} 
        onToggleHighlight={mockToggleHighlight} 
        onDelete={mockDelete} 
      />
    );
    
    // Find and check the highlight button shows the filled star
    const highlightButton = screen.getByTitle('Remove highlight');
    expect(highlightButton).toHaveTextContent('⭐');
    
    // Check that the first div in the container (Card component) has highlight styling
    // This is a way to test styled-components
    const cardElement = container.firstChild;
    expect(cardElement).toHaveStyle('border-left: 4px solid var(--warning-color)');
  });
}); 