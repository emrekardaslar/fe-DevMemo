import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { queryAPI, standupAPI } from '../services/api';
import { Standup } from '../redux/standups/types';
import { FiSearch, FiX, FiChevronRight, FiAlertCircle, FiInfo, FiTag, FiBarChart, FiCalendar, FiClock } from 'react-icons/fi';

const PageContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 1.5rem;
`;

const PageHeader = styled.div`
  margin-bottom: 2.5rem;
  padding-bottom: 1rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 80px;
    height: 3px;
    background-color: var(--primary-color);
    border-radius: 3px;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  margin: 0 0 0.5rem 0;
  background: linear-gradient(90deg, var(--primary-color) 0%, #36a3e0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
`;

const QueryContainer = styled.div`
  margin-bottom: 2.5rem;
`;

const QueryForm = styled.form`
  display: flex;
  margin-top: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
  
  &:focus-within {
    box-shadow: 0 6px 16px rgba(52, 152, 219, 0.15);
    transform: translateY(-2px);
  }
`;

const QueryInput = styled.input`
  flex: 1;
  padding: 0.85rem 1.2rem;
  font-size: 1.05rem;
  border: 1px solid var(--border-color);
  border-right: none;
  border-radius: 8px 0 0 8px;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: inset 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
  
  &::placeholder {
    color: #aaa;
    font-style: italic;
  }
`;

const QueryButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0 1.8rem;
  font-size: 1.05rem;
  font-weight: 500;
  border-radius: 0 8px 8px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--primary-dark);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  &:disabled {
    background-color: var(--text-secondary);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
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
  padding: 1.35rem;
  border-radius: 12px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }
`;

const CategoryTitle = styled.div`
  font-size: 1.1rem;
  margin: 0 0 0.85rem 0;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  
  svg {
    font-size: 1.2rem;
  }
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
  padding: 0.4rem 0.9rem;
  font-size: 0.9rem;
  color: var(--text-color);
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  transition: all 0.2s ease;
  
  svg {
    font-size: 1rem;
    opacity: 0.8;
  }
  
  &:hover {
    background-color: rgba(52, 152, 219, 0.1);
    border-color: var(--primary-color);
    color: var(--primary-color);
    transform: translateY(-2px);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: none;
  }
`;

const ResultsContainer = styled.div`
  background-color: var(--card-background);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 1.75rem;
  margin-bottom: 2rem;
  animation: fadeIn 0.3s ease-in-out;
  border: 1px solid rgba(0, 0, 0, 0.05);
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--border-color);
`;

const ResultsTitle = styled.h2`
  font-size: 1.35rem;
  margin: 0;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    font-size: 1.2rem;
  }
`;

const QueryText = styled.p`
  font-style: italic;
  color: var(--text-secondary);
  margin: 0;
  background-color: rgba(0, 0, 0, 0.05);
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.95rem;
`;

const ResultsContent = styled.div`
  line-height: 1.6;
  font-size: 1.05rem;
`;

const AnswerContainer = styled.div`
  background-color: rgba(52, 152, 219, 0.1);
  border-left: 4px solid var(--primary-color);
  padding: 1.25rem;
  margin: 1.25rem 0;
  font-size: 1.15rem;
  line-height: 1.6;
  border-radius: 0 8px 8px 0;
`;

const StandupsList = styled.div`
  margin-top: 2rem;
`;

const StandupItem = styled.div`
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background-color: white;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.05);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const StandupDate = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--primary-color);
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
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

const StandupContent = styled.div`
  margin: 0.75rem 0;
  display: grid;
  gap: 1rem;
`;

const StandupField = styled.div`
  margin-bottom: 0.75rem;
  
  h4 {
    margin: 0 0 0.35rem 0;
    font-size: 0.95rem;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-weight: 600;
  }
  
  p {
    margin: 0;
    white-space: pre-line;
    line-height: 1.6;
    color: var(--text-color);
    background-color: rgba(0, 0, 0, 0.02);
    padding: 0.75rem;
    border-radius: 6px;
  }
`;

const StandupTags = styled.div`
  display: flex;
  gap: 0.6rem;
  margin-top: 1rem;
  flex-wrap: wrap;
  padding-top: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
`;

const StandupTag = styled.span`
  background-color: rgba(52, 152, 219, 0.1);
  color: var(--primary-color);
  font-size: 0.8rem;
  padding: 0.25rem 0.6rem;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 500;
  
  svg {
    font-size: 0.9rem;
  }
`;

const StandupLink = styled(Link)`
  display: inline-flex;
  margin-top: 1rem;
  font-size: 0.95rem;
  color: var(--primary-color);
  text-decoration: none;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-weight: 500;
  
  &:hover {
    text-decoration: none;
    background-color: rgba(52, 152, 219, 0.1);
    transform: translateX(3px);
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  font-size: 1.1rem;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 3px solid rgba(52, 152, 219, 0.1);
  border-radius: 50%;
  border-top-color: var(--primary-color);
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--error-color);
  background-color: rgba(231, 76, 60, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin: 1.5rem 0;
  border: 1px solid rgba(231, 76, 60, 0.2);
  box-shadow: 0 2px 8px rgba(231, 76, 60, 0.05);
  font-size: 1.05rem;
  
  svg {
    font-size: 1.5rem;
    color: var(--error-color);
  }
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
  padding: 1.5rem;
  border-radius: 10px;
  margin-bottom: 1.25rem;
  border: 1px solid var(--border-color);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
  }
  
  h4 {
    font-size: 1rem;
    margin: 1rem 0 0.5rem;
    color: var(--text-secondary);
  }
  
  ul {
    margin-top: 0.75rem;
    padding-left: 1.5rem;
    
    li {
      margin-bottom: 0.5rem;
      line-height: 1.5;
    }
  }
`;

const SummaryHeader = styled.div`
  font-weight: 600;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.15rem;
  color: var(--primary-color);
  
  svg {
    font-size: 1.2rem;
  }
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
  margin: 1.75rem 0;
  background-color: white;
  padding: 1.5rem;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
`;

const VisualizationTitle = styled.h3`
  font-size: 1.15rem;
  margin: 0 0 1.25rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--primary-color);
  
  svg {
    font-size: 1.2rem;
  }
