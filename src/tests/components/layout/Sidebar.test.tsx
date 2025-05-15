import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from '../../../components/layout/Sidebar';

// Wrapper to provide router context
const renderWithRouter = (ui: React.ReactNode) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Sidebar Component', () => {
  it('renders the Sidebar with all navigation links', () => {
    renderWithRouter(<Sidebar />);
    
    // Check all navigation links are present
    const expectedLinks = [
      { text: 'Dashboard', href: '/' },
      { text: 'All Standups', href: '/standups' },
      { text: 'New Standup', href: '/standups/new' },
      { text: 'Weekly Summary', href: '/weekly-summary' },
      { text: 'Blocker Analysis', href: '/blocker-analysis' },
      { text: 'Tags', href: '/tags' },
      { text: 'Search', href: '/search' },
      { text: 'Natural Language Query', href: '/query' }
    ];
    
    expectedLinks.forEach(link => {
      const linkElement = screen.getByText(link.text);
      expect(linkElement).toBeInTheDocument();
      expect(linkElement.closest('a')).toHaveAttribute('href', link.href);
    });
  });
  
  it('has the correct icons for each navigation item', () => {
    renderWithRouter(<Sidebar />);
    
    // Check for specific icons
    const expectedIcons = [
      '📊', // Dashboard
      '📝', // All Standups
      '➕', // New Standup
      '📅', // Weekly Summary
      '🚫', // Blocker Analysis
      '🏷️', // Tags
      '🔍', // Search
      '💬'  // Natural Language Query
    ];
    
    expectedIcons.forEach(icon => {
      expect(screen.getByText(icon)).toBeInTheDocument();
    });
  });

  it('applies correct styling to the sidebar', () => {
    const { container } = renderWithRouter(<Sidebar />);
    
    // The firstChild is a fragment containing Overlay and SidebarContainer
    // So we need to look for the aside tag specifically
    const sidebarElement = container.querySelector('aside');
    expect(sidebarElement).toBeInTheDocument();
    
    // Check the list is unstyled (no bullets)
    const listElement = container.querySelector('ul');
    expect(listElement).toBeInTheDocument();
  });
}); 