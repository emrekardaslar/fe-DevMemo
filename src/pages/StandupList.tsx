import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { fetchStandups, toggleHighlight, deleteStandup } from '../redux/standups/actions';
import { RootState } from '../redux/store';
import { useAppDispatch } from '../hooks/useAppDispatch';
import StandupCard from '../components/standups/StandupCard';
import { Standup } from '../redux/standups/types';

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
  const dispatch = useAppDispatch();
  const { standups, loading, error } = useSelector((state: RootState) => state.standups);
  const [filter, setFilter] = useState('all');
  
  useEffect(() => {
    const params: Record<string, string> = {};
    
    if (filter === 'highlights') {
      params.isHighlight = 'true';
    }
    
    dispatch(fetchStandups(params));
  }, [dispatch, filter]);
  
  const handleToggleHighlight = (date: string) => {
    dispatch(toggleHighlight(date));
  };
  
  const handleDelete = (date: string) => {
    if (window.confirm('Are you sure you want to delete this standup?')) {
      dispatch(deleteStandup(date));
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