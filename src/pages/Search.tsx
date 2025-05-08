import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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

const TagFiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const TagFilter = styled.div`
  display: inline-flex;
  align-items: center;
  background-color: rgba(52, 152, 219, 0.1);
  color: var(--primary-color);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.9rem;
`;

const TagDeleteButton = styled.button`
  background: none;
  border: none;
  color: var(--text-secondary);
  margin-left: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  
  &:hover {
    color: var(--error-color);
  }
`;

const ClearFiltersButton = styled.button`
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 0.9rem;
  cursor: pointer;
  margin-left: auto;
  padding: 0.25rem 0.5rem;
  
  &:hover {
    color: var(--primary-color);
    text-decoration: underline;
  }
`;

const FilterInfoText = styled.div`
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
`;

const TagsSection = styled.div`
  margin-top: 1.5rem;
`;

const TagsTitle = styled.h3`
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

const TagsCloud = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const TagButton = styled.button`
  background-color: rgba(52, 152, 219, 0.05);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  
  &:hover {
    background-color: rgba(52, 152, 219, 0.1);
    border-color: var(--primary-color);
    color: var(--primary-color);
  }
`;

const Search: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [keyword, setKeyword] = useState('');
  const [tagFilters, setTagFilters] = useState<string[]>([]);
  const [results, setResults] = useState<Standup[]>([]);
  const [allTags, setAllTags] = useState<{tag: string, count: number}[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  
  // Extract unique tags from search results
  useEffect(() => {
    if (results.length > 0) {
      const tagCountMap = new Map<string, number>();
      
      results.forEach(standup => {
        standup.tags.forEach(tag => {
          const count = tagCountMap.get(tag) || 0;
          tagCountMap.set(tag, count + 1);
        });
      });
      
      const uniqueTags = Array.from(tagCountMap.entries())
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count);
      
      setAllTags(uniqueTags);
    } else {
      setAllTags([]);
    }
  }, [results]);
  
  // Update URL based on search and filters
  const updateUrl = (newKeyword: string, newTagFilters: string[]) => {
    const params = new URLSearchParams();
    
    if (newKeyword) {
      params.set('q', newKeyword);
    }
    
    if (newTagFilters.length > 0) {
      params.set('tags', newTagFilters.join(','));
    }
    
    navigate({ search: params.toString() }, { replace: true });
  };
  
  // Handle search with both keyword and tag filters
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!keyword.trim() && tagFilters.length === 0) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      let response;
      
      if (keyword.trim() && tagFilters.length === 0) {
        // Search by keyword only
        response = await standupAPI.search(keyword);
      } else if (!keyword.trim() && tagFilters.length > 0) {
        // Filter by tags only
        response = await standupAPI.getAll({ tag: tagFilters.join(',') });
      } else {
        // Search by keyword and then filter results by tags
        response = await standupAPI.search(keyword);
        
        // Filter results that have all the specified tags
        const filteredData = response.data.filter((standup: Standup) => 
          tagFilters.every(tag => standup.tags.includes(tag))
        );
        
        response.data = filteredData;
      }
      
      setResults(response.data);
      setSearched(true);
      updateUrl(keyword, tagFilters);
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
  
  // Add a tag to filters
  const addTagFilter = (tag: string) => {
    if (!tagFilters.includes(tag)) {
      const newFilters = [...tagFilters, tag];
      setTagFilters(newFilters);
      handleSearch();
    }
  };
  
  // Remove a tag from filters
  const removeTagFilter = (tag: string) => {
    const newFilters = tagFilters.filter(t => t !== tag);
    setTagFilters(newFilters);
    
    // If there are still filters or a keyword, search again
    if (newFilters.length > 0 || keyword.trim()) {
      handleSearch();
    } else {
      // If no filters and no keyword, clear results
      setResults([]);
      setSearched(false);
      updateUrl('', []);
    }
  };
  
  // Clear all filters
  const clearFilters = () => {
    setTagFilters([]);
    
    if (keyword.trim()) {
      handleSearch();
    } else {
      setResults([]);
      setSearched(false);
      updateUrl('', []);
    }
  };
  
  // Check for URL parameters on initial load
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const keywordParam = urlParams.get('q');
    const tagsParam = urlParams.get('tags');
    
    let shouldSearch = false;
    
    if (keywordParam) {
      setKeyword(keywordParam);
      shouldSearch = true;
    }
    
    if (tagsParam) {
      const tags = tagsParam.split(',').filter(Boolean);
      setTagFilters(tags);
      shouldSearch = true;
    }
    
    if (shouldSearch) {
      // Use setTimeout to ensure state updates have completed
      setTimeout(() => handleSearch(), 0);
    }
  }, [location.search]);
  
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
            placeholder="Search for keywords or content..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <SearchButton type="submit">Search</SearchButton>
        </SearchContainer>
      </form>
      
      {tagFilters.length > 0 && (
        <TagFiltersContainer>
          <FilterInfoText>Filtered by:</FilterInfoText>
          {tagFilters.map(tag => (
            <TagFilter key={tag}>
              {tag}
              <TagDeleteButton 
                type="button" 
                onClick={() => removeTagFilter(tag)}
                aria-label={`Remove tag filter ${tag}`}
              >
                ×
              </TagDeleteButton>
            </TagFilter>
          ))}
          <ClearFiltersButton onClick={clearFilters}>
            Clear all filters
          </ClearFiltersButton>
        </TagFiltersContainer>
      )}
      
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
          No standups found matching your criteria. Try different keywords or filters.
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
      
      {!loading && !error && allTags.length > 0 && (
        <TagsSection>
          <TagsTitle>Tags in results:</TagsTitle>
          <TagsCloud>
            {allTags.map(({ tag, count }) => (
              <TagButton 
                key={tag} 
                onClick={() => addTagFilter(tag)}
                disabled={tagFilters.includes(tag)}
                style={{ opacity: tagFilters.includes(tag) ? 0.5 : 1 }}
              >
                {tag} ({count})
              </TagButton>
            ))}
          </TagsCloud>
        </TagsSection>
      )}
    </PageContainer>
  );
};

export default Search; 