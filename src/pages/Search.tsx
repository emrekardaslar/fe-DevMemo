import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { standupAPI } from '../services/api';
import StandupCard from '../components/standups/StandupCard';
import { Standup } from '../redux/standups/types';

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

const SearchContainer = styled.div`
  display: flex;
  margin-top: 1.5rem;
  margin-bottom: 2rem;
`;

const SearchInput = styled.input`
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

const SearchButton = styled.button`
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
`;

const ResultsInfo = styled.div`
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
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
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
  background-color: var(--card-background);
  border-radius: 8px;
`;

const Search: React.FC = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<Standup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!keyword.trim()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await standupAPI.search(keyword);
      setResults(response.data);
      setSearched(true);
    } catch (error) {
      setError('An error occurred while searching. Please try again.');
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleToggleHighlight = async (date: string) => {
    try {
      await standupAPI.toggleHighlight(date);
      
      // Update the results list
      setResults(prevResults => 
        prevResults.map(standup => 
          standup.date === date 
            ? { ...standup, isHighlight: !standup.isHighlight } 
            : standup
        )
      );
    } catch (error) {
      console.error('Error toggling highlight:', error);
    }
  };
  
  const handleDelete = async (date: string) => {
    if (window.confirm('Are you sure you want to delete this standup?')) {
      try {
        await standupAPI.delete(date);
        
        // Remove from results
        setResults(prevResults => 
          prevResults.filter(standup => standup.date !== date)
        );
      } catch (error) {
        console.error('Error deleting standup:', error);
      }
    }
  };
  
  // Check for URL parameters on initial load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const keywordParam = urlParams.get('q');
    
    if (keywordParam) {
      setKeyword(keywordParam);
      handleSearch();
    }
  }, []);
  
  return (
    <PageContainer>
      <PageHeader>
        <Title>Search Standups</Title>
        <Subtitle>Find entries by keywords, tags, or content</Subtitle>
      </PageHeader>
      
      <form onSubmit={handleSearch}>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Search for keywords, tags, or content..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <SearchButton type="submit">Search</SearchButton>
        </SearchContainer>
      </form>
      
      {loading && <LoadingMessage>Searching...</LoadingMessage>}
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {!loading && !error && searched && (
        <ResultsInfo>
          {results.length === 0
            ? 'No results found'
            : `Found ${results.length} result${results.length !== 1 ? 's' : ''}`}
        </ResultsInfo>
      )}
      
      {!loading && !error && results.length === 0 && searched && (
        <EmptyMessage>
          No standups found matching your search. Try different keywords.
        </EmptyMessage>
      )}
      
      {!loading && !error && results.map((standup) => (
        <StandupCard
          key={standup.date}
          standup={standup}
          onToggleHighlight={handleToggleHighlight}
          onDelete={handleDelete}
        />
      ))}
    </PageContainer>
  );
};

export default Search; 