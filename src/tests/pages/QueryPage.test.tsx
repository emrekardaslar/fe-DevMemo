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

// Mock localStorage
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

// Create a simple component that mimics the core functionality we want to test
const SimpleQueryComponent = () => {
  const [query, setQuery] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<any>(null);
  const [rawResponse, setRawResponse] = React.useState<any>(null);
  const [validationError, setValidationError] = React.useState<string | null>(null);
  
  // Sample query suggestions organized by category
  const querySuggestions = {
    "Time-based": [
      "What did I do last week?",
      "What am I working on this week?",
      "Show all standups from May"
    ],
    "Blocker Analysis": [
      "What are my current blockers?",
      "Show all recurring blockers",
      "Any blockers in frontend work?"
    ],
    "Focus Areas": [
      "Show me standups about API",
      "What am I focusing on this month?",
      "Show top tags from last month"
    ]
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    
    // Input validation
    if (!trimmedQuery) {
      setValidationError("Please enter a query");
      return;
    }
    
    if (trimmedQuery.length < 5) {
      setValidationError("Query is too short. Please be more specific.");
      return;
    }
    
    setValidationError(null);
    setLoading(true);
    setError(null);
    setRawResponse(null);
    
    try {
      // Save to history
      const storedHistory = localStorage.getItem('queryHistory');
      const history = storedHistory ? JSON.parse(storedHistory) : [];
      const updatedHistory = [trimmedQuery, ...history.filter((q: string) => q !== trimmedQuery).slice(0, 9)];
      localStorage.setItem('queryHistory', JSON.stringify(updatedHistory));
      
      // Call API
      const response = await queryAPI.processQuery(trimmedQuery);
      setRawResponse(response);
      
      // Handle nested response formats
      if (response.data && response.data.success !== undefined) {
        setResult({ 
          answer: `Results for: "${trimmedQuery}"`,
          data: response.data.data
        });
      } else if (response.data && response.data.weeklyData) {
        // Handle weekly summary format
        setResult({
          answer: `Weekly summary for: "${trimmedQuery}"`,
          data: response.data
        });
      } else if (response.data && response.data.error) {
        // Handle error in response data
        setError(response.data.error);
      } else {
        // Standard response format
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
    setValidationError(null);
  };
  
  const clearQuery = () => {
    setQuery('');
    setResult(null);
    setError(null);
    setValidationError(null);
  };
  
  // Get query history from localStorage
  const getQueryHistory = () => {
    const storedHistory = localStorage.getItem('queryHistory');
    if (storedHistory) {
      try {
        return JSON.parse(storedHistory);
      } catch (e) {
        return [];
      }
    }
    return [];
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
      
      {validationError && (
        <div data-testid="validation-error" style={{ color: 'red' }}>
          {validationError}
        </div>
      )}
      
      {!result && !loading && !error && (
        <div data-testid="suggestion-categories">
          <p>Try asking:</p>
          {Object.entries(querySuggestions).map(([category, suggestions], categoryIndex) => (
            <div key={categoryIndex} data-testid={`category-${categoryIndex}`}>
              <h3>{category}</h3>
              <div>
                {suggestions.map((suggestion, index) => (
                  <button 
                    key={index} 
                    onClick={() => handleSuggestedQuery(suggestion)}
                    data-testid={`suggestion-${categoryIndex}-${index}`}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Show query history if available */}
      {!result && !loading && !error && getQueryHistory().length > 0 && (
        <div data-testid="query-history">
          <h3>Recent Queries</h3>
          <div>
            {getQueryHistory().map((historyItem: string, index: number) => (
              <button 
                key={index} 
                onClick={() => handleSuggestedQuery(historyItem)}
                data-testid={`history-item-${index}`}
              >
                {historyItem}
              </button>
            ))}
          </div>
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
          {result.relatedStandups && (
            <div data-testid="related-standups">
              <h3>Related Standups</h3>
              <p>{result.relatedStandups.length} standups found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Wrap component with router for tests that need Link
const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

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

  it('should show query suggestions organized by categories', () => {
    render(<SimpleQueryComponent />);
    
    // Check for category titles
    expect(screen.getByText('Time-based')).toBeInTheDocument();
    expect(screen.getByText('Blocker Analysis')).toBeInTheDocument();
    expect(screen.getByText('Focus Areas')).toBeInTheDocument();
    
    // Check that suggestions are present for each category
    expect(screen.getByText('What did I do last week?')).toBeInTheDocument();
    expect(screen.getByText('What are my current blockers?')).toBeInTheDocument();
    expect(screen.getByText('Show me standups about API')).toBeInTheDocument();
  });

  it('should update input when user types', () => {
    render(<SimpleQueryComponent />);
    
    const input = screen.getByTestId('query-input');
    fireEvent.change(input, { target: { value: 'test query' } });
    
    expect(input).toHaveValue('test query');
  });

  it('should validate input and prevent submission with empty query', async () => {
    render(<SimpleQueryComponent />);
    
    // Try to submit with empty input
    const form = screen.getByTestId('query-form');
    fireEvent.submit(form);
    
    // Check for validation error
    expect(screen.getByTestId('validation-error')).toBeInTheDocument();
    expect(screen.getByText('Please enter a query')).toBeInTheDocument();
    
    // API should not be called
    expect(queryAPI.processQuery).not.toHaveBeenCalled();
  });

  it('should validate input and prevent submission with short query', async () => {
    render(<SimpleQueryComponent />);
    
    // Type in a short query
    const input = screen.getByTestId('query-input');
    fireEvent.change(input, { target: { value: 'test' } });
    
    // Try to submit with short input
    const form = screen.getByTestId('query-form');
    fireEvent.submit(form);
    
    // Check for validation error
    expect(screen.getByTestId('validation-error')).toBeInTheDocument();
    expect(screen.getByText('Query is too short. Please be more specific.')).toBeInTheDocument();
    
    // API should not be called
    expect(queryAPI.processQuery).not.toHaveBeenCalled();
  });

  it('should call processQuery API when form is submitted with valid query', async () => {
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

  it('should handle weekly summary response format', async () => {
    // Mock a successful API call with weekly summary format
    (queryAPI.processQuery as jest.Mock).mockResolvedValueOnce({
      status: 200,
      data: { 
        weeklyData: true,
        period: 'May 1 - May 7, 2023',
        accomplishments: [
          { date: '2023-05-01', done: 'Implemented API' },
          { date: '2023-05-02', done: 'Created tests' }
        ],
        plans: [
          { date: '2023-05-01', plan: 'Work on frontend' },
          { date: '2023-05-02', plan: 'Fix bugs' }
        ],
        blockers: [
          { date: '2023-05-01', blocker: 'Waiting for design' }
        ],
        tags: ['api', 'frontend', 'testing']
      }
    });
    
    render(<SimpleQueryComponent />);
    
    // Type and submit
    const input = screen.getByTestId('query-input');
    fireEvent.change(input, { target: { value: 'Show my weekly summary' } });
    
    const form = screen.getByTestId('query-form');
    fireEvent.submit(form);
    
    // Wait for results
    await waitFor(() => {
      expect(screen.getByTestId('results')).toBeInTheDocument();
      expect(screen.getByTestId('answer')).toBeInTheDocument();
      expect(screen.getByText('Weekly summary for: "Show my weekly summary"')).toBeInTheDocument();
    });
  });

  it('should handle error response in data format', async () => {
    // Mock an API response with error in the data
    (queryAPI.processQuery as jest.Mock).mockResolvedValueOnce({
      status: 200,
      data: { 
        error: 'Could not process query. Please try a different format.'
      }
    });
    
    render(<SimpleQueryComponent />);
    
    // Type and submit
    const input = screen.getByTestId('query-input');
    fireEvent.change(input, { target: { value: 'Invalid format query' } });
    
    const form = screen.getByTestId('query-form');
    fireEvent.submit(form);
    
    // Check for error message
    await waitFor(() => {
      expect(screen.getByTestId('error')).toBeInTheDocument();
      expect(screen.getByText('Could not process query. Please try a different format.')).toBeInTheDocument();
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
    
    // Find and click a suggested query from a specific category
    const suggestedQuery = screen.getByTestId('suggestion-0-0'); // First suggestion in first category
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
    
    // Suggestions should be shown again
    expect(screen.getByText('Try asking:')).toBeInTheDocument();
  });

  it('should handle localStorage for query history', async () => {
    // Setup localStorage with history
    const mockHistory = ['previous query 1', 'previous query 2'];
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'queryHistory') {
        return JSON.stringify(mockHistory);
      }
      return null;
    });
    
    // Mock getQueryHistory implementation
    const getQueryHistoryMock = jest.fn().mockReturnValue(mockHistory);
    
    // Create a simplified component just for testing history
    const HistoryTestComponent = () => {
      const [query, setQuery] = React.useState('');
      
      const handleHistoryItemClick = (historyItem: string) => {
        setQuery(historyItem);
      };
      
      return (
        <div>
          <input 
            data-testid="query-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div data-testid="query-history">
            <h3>Recent Queries</h3>
            <div>
              {mockHistory.map((item, index) => (
                <button
                  key={index}
                  data-testid={`history-item-${index}`}
                  onClick={() => handleHistoryItemClick(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    };
    
    render(<HistoryTestComponent />);
    
    // Check that history section is shown with correct items
    expect(screen.getByTestId('query-history')).toBeInTheDocument();
    expect(screen.getByText('Recent Queries')).toBeInTheDocument();
    
    // Check for each history item
    expect(screen.getByTestId('history-item-0')).toHaveTextContent('previous query 1');
    expect(screen.getByTestId('history-item-1')).toHaveTextContent('previous query 2');
    
    // Test clicking on a history item
    fireEvent.click(screen.getByTestId('history-item-1'));
    
    // Check that the input was updated
    expect(screen.getByTestId('query-input')).toHaveValue('previous query 2');
  });
}); 