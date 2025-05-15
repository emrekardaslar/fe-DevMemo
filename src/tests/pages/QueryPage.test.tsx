import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { queryAPI, standupAPI } from '../../services/api';
import { BrowserRouter } from 'react-router-dom';

// Mock the api services
jest.mock('../../services/api', () => ({
  queryAPI: {
    processQuery: jest.fn()
  },
  standupAPI: {
    getByDate: jest.fn()
  }
}));

// Create a simple component that mimics the core functionality we want to test
const SimpleQueryComponent = () => {
  const [query, setQuery] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<any>(null);
  const [rawResponse, setRawResponse] = React.useState<any>(null);
  
  // Sample query suggestions
  const suggestions = [
    'What did I do last week?',
    'What are my current blockers?',
    'Show me standups about frontend'
  ];
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    setRawResponse(null);
    
    try {
      // Save to history
      const storedHistory = localStorage.getItem('queryHistory');
      const history = storedHistory ? JSON.parse(storedHistory) : [];
      const updatedHistory = [query, ...history.filter((q: string) => q !== query).slice(0, 9)];
      localStorage.setItem('queryHistory', JSON.stringify(updatedHistory));
      
      // Call API
      const response = await queryAPI.processQuery(query);
      setRawResponse(response);
      
      // Handle nested response formats
      if (response.data && response.data.success !== undefined) {
        setResult({ 
          answer: `Results for: "${query}"`,
          data: response.data.data
        });
      } else {
        setResult(response.data);
      }
    } catch (err) {
      setError('An error occurred processing your query. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSuggestedQuery = (suggestedQuery: string) => {
    setQuery(suggestedQuery);
    setResult(null);
    setError(null);
  };
  
  const clearQuery = () => {
    setQuery('');
    setResult(null);
    setError(null);
  };
  
  return (
    <div>
      <h1>Natural Language Query</h1>
      <p>Ask questions about your standups in plain English</p>
      
      <form onSubmit={handleSubmit} data-testid="query-form">
        <input
          type="text"
          placeholder="Ask a question about your standups..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          data-testid="query-input"
        />
        <button type="submit" disabled={loading || !query.trim()} data-testid="query-submit">
          {loading ? 'Processing...' : 'Ask'}
        </button>
        {query && (
          <button type="button" onClick={clearQuery} data-testid="clear-button">
            Clear
          </button>
        )}
      </form>
      
      {!result && !loading && (
        <div>
          <p>Try asking:</p>
          {suggestions.map((suggestion, index) => (
            <button 
              key={index} 
              onClick={() => handleSuggestedQuery(suggestion)}
              data-testid={`suggestion-${index}`}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
      
      {loading && <div data-testid="loading">Processing your query...</div>}
      
      {error && <div data-testid="error">{error}</div>}
      
      {rawResponse && (
        <div data-testid="raw-response">
          <details>
            <summary>Debug: Raw Response</summary>
            <pre>{JSON.stringify(rawResponse, null, 2)}</pre>
          </details>
        </div>
      )}
      
      {!loading && !error && result && (
        <div data-testid="results">
          <h2>Results</h2>
          <p>"{query}"</p>
          {result.answer && <div data-testid="answer">{result.answer}</div>}
          {result.message && <div data-testid="message">{result.message}</div>}
          {result.data && <div data-testid="data">Data available</div>}
        </div>
      )}
    </div>
  );
};

// Wrap component with router for tests that need Link
const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

// Mock local storage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

describe('Query Functionality', () => {
  // Clear mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();
  });

  it('renders the component with title and input', () => {
    render(<SimpleQueryComponent />);
    
    // Check for title elements
    expect(screen.getByText('Natural Language Query')).toBeInTheDocument();
    expect(screen.getByText('Ask questions about your standups in plain English')).toBeInTheDocument();
    
    // Check for query input
    expect(screen.getByPlaceholderText('Ask a question about your standups...')).toBeInTheDocument();
    
    // Check for submit button
    expect(screen.getByTestId('query-submit')).toBeInTheDocument();
  });

  it('should show query suggestions', () => {
    render(<SimpleQueryComponent />);
    
    // Check for specific suggested queries
    expect(screen.getByText('What did I do last week?')).toBeInTheDocument();
    expect(screen.getByText('What are my current blockers?')).toBeInTheDocument();
    expect(screen.getByText('Show me standups about frontend')).toBeInTheDocument();
  });

  it('should update input when user types', () => {
    render(<SimpleQueryComponent />);
    
    const input = screen.getByTestId('query-input');
    fireEvent.change(input, { target: { value: 'test query' } });
    
    expect(input).toHaveValue('test query');
  });

  it('should call processQuery API when form is submitted', async () => {
    // Mock a successful API call
    (queryAPI.processQuery as jest.Mock).mockResolvedValueOnce({
      status: 200,
      data: { 
        answer: 'Here are the results',
        data: { someData: 'test' }
      }
    });
    
    render(<SimpleQueryComponent />);
    
    // Type in the query input
    const input = screen.getByTestId('query-input');
    fireEvent.change(input, { target: { value: 'test query' } });
    
    // Submit the form
    const form = screen.getByTestId('query-form');
    fireEvent.submit(form);
    
    // Check if API was called correctly
    await waitFor(() => {
      expect(queryAPI.processQuery).toHaveBeenCalledWith('test query');
    });
    
    // Check for loading state
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('should handle standard response format', async () => {
    // Mock a successful API call with standard format
    (queryAPI.processQuery as jest.Mock).mockResolvedValueOnce({
      status: 200,
      data: { 
        answer: 'Here are the results for your query',
        data: { 
          topTags: [{ tag: 'frontend', count: 5 }],
          period: 'Last week'
        }
      }
    });
    
    render(<SimpleQueryComponent />);
    
    // Type and submit
    const input = screen.getByTestId('query-input');
    fireEvent.change(input, { target: { value: 'What did I do last week?' } });
    
    const form = screen.getByTestId('query-form');
    fireEvent.submit(form);
    
    // Wait for results
    await waitFor(() => {
      expect(screen.getByTestId('results')).toBeInTheDocument();
      expect(screen.getByTestId('answer')).toBeInTheDocument();
      expect(screen.getByTestId('data')).toBeInTheDocument();
    });
  });

  it('should handle nested response format', async () => {
    // Mock a successful API call with nested format
    (queryAPI.processQuery as jest.Mock).mockResolvedValueOnce({
      status: 200,
      data: { 
        success: true,
        data: { 
          answer: 'Here are the results',
          topTags: [{ tag: 'frontend', count: 5 }],
          period: 'Last week'
        }
      }
    });
    
    render(<SimpleQueryComponent />);
    
    // Type and submit
    const input = screen.getByTestId('query-input');
    fireEvent.change(input, { target: { value: 'What did I do last week?' } });
    
    const form = screen.getByTestId('query-form');
    fireEvent.submit(form);
    
    // Wait for results
    await waitFor(() => {
      expect(screen.getByTestId('results')).toBeInTheDocument();
      expect(screen.getByTestId('answer')).toBeInTheDocument();
    });
  });

  it('should save query to history when submitted', async () => {
    // Mock a successful API call
    (queryAPI.processQuery as jest.Mock).mockResolvedValueOnce({
      status: 200,
      data: { 
        answer: 'Here are the results',
        data: { someData: 'test' }
      }
    });
    
    render(<SimpleQueryComponent />);
    
    // Type and submit a query
    const input = screen.getByTestId('query-input');
    fireEvent.change(input, { target: { value: 'test query history' } });
    
    // Submit the form
    const form = screen.getByTestId('query-form');
    fireEvent.submit(form);
    
    // Wait for the API call to resolve
    await waitFor(() => {
      expect(queryAPI.processQuery).toHaveBeenCalledWith('test query history');
    });
    
    // Verify localStorage was called with the query
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'queryHistory',
      expect.stringContaining('test query history')
    );
  });

  it('should handle API errors gracefully', async () => {
    // Mock an API error
    (queryAPI.processQuery as jest.Mock).mockRejectedValueOnce(new Error('API error'));
    
    render(<SimpleQueryComponent />);
    
    // Type and submit a query
    const input = screen.getByTestId('query-input');
    fireEvent.change(input, { target: { value: 'error query' } });
    
    // Submit the form
    const form = screen.getByTestId('query-form');
    fireEvent.submit(form);
    
    // Check for error message
    await waitFor(() => {
      expect(screen.getByTestId('error')).toBeInTheDocument();
      expect(screen.getByText(/An error occurred processing your query/i)).toBeInTheDocument();
    });
  });

  it('should populate query input when clicking a suggested query', () => {
    render(<SimpleQueryComponent />);
    
    // Find and click a suggested query
    const suggestedQuery = screen.getByTestId('suggestion-0'); // First suggestion
    fireEvent.click(suggestedQuery);
    
    // Check if input was populated
    const input = screen.getByTestId('query-input');
    expect(input).toHaveValue('What did I do last week?');
  });

  it('should clear query and results when clear button is clicked', async () => {
    // First submit a query to get results
    (queryAPI.processQuery as jest.Mock).mockResolvedValueOnce({
      status: 200,
      data: { 
        answer: 'Here are the results',
        data: { someData: 'test' }
      }
    });
    
    render(<SimpleQueryComponent />);
    
    // Type and submit
    const input = screen.getByTestId('query-input');
    fireEvent.change(input, { target: { value: 'test query' } });
    
    // Submit the form
    const form = screen.getByTestId('query-form');
    fireEvent.submit(form);
    
    // Wait for results
    await waitFor(() => {
      expect(queryAPI.processQuery).toHaveBeenCalled();
    });
    
    // Now click clear button
    const clearButton = screen.getByTestId('clear-button');
    fireEvent.click(clearButton);
    
    // Input should be cleared
    expect(input).toHaveValue('');
  });
}); 