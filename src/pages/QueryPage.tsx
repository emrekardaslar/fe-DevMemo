import React, { useState } from 'react';
import styled from 'styled-components';
import { queryAPI } from '../services/api';

const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
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
`;

const QueryInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 4px 0 0 4px;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const QueryButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  
  &:hover {
    background-color: var(--primary-dark);
  }
  
  &:disabled {
    background-color: var(--text-secondary);
    cursor: not-allowed;
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
  padding: 0.35rem 0.75rem;
  font-size: 0.85rem;
  color: var(--text-color);
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    border-color: var(--primary-color);
  }
`;

const ResultsContainer = styled.div`
  background-color: var(--card-background);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
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
`;

const ResultsContent = styled.div`
  line-height: 1.6;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--error-color);
  background-color: rgba(231, 76, 60, 0.1);
  border-radius: 8px;
`;

interface QueryResult {
  answer: string;
  relatedStandups?: string[];
}

const QueryPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<QueryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const suggestedQueries = [
    'What did I do last week?',
    'What are my current blockers?',
    'Show me standups about backend',
    'What am I working on this week?',
    'What were my highlights last month?'
  ];
  
  const handleSubmitQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await queryAPI.processQuery(query);
      setResult(response.data);
    } catch (error) {
      setError('An error occurred processing your query. Please try again.');
      console.error('Query error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSuggestedQuery = (suggestedQuery: string) => {
    setQuery(suggestedQuery);
    setResult(null);
    setError(null);
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
          <QueryButton type="submit" disabled={loading || !query.trim()}>
            {loading ? 'Processing...' : 'Ask'}
          </QueryButton>
        </QueryForm>
        
        <SuggestedQueries>
          <SuggestedQueryTitle>Try asking:</SuggestedQueryTitle>
          {suggestedQueries.map((suggestedQuery, index) => (
            <SuggestedQueryButton
              key={index}
              onClick={() => handleSuggestedQuery(suggestedQuery)}
            >
              {suggestedQuery}
            </SuggestedQueryButton>
          ))}
        </SuggestedQueries>
      </QueryContainer>
      
      {loading && <LoadingMessage>Processing your query...</LoadingMessage>}
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {!loading && !error && result && (
        <ResultsContainer>
          <ResultsHeader>
            <ResultsTitle>Results</ResultsTitle>
            <QueryText>"{query}"</QueryText>
          </ResultsHeader>
          
          <ResultsContent>
            <p>{result.answer}</p>
            
            {result.relatedStandups && result.relatedStandups.length > 0 && (
              <>
                <h3>Related Standups:</h3>
                <ul>
                  {result.relatedStandups.map((date, index) => (
                    <li key={index}>
                      <a href={`/standups/${date}`}>{new Date(date).toLocaleDateString()}</a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </ResultsContent>
        </ResultsContainer>
      )}
    </PageContainer>
  );
};

export default QueryPage; 