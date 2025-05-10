import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Header from '../../../components/layout/Header';

// Wrapper to provide router context
const renderWithRouter = (ui: React.ReactNode) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Header Component', () => {
  it('renders the Header with logo and navigation links', () => {
    renderWithRouter(<Header />);
    
    // Check for logo
    const logo = screen.getByText('StandupSync');
    expect(logo).toBeInTheDocument();
    expect(logo.closest('a')).toHaveAttribute('href', '/');
    
    // Check for navigation links
    const newStandupLink = screen.getByText('New Standup');
    expect(newStandupLink).toBeInTheDocument();
    expect(newStandupLink).toHaveAttribute('href', '/standups/new');
    
    const queryLink = screen.getByText('Query');
    expect(queryLink).toBeInTheDocument();
    expect(queryLink).toHaveAttribute('href', '/query');
  });
  
  it('has the correct logo icon', () => {
    renderWithRouter(<Header />);
    
    // Check for the logo icon
    const logoIcon = screen.getByText('📝');
    expect(logoIcon).toBeInTheDocument();
  });

  it('applies correct styling to the header', () => {
    const { container } = renderWithRouter(<Header />);
    
    // Check the header element for styling attributes
    const headerElement = container.firstChild;
    
    // We could check for styled components class names or other attributes,
    // but for the basic test we'll just check the element type
    expect(headerElement?.nodeName).toBe('HEADER');
  });
}); 