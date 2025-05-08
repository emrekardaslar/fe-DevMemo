import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { fetchStandups } from '../redux/standups/actions';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { Standup } from '../redux/standups/types';

// Types
interface TagWithCount {
  name: string;
  count: number;
  standups: Standup[];
}

// Styled components
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
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
  margin-bottom: 2rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  margin-bottom: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const TagsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const TagCard = styled.div`
  background-color: var(--card-background);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const TagName = styled.h2`
  font-size: 1.2rem;
  color: var(--primary-color);
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
`;

const TagCount = styled.span`
  background-color: rgba(52, 152, 219, 0.1);
  color: var(--primary-color);
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 10px;
  margin-left: 0.75rem;
`;

const StandupsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1rem 0 0 0;
  max-height: 200px;
  overflow-y: auto;
`;

const StandupItem = styled.li`
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border-color);
  
  &:last-child {
    border-bottom: none;
  }
`;

const StandupLink = styled(Link)`
  color: var(--text-color);
  text-decoration: none;
  display: block;
  
  &:hover {
    color: var(--primary-color);
  }
`;

const StandupDate = styled.span`
  font-weight: 500;
`;

const NoResults = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
  grid-column: 1 / -1;
`;

const LoadingIndicator = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
  grid-column: 1 / -1;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-secondary);
`;

const EmptyStateIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--border-color);
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: var(--text-color);
`;

const TagsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { standups, loading } = useSelector((state: RootState) => state.standups);
  const [searchQuery, setSearchQuery] = useState('');
  const [allTags, setAllTags] = useState<TagWithCount[]>([]);
  const [filteredTags, setFilteredTags] = useState<TagWithCount[]>([]);
  
  // Fetch all standups on component mount
  useEffect(() => {
    dispatch(fetchStandups());
  }, [dispatch]);
  
  // Process tags from standups
  useEffect(() => {
    if (standups.length > 0) {
      const tagMap = new Map<string, TagWithCount>();
      
      // Process each standup
      standups.forEach(standup => {
        // Process each tag in the standup
        standup.tags.forEach(tagName => {
          const tag = tagMap.get(tagName);
          
          if (tag) {
            // Update existing tag
            tag.count += 1;
            tag.standups.push(standup);
          } else {
            // Create new tag
            tagMap.set(tagName, {
              name: tagName,
              count: 1,
              standups: [standup]
            });
          }
        });
      });
      
      // Convert map to array and sort by count (descending)
      const tagsArray = Array.from(tagMap.values())
        .sort((a, b) => b.count - a.count);
      
      setAllTags(tagsArray);
      setFilteredTags(tagsArray);
    }
  }, [standups]);
  
  // Filter tags based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredTags(allTags);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = allTags.filter(tag => 
        tag.name.toLowerCase().includes(query)
      );
      setFilteredTags(filtered);
    }
  }, [searchQuery, allTags]);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  if (loading) {
    return (
      <PageContainer>
        <PageHeader>
          <Title>Tags</Title>
          <Subtitle>Manage and explore standup tags</Subtitle>
        </PageHeader>
        <LoadingIndicator>Loading tags...</LoadingIndicator>
      </PageContainer>
    );
  }
  
  if (allTags.length === 0) {
    return (
      <PageContainer>
        <PageHeader>
          <Title>Tags</Title>
          <Subtitle>Manage and explore standup tags</Subtitle>
        </PageHeader>
        <EmptyState>
          <EmptyStateIcon>🏷️</EmptyStateIcon>
          <EmptyStateTitle>No tags found</EmptyStateTitle>
          <p>Start adding tags to your standups to see them here</p>
        </EmptyState>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <PageHeader>
        <Title>Tags</Title>
        <Subtitle>Manage and explore standup tags</Subtitle>
      </PageHeader>
      
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Search tags..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </SearchContainer>
      
      <TagsGrid>
        {filteredTags.length > 0 ? (
          filteredTags.map(tag => (
            <TagCard key={tag.name}>
              <TagName>
                {tag.name}
                <TagCount>{tag.count}</TagCount>
              </TagName>
              <StandupsList>
                {tag.standups
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 5) // Show only the 5 most recent
                  .map(standup => (
                    <StandupItem key={standup.date}>
                      <StandupLink to={`/standups/${standup.date}`}>
                        <StandupDate>{formatDate(standup.date)}</StandupDate>
                      </StandupLink>
                    </StandupItem>
                  ))
                }
                {tag.count > 5 && (
                  <StandupItem>
                    <Link to={`/search?tag=${tag.name}`}>
                      View all {tag.count} standups...
                    </Link>
                  </StandupItem>
                )}
              </StandupsList>
            </TagCard>
          ))
        ) : (
          <NoResults>
            <p>No tags found for "{searchQuery}"</p>
          </NoResults>
        )}
      </TagsGrid>
    </PageContainer>
  );
};

export default TagsPage; 