import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useStandups, Standup } from '../context/StandupContext';
import StandupCard from '../components/standups/StandupCard';

const PageContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  margin: 0;
`;

const NewButton = styled(Link)`
  background-color: var(--primary-color);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    background-color: var(--primary-dark);
    text-decoration: none;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const FilterSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: white;
  min-width: 150px;
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
  margin-top: 2rem;
`;

const StandupList: React.FC = () => {
  // Use the StandupContext
  const { standups, loading, error, fetchStandups, getHighlights, toggleHighlight, deleteStandup } = useStandups();
  
  const [filter, setFilter] = useState('all');
  
  // Initial data loading
  useEffect(() => {
    const loadData = async () => {
      if (filter === 'highlights') {
        try {
          await getHighlights();
        } catch (err) {
          console.error('Error loading highlights:', err);
        }
      } else {
        try {
          await fetchStandups();
        } catch (err) {
          console.error('Error loading standups:', err);
        }
      }
    };
    
    loadData();
    // We only include filter as a dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);
  
  // Event handlers
  const handleToggleHighlight = async (date: string) => {
    try {
      await toggleHighlight(date);
    } catch (err) {
      console.error('Error toggling highlight:', err);
    }
  };
  
  const handleDelete = async (date: string) => {
    if (window.confirm('Are you sure you want to delete this standup?')) {
      try {
        await deleteStandup(date);
      } catch (err) {
        console.error('Error deleting standup:', err);
      }
    }
  };
  
  return (
    <PageContainer>
      <PageHeader>
        <Title>All Standups</Title>
        <NewButton to="/standups/new">New Standup</NewButton>
      </PageHeader>
      
      <FilterContainer>
        <FilterSelect 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Standups</option>
          <option value="highlights">Highlights Only</option>
        </FilterSelect>
      </FilterContainer>
      
      {loading && <LoadingMessage>Loading standups...</LoadingMessage>}
      
      {error && <ErrorMessage>Error: {error}</ErrorMessage>}
      
      {!loading && !error && standups.length === 0 && (
        <EmptyMessage>
          No standups found. Get started by creating your first standup!
        </EmptyMessage>
      )}
      
      {!loading && !error && standups.map((standup: Standup) => (
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

export default StandupList; 