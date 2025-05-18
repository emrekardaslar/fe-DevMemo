import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Header from '../../../components/layout/Header';

// Create mock store
const mockStore = configureStore([]);
const initialState = {
  auth: {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null
  }
};

// Wrapper to provide router and redux context
const renderWithRouterAndRedux = (ui: React.ReactNode, storeState = initialState) => {
  const store = mockStore(storeState);
  return render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  );
};

describe('Header Component', () => {
  it('renders the Header with logo and navigation links', () => {
    renderWithRouterAndRedux(<Header />);
    
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
    renderWithRouterAndRedux(<Header />);
    
    // Check for the logo icon
    const logoIcon = screen.getByText('📝');
    expect(logoIcon).toBeInTheDocument();
  });

  it('applies correct styling to the header', () => {
    const { container } = renderWithRouterAndRedux(<Header />);
    
    // Check the header element for styling attributes
    const headerElement = container.firstChild;
    
    // We could check for styled components class names or other attributes,
    // but for the basic test we'll just check the element type
    expect(headerElement?.nodeName).toBe('HEADER');
  });
}); 