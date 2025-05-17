import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { queryAPI, standupAPI } from '../services/api';
import { Standup } from '../redux/standups/types';
import { FiSearch, FiX, FiChevronRight, FiAlertCircle, FiInfo, FiTag, FiBarChart, FiCalendar, FiClock } from 'react-icons/fi';

const PageContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 1rem;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  margin: 0 0 0.5rem 0;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0;
`;

const QueryContainer = styled.div`
  margin-bottom: 2.5rem;
`;

const QueryForm = styled.form`
  display: flex;
  margin-top: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
`;

const QueryInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid var(--border-color);
  border-right: none;
  border-radius: 8px 0 0 8px;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: inset 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const QueryButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 0 8px 8px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: var(--primary-dark);
  }
  
  &:disabled {
    background-color: var(--text-secondary);
    cursor: not-allowed;
  }
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  color: var(--text-secondary);
  margin-left: 1rem;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  &:hover {
    color: var(--primary-color);
    text-decoration: underline;
  }
`;

const QueryCategoriesContainer = styled.div`
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`;

const QueryCategory = styled.div`
  background-color: var(--card-background);
  padding: 1.25rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const CategoryTitle = styled.div`
  font-size: 1rem;
  margin: 0 0 0.75rem 0;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
`;

const SuggestedQueries = styled.div`
  margin-top: 1rem;
`;

const SuggestedQueryTitle = styled.p`
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0 0 0.5rem 0;
`;

const SuggestedQueryButton = styled.button`
  background: none;
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 0.35rem 0.75rem;
  font-size: 0.85rem;
  color: var(--text-color);
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    border-color: var(--primary-color);
    color: var(--primary-color);
  }
`;

const ResultsContainer = styled.div`
  background-color: var(--card-background);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;
  animation: fadeIn 0.3s ease-in-out;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
`;

const ResultsTitle = styled.h2`
  font-size: 1.25rem;
  margin: 0;
`;

const QueryText = styled.p`
  font-style: italic;
  color: var(--text-secondary);
  margin: 0;
  background-color: rgba(0, 0, 0, 0.05);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ResultsContent = styled.div`
  line-height: 1.6;
`;

const AnswerContainer = styled.div`
  background-color: rgba(52, 152, 219, 0.1);
  border-left: 3px solid var(--primary-color);
  padding: 1rem;
  margin: 1rem 0;
  font-size: 1.1rem;
`;

const StandupsList = styled.div`
  margin-top: 1.5rem;
`;

const StandupItem = styled.div`
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: white;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const StandupDate = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const StandupHighlight = styled.span`
  background-color: rgba(241, 196, 15, 0.1);
  color: #f39c12;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 20px;
  font-weight: normal;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const StandupTags = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
`;

const StandupTag = styled.span`
  background-color: rgba(52, 152, 219, 0.1);
  color: var(--primary-color);
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const StandupContent = styled.div`
  margin: 0.5rem 0;
`;

const StandupField = styled.div`
  margin-bottom: 0.75rem;
  
  h4 {
    margin: 0 0 0.25rem 0;
    font-size: 0.9rem;
    color: var(--text-secondary);
  }
  
  p {
    margin: 0;
    white-space: pre-line;
  }
`;

const StandupLink = styled(Link)`
  display: inline-flex;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: var(--primary-color);
  text-decoration: none;
  align-items: center;
  gap: 0.25rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: var(--primary-color);
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 1.5rem;
  color: var(--error-color);
  background-color: rgba(231, 76, 60, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 1rem 0;
`;

const NoResultsMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
`;

const TabsContainer = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 0.75rem 1.25rem;
  background: none;
  border: none;
  border-bottom: 2px solid ${props => props.active ? 'var(--primary-color)' : 'transparent'};
  color: ${props => props.active ? 'var(--primary-color)' : 'var(--text-color)'};
  font-weight: ${props => props.active ? '500' : 'normal'};
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    border-bottom-color: ${props => props.active ? 'var(--primary-color)' : 'var(--border-color)'};
  }
`;

const SummaryCard = styled.div`
  background-color: white;
  padding: 1.25rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid var(--border-color);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const SummaryHeader = styled.div`
  font-weight: 500;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const QueryHistoryContainer = styled.div`
  margin-top: 1.5rem;
`;

const QueryHistoryTitle = styled.h3`
  font-size: 1rem;
  margin: 0 0 0.75rem 0;
`;

const QueryHistoryList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const DataVisualization = styled.div`
  margin: 1.5rem 0;
  background-color: white;
  padding: 1.25rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
`;

const VisualizationTitle = styled.h3`
  font-size: 1rem;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TagCloud = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1rem 0;
`;

const TagCloudItem = styled.div<{ size: number }>`
  font-size: ${props => 0.7 + (props.size * 0.05)}rem;
  background-color: rgba(52, 152, 219, 0.1);
  color: var(--primary-color);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  transition: all 0.2s;
  cursor: pointer;
  
  &:hover {
    background-color: rgba(52, 152, 219, 0.2);
    transform: scale(1.05);
  }
`;

const TipsContainer = styled.div`
  background-color: rgba(46, 204, 113, 0.1);
  border-left: 3px solid #2ecc71;
  padding: 1rem;
  margin: 1rem 0;
  font-size: 0.9rem;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
`;

interface QueryResult {
  answer?: string;
  message?: string;
  relatedStandups?: string[];
  data?: any;
  examples?: string[];
}

interface ProcessedStandup extends Standup {
  formattedDate?: string;
}

const QueryPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<QueryResult | null>(null);
  const [rawResponse, setRawResponse] = useState<any>(null); // Store raw response for debugging
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [relatedStandups, setRelatedStandups] = useState<ProcessedStandup[]>([]);
  const [activeTab, setActiveTab] = useState('results');
  const [queryHistory, setQueryHistory] = useState<string[]>([]);
  
  // Get query history from localStorage on mount
  useEffect(() => {
    const storedHistory = localStorage.getItem('queryHistory');
    if (storedHistory) {
      try {
        setQueryHistory(JSON.parse(storedHistory));
      } catch (e) {
        console.error('Failed to parse query history:', e);
      }
    }
  }, []);

  // Categories of suggested queries with icons
  const querySuggestions = {
    "Time-based": [
      "What did I do last week?",
      "What am I working on this week?",
      "What tasks did I complete in April?"
    ],
    "Blocker Analysis": [
      "What are my current blockers?",
      "Show all recurring blockers",
      "Any blockers related to API?"
    ],
    "Tag-based": [
      "Show me standups about frontend",
      "Find entries tagged with backend",
      "What tasks involve database work?"
    ],
    "Performance": [
      "What were my highlights last month?",
      "Show days with high productivity",
      "What are my most productive days?"
    ]
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Time-based":
        return <FiClock />;
      case "Blocker Analysis":
        return <FiAlertCircle />;
      case "Tag-based":
        return <FiTag />;
      case "Performance":
        return <FiBarChart />;
      default:
        return <FiInfo />;
    }
  };
  
  // Fetch related standups
  useEffect(() => {
    const fetchStandups = async (dates: string[]) => {
      try {
        const standups: ProcessedStandup[] = await Promise.all(
          dates.map(async (date) => {
            const response = await standupAPI.getByDate(date);
            const standup = response.data;
            
            // Format the date for display
            const formattedDate = new Date(date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
            
            return { ...standup, formattedDate };
          })
        );
        
        setRelatedStandups(standups);
      } catch (error) {
        console.error('Error fetching related standups:', error);
      }
    };
    
    if (result?.relatedStandups && result.relatedStandups.length > 0) {
      fetchStandups(result.relatedStandups);
    }
  }, [result]);

  // Save query to history
  const saveQueryToHistory = (queryText: string) => {
    const updatedHistory = [
      queryText,
      ...queryHistory.filter(q => q !== queryText).slice(0, 9) // Keep only last 10 unique queries
    ];
    setQueryHistory(updatedHistory);
    localStorage.setItem('queryHistory', JSON.stringify(updatedHistory));
  };
  
  const handleSubmitQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    setResult(null);
    setRawResponse(null);
    setRelatedStandups([]);
    setActiveTab('results');
    
    // Save query to history
    saveQueryToHistory(query);
    
    try {
      const response = await queryAPI.processQuery(query);
      
      // Store the raw response for debugging
      setRawResponse(response);
      
      // Extract the actual data from the nested response
      const responseData = response.data;
      
      // Check if we have a success field in the response
      if (responseData && responseData.success !== undefined) {
        // This is the backend API response format where data is nested
        
        const actualData = responseData.data;
        const result = {
          answer: `Here are the results for your query about "${query}"`,
          data: actualData
        };
        
        setResult(result);
      } else {
        // Direct response format
        setResult(responseData);
      }
      
    } catch (error) {
      setError('An error occurred processing your query. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSuggestedQuery = (suggestedQuery: string) => {
    setQuery(suggestedQuery);
    setResult(null);
    setError(null);
    setRelatedStandups([]);
  };
  
  const clearQuery = () => {
    setQuery('');
    setResult(null);
    setError(null);
    setRelatedStandups([]);
  };
  
  // Extract tags from data for visualization
  const extractTags = () => {
    if (!result || !result.data) return [];
    
    // For weekly summary
    if (result.data.period && result.data.tags) {
      // Convert string array to tag objects with count
      const tags = result.data.tags || [];
      return tags.map((tag: string) => ({ tag, count: 1 }));
    }
    
    // For monthly summary
    if (result.data.topTags) {
      return result.data.topTags;
    }
    
    // For standups
    if (relatedStandups.length > 0) {
      const tagCount: Record<string, number> = {};
      relatedStandups.forEach(standup => {
        standup.tags.forEach(tag => {
          tagCount[tag] = (tagCount[tag] || 0) + 1;
        });
      });
      
      return Object.entries(tagCount)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count);
    }
    
    // If data has tags property that's an array of strings
    if (result.data.tags && Array.isArray(result.data.tags)) {
      const tagCount: Record<string, number> = {};
      result.data.tags.forEach((tag: string) => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
      
      return Object.entries(tagCount)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count);
    }
    
    return [];
  };
  
  // Render the summary data based on type
  const renderSummaryData = () => {
    // Direct data access - this handles when data is directly on result object (not nested)
    const data = result?.data || {};
    
    // Weekly summary
    if (data.period) {
      const accomplishments = data.accomplishments || [];
      const plans = data.plans || [];
      const blockers = data.blockers || [];
      const tags = data.tags || [];
      
      return (
        <>
          <SummaryCard>
            <SummaryHeader><FiCalendar /> Period: {data.period}</SummaryHeader>
            <p>Total entries: {accomplishments.length}</p>
          </SummaryCard>
          
          <SummaryCard>
            <SummaryHeader><FiBarChart /> Accomplishments</SummaryHeader>
            {accomplishments.length > 0 ? (
              <ul>
                {accomplishments.map((item: any, index: number) => (
                  <li key={index}>
                    <strong>{new Date(item.date).toLocaleDateString()}</strong>: {item.done}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No accomplishments recorded for this period.</p>
            )}
          </SummaryCard>
          
          <SummaryCard>
            <SummaryHeader><FiBarChart /> Plans</SummaryHeader>
            {plans.length > 0 ? (
              <ul>
                {plans.map((item: any, index: number) => (
                  <li key={index}>
                    <strong>{new Date(item.date).toLocaleDateString()}</strong>: {item.plan}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No plans recorded for this period.</p>
            )}
          </SummaryCard>
          
          {blockers.length > 0 && (
            <SummaryCard>
              <SummaryHeader><FiAlertCircle /> Blockers</SummaryHeader>
              <ul>
                {blockers.map((item: any, index: number) => (
                  <li key={index}>
                    <strong>{new Date(item.date).toLocaleDateString()}</strong>: {item.blocker}
                  </li>
                ))}
              </ul>
            </SummaryCard>
          )}
          
          {tags.length > 0 && (
            <SummaryCard>
              <SummaryHeader><FiTag /> Tags</SummaryHeader>
              <StandupTags>
                {tags.map((tag: string, index: number) => (
                  <StandupTag key={index}><FiTag /> {tag}</StandupTag>
                ))}
              </StandupTags>
            </SummaryCard>
          )}
          
          <DataVisualization>
            <VisualizationTitle><FiBarChart /> Tag Distribution</VisualizationTitle>
            <TagCloud>
              {tags.map((tag: string, index: number) => (
                <TagCloudItem 
                  key={index}
                  size={1}
                  onClick={() => handleSuggestedQuery(`Show me standups tagged with ${tag}`)}
                >
                  {tag}
                </TagCloudItem>
              ))}
            </TagCloud>
          </DataVisualization>
        </>
      );
    }
    
    // Monthly summary
    if (data.month) {
      return (
        <>
          <SummaryCard>
            <SummaryHeader><FiCalendar /> Month: {data.month}</SummaryHeader>
            <p>Total entries: {data.totalEntries}</p>
          </SummaryCard>
          
          {data.topTags.length > 0 && (
            <SummaryCard>
              <SummaryHeader><FiTag /> Top Tags</SummaryHeader>
              <TagCloud>
                {data.topTags.map((tag: any, index: number) => (
                  <TagCloudItem 
                    key={index}
                    size={tag.count}
                    onClick={() => handleSuggestedQuery(`Show me standups tagged with ${tag.tag}`)}
                  >
                    {tag.tag} ({tag.count})
                  </TagCloudItem>
                ))}
              </TagCloud>
            </SummaryCard>
          )}
          
          {data.weeklySummaries.map((week: any, weekIndex: number) => (
            <SummaryCard key={weekIndex}>
              <SummaryHeader><FiCalendar /> {week.week}</SummaryHeader>
              <h4>Accomplishments:</h4>
              <ul>
                {week.accomplishments.map((item: any, index: number) => (
                  <li key={index}>
                    <strong>{new Date(item.date).toLocaleDateString()}</strong>: {item.done}
                  </li>
                ))}
              </ul>
              
              <h4>Tags:</h4>
              <StandupTags>
                {week.tags.map((tag: string, index: number) => (
                  <StandupTag key={index}><FiTag /> {tag}</StandupTag>
                ))}
              </StandupTags>
            </SummaryCard>
          ))}
        </>
      );
    }
    
    // Blockers
    if (Array.isArray(data) && data.length > 0 && data[0].blocker) {
      return (
        <>
          {data.map((blocker: any, index: number) => (
            <SummaryCard key={index}>
              <SummaryHeader><FiAlertCircle /> {blocker.blocker}</SummaryHeader>
              <p>Occurrences: {blocker.occurrences}</p>
              <p>Dates:</p>
              <ul>
                {blocker.dates.map((date: string, dateIndex: number) => (
                  <li key={dateIndex}>
                    <Link to={`/standups/${date}`}>
                      {new Date(date).toLocaleDateString()}
                    </Link>
                  </li>
                ))}
              </ul>
            </SummaryCard>
          ))}
        </>
      );
    }
    
    // Generic JSON data fallback - display any other data format
    return (
      <>
        <SummaryCard>
          <SummaryHeader><FiInfo /> Query Results</SummaryHeader>
          <p>Here are the results for your query:</p>
          
          <pre style={{ 
            background: 'rgba(0,0,0,0.05)', 
            padding: '1rem', 
            borderRadius: '4px',
            overflow: 'auto',
            maxHeight: '400px'
          }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </SummaryCard>
      </>
    );
  };
  
  return (
    <PageContainer>
      <PageHeader>
        <Title>Natural Language Query</Title>
        <Subtitle>Ask questions about your standups in plain English</Subtitle>
      </PageHeader>
      
      <QueryContainer>
        <QueryForm onSubmit={handleSubmitQuery}>
          <QueryInput
            type="text"
            placeholder="Ask a question about your standups..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <QueryButton type="submit" disabled={loading || !query.trim()} data-testid="query-submit-button">
            {loading ? 'Processing...' : <><FiSearch /> Ask</>}
          </QueryButton>
          {query && (
            <ClearButton type="button" onClick={clearQuery}>
              <FiX /> Clear
            </ClearButton>
          )}
        </QueryForm>
        
        {queryHistory.length > 0 && !result && !loading && (
          <QueryHistoryContainer>
            <QueryHistoryTitle>Recent queries:</QueryHistoryTitle>
            <QueryHistoryList>
              {queryHistory.map((historyItem, index) => (
                <SuggestedQueryButton
                  key={index}
                  onClick={() => handleSuggestedQuery(historyItem)}
                >
                  <FiClock /> {historyItem}
                </SuggestedQueryButton>
              ))}
            </QueryHistoryList>
          </QueryHistoryContainer>
        )}
        
        {!result && !loading && (
          <>
            <SuggestedQueries>
              <SuggestedQueryTitle>Try asking:</SuggestedQueryTitle>
              {Object.entries(querySuggestions).flatMap(([category, queries]) => 
                queries.slice(0, 1).map(query => ({ category, query })) // Just show 1 from each category
              ).map(({ category, query }, index) => (
                <SuggestedQueryButton
                  key={index}
                  onClick={() => handleSuggestedQuery(query)}
                >
                  {getCategoryIcon(category)} {query}
                </SuggestedQueryButton>
              ))}
            </SuggestedQueries>
            
            <QueryCategoriesContainer>
              {Object.entries(querySuggestions).map(([category, queries]) => (
                <QueryCategory key={category}>
                  <CategoryTitle>{getCategoryIcon(category)} {category}</CategoryTitle>
                  {queries.map((suggestedQuery, index) => (
                    <SuggestedQueryButton
                      key={index}
                      onClick={() => handleSuggestedQuery(suggestedQuery)}
                    >
                      {suggestedQuery}
                    </SuggestedQueryButton>
                  ))}
                </QueryCategory>
              ))}
            </QueryCategoriesContainer>
            
            <TipsContainer>
              <FiInfo />
              <div>
                <strong>Pro tip:</strong> You can ask about specific time periods, tags, or blockers. 
                Try questions like "What did I work on last week?" or "Show me entries about frontend development."
              </div>
            </TipsContainer>
          </>
        )}
      </QueryContainer>
      
      {/* Debug display for development - can be removed in production */}
      {rawResponse && (
        <div style={{ 
          margin: '1rem 0', 
          padding: '1rem', 
          background: '#f8f9fa', 
          border: '1px solid #dee2e6',
          borderRadius: '4px'
        }}>
          <details>
            <summary style={{ fontWeight: 'bold', cursor: 'pointer' }}>Debug: Raw Response</summary>
            <pre style={{ marginTop: '1rem', overflow: 'auto' }}>
              {JSON.stringify(rawResponse, null, 2)}
            </pre>
          </details>
        </div>
      )}
      
      {loading && (
        <LoadingMessage>
          <LoadingSpinner />
          Processing your query...
        </LoadingMessage>
      )}
      
      {error && (
        <ErrorMessage>
          <FiAlertCircle />
          {error}
        </ErrorMessage>
      )}
      
      {!loading && !error && result && (
        <ResultsContainer>
          <ResultsHeader>
            <ResultsTitle>Results</ResultsTitle>
            <QueryText>"{query}"</QueryText>
          </ResultsHeader>
          
          {result.message && (
            <ResultsContent>
              <p>{result.message}</p>
              
              {result.examples && (
                <>
                  <h3>Try these examples:</h3>
                  <ul>
                    {result.examples.map((example, index) => (
                      <li key={index}>
                        <SuggestedQueryButton onClick={() => handleSuggestedQuery(example)}>
                          <FiChevronRight /> {example}
                        </SuggestedQueryButton>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </ResultsContent>
          )}
          
          {result.answer && (
            <AnswerContainer>
              {result.answer}
            </AnswerContainer>
          )}
          
          {result.data && renderSummaryData()}
        </ResultsContainer>
      )}
      
      {!loading && !error && relatedStandups.length > 0 && (
        <StandupsList>
          {relatedStandups.map(standup => (
            <StandupItem key={standup.date}>
              <StandupDate>
                {standup.formattedDate}
                {standup.isHighlight && (
                  <StandupHighlight>
                    <FiInfo /> Highlight
                  </StandupHighlight>
                )}
              </StandupDate>
              
              <StandupContent>
                <StandupField>
                  <h4>Yesterday:</h4>
                  <p>{standup.yesterday}</p>
                </StandupField>
                
                <StandupField>
                  <h4>Today:</h4>
                  <p>{standup.today}</p>
                </StandupField>
                
                {standup.blockers && (
                  <StandupField>
                    <h4>Blockers:</h4>
                    <p>{standup.blockers}</p>
                  </StandupField>
                )}
              </StandupContent>
              
              {standup.tags.length > 0 && (
                <StandupTags>
                  {standup.tags.map((tag, index) => (
                    <StandupTag key={index}>
                      <FiTag /> {tag}
                    </StandupTag>
                  ))}
                </StandupTags>
              )}
              
              <StandupLink to={`/standups/${standup.date}`}>
                <FiChevronRight /> View full standup
              </StandupLink>
            </StandupItem>
          ))}
        </StandupsList>
      )}
    </PageContainer>
  );
};

export default QueryPage; 