`;

const TagCloud = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin: 1.25rem 0;
`;

const TagCloudItem = styled.div<{ size: number }>`
  font-size: ${props => 0.8 + (props.size * 0.05)}rem;
  background-color: rgba(52, 152, 219, 0.1);
  color: var(--primary-color);
  padding: 0.35rem 0.85rem;
  border-radius: 20px;
  transition: all 0.2s;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  
  &:hover {
    background-color: rgba(52, 152, 219, 0.2);
    transform: scale(1.05) translateY(-2px);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  }
  
  &:active {
    transform: scale(1) translateY(0);
  }
  
  &::before {
    content: "•";
    font-size: 1.2em;
    line-height: 0;
    opacity: 0.7;
  }
`;

const TipsContainer = styled.div`
  background-color: rgba(46, 204, 113, 0.1);
  border-left: 4px solid #2ecc71;
  padding: 1.25rem;
  margin: 1.25rem 0;
  font-size: 0.95rem;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  border-radius: 0 8px 8px 0;
  box-shadow: 0 2px 6px rgba(46, 204, 113, 0.1);
  line-height: 1.6;
  
  svg {
    font-size: 1.25rem;
    color: #2ecc71;
    flex-shrink: 0;
    margin-top: 0.1rem;
  }
  
  strong {
    color: #27ae60;
  }
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
    setRelatedStandups([]);
    setActiveTab('results');
    
    // Save query to history
    saveQueryToHistory(query);
    
    try {
      const response = await queryAPI.processQuery(query);
      
      // Extract the actual data from the nested response
      const responseData = response.data;
      
      // Prepare the result with a consistent structure
      let resultData;
      
      // Check if we have a success field in the response
      if (responseData && responseData.success !== undefined) {
        // This is the backend API response format where data is nested
        resultData = responseData.data;
      } else {
        // Direct response format
        resultData = responseData;
      }
      
      // Set the result with a consistent structure and message
      setResult({
        answer: `Here are the results for your query about "${query}"`,
        data: resultData
      });
      
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
    
    // Special handling for various data types
    if (data.period || data.month || (Array.isArray(data) && data.length > 0 && data[0].blocker)) {
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
    }
    
    // Render all response data in a Gemini AI-styled container
    return (
      <SummaryCard>
        <div style={{
          background: 'rgba(52, 152, 219, 0.05)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid rgba(52, 152, 219, 0.1)',
          marginTop: '1rem',
          position: 'relative',
          lineHeight: '1.6'
        }}>
          <div style={{
            position: 'absolute',
            top: '-12px',
            left: '20px',
            background: '#3498db',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '16px',
            fontSize: '0.9rem',
            fontWeight: '500'
          }}>
            Gemini AI
          </div>
          
          <p style={{ fontWeight: '500', fontSize: '1.1rem', marginTop: '0.5rem' }}>
            Based on your query about {query && `"${query}"` || "your standups"}, here's what I found:
          </p>
          
          <div style={{ marginTop: '1rem' }}>
            {typeof data === 'object' && data !== null ? (
              <div className="results-container">
                {/* Special handling for standups array */}
                {Array.isArray(data) && data.length > 0 && data[0].yesterday && (
                  <div className="standups-list">
                    {data.map((standup, index) => (
                      <div key={index} style={{ 
                        marginBottom: '1rem',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(52, 152, 219, 0.05)',
                        border: '1px solid rgba(52, 152, 219, 0.1)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h4 style={{ color: '#3498db', margin: '0', fontSize: '1rem', fontWeight: '600' }}>
                            {new Date(standup.date).toLocaleDateString()}
                          </h4>
                        </div>
                        
                        <div style={{ marginTop: '0.5rem' }}>
                          <div style={{ marginBottom: '0.5rem' }}>
                            <span style={{ fontWeight: '500' }}>Yesterday: </span>
                            <span>{standup.yesterday}</span>
                          </div>
                          
                          <div style={{ marginBottom: '0.5rem' }}>
                            <span style={{ fontWeight: '500' }}>Today: </span>
                            <span>{standup.today}</span>
                          </div>
                          
                          {standup.blockers && (
                            <div style={{ marginBottom: '0.5rem' }}>
                              <span style={{ fontWeight: '500' }}>Blockers: </span>
                              <span>{standup.blockers}</span>
                            </div>
                          )}
                          
                          {standup.tags && standup.tags.length > 0 && (
                            <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                              {standup.tags.map((tag: string, tagIndex: number) => (
                                <span 
                                  key={tagIndex}
                                  style={{
                                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                                    color: '#3498db',
                                    padding: '0.2rem 0.5rem',
                                    borderRadius: '12px',
                                    fontSize: '0.8rem'
                                  }}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Insight-specific formatting */}
                {data.insights && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ 
                      color: '#3498db',
                      margin: '0 0 0.75rem 0',
                      fontSize: '1rem',
                      fontWeight: '600'
                    }}>
                      Key Insights:
                    </h4>
                    
                    <ul style={{ 
                      margin: '0.5rem 0 0 0',
                      paddingLeft: '1.5rem'
                    }}>
                      {data.insights.map((insight: string, index: number) => (
                        <li key={index} style={{ marginBottom: '0.5rem' }}>
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Summary-specific formatting */}
                {data.summary && (
                  <div style={{ 
                    marginTop: '1rem',
                    padding: '0.75rem',
                    backgroundColor: 'rgba(52, 152, 219, 0.05)',
                    borderRadius: '8px',
                    fontStyle: 'italic'
                  }}>
                    <strong>Summary:</strong> {data.summary}
                  </div>
                )}
                
                {/* Render remaining properties */}
                {Object.entries(data)
                  .filter(([key]) => !['insights', 'summary'].includes(key)) // Skip already rendered properties
                  .map(([key, value]) => {
                  // Skip empty arrays or objects
                  if (
                    (Array.isArray(value) && value.length === 0) ||
                    (typeof value === 'object' && value !== null && Object.keys(value).length === 0)
                  ) {
                    return null;
                  }
                  
                  // Format the key to be more readable
                  const formattedKey = key
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, str => str.toUpperCase())
                    .replace(/Id$/, 'ID');
                  
                  return (
                    <div key={key} style={{ marginBottom: '1rem' }}>
                      <h4 style={{ 
                        color: '#3498db',
                        margin: '0 0 0.5rem 0',
                        fontSize: '1rem',
                        fontWeight: '600'
                      }}>
                        {formattedKey}:
                      </h4>
                      
                      {/* For arrays */}
                      {Array.isArray(value) ? (
                        <ul style={{ 
                          margin: '0.5rem 0 0 0',
                          paddingLeft: '1.5rem'
                        }}>
                          {value.map((item, index) => (
                            <li key={index} style={{ marginBottom: '0.5rem' }}>
                              {typeof item === 'object' && item !== null ? (
                                <pre style={{ 
                                  margin: 0,
                                  background: 'rgba(0,0,0,0.03)',
                                  padding: '0.5rem',
                                  borderRadius: '4px',
                                  fontSize: '0.9rem',
                                  overflow: 'auto'
                                }}>
                                  {JSON.stringify(item, null, 2)}
                                </pre>
                              ) : (
                                <span>{String(item)}</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : typeof value === 'object' && value !== null ? (
                        // For nested objects
                        <pre style={{ 
                          margin: 0,
                          background: 'rgba(0,0,0,0.03)',
                          padding: '0.75rem',
                          borderRadius: '6px',
                          fontSize: '0.9rem',
                          overflow: 'auto'
                        }}>
                          {JSON.stringify(value, null, 2)}
                        </pre>
                      ) : (
                        // For primitive values
                        <p style={{ margin: '0.25rem 0 0 0' }}>{String(value)}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p>I don't have any specific data to display for your query. Try asking something more specific about your standups.</p>
            )}
          </div>
          
          <p style={{ 
            marginTop: '1.5rem',
            borderTop: '1px solid rgba(52, 152, 219, 0.2)',
            paddingTop: '1rem',
            fontSize: '0.95rem',
            color: '#666'
          }}>
            Is there anything specific from this data you'd like me to explain in more detail?
          </p>
        </div>
      </SummaryCard>
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
            <ResultsTitle><FiInfo /> Results</ResultsTitle>
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