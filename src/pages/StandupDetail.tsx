import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useStandups } from '../context/StandupContext';
import { useStandupOperations } from '../hooks/useStandupOperations';

const PageContainer = styled.div`
  max-width: 800px;
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

const BackLink = styled(Link)`
  color: var(--primary-color);
  text-decoration: none;
  display: flex;
  align-items: center;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: var(--text-secondary);
  font-size: 0.9rem;
  padding: 0.5rem;
  border-radius: 4px;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    color: var(--text-color);
  }
`;

const EditButton = styled(Link)`
  display: flex;
  align-items: center;
  color: var(--text-secondary);
  font-size: 0.9rem;
  padding: 0.5rem;
  border-radius: 4px;
  text-decoration: none;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    color: var(--text-color);
    text-decoration: none;
  }
`;

const Card = styled.div<{ isHighlight: boolean }>`
  background-color: ${(props) => props.isHighlight ? 'var(--highlight-color)' : 'var(--card-background)'};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border-left: ${(props) => props.isHighlight ? '4px solid var(--warning-color)' : 'none'};
`;

const Section = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const SectionContent = styled.p`
  margin: 0;
  color: var(--text-color);
  font-size: 1rem;
  line-height: 1.5;
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 1rem;
`;

const Tag = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  font-size: 0.85rem;
  background-color: rgba(52, 152, 219, 0.1);
  color: var(--primary-color);
  border-radius: 4px;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
`;

const MetadataContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
`;

const MetadataItem = styled.div`
  display: flex;
  align-items: center;
`;

const MetadataIcon = styled.span`
  margin-right: 0.5rem;
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

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const getMoodEmoji = (mood: number): string => {
  if (mood === 0) return '😐';
  if (mood === 1) return '😢';
  if (mood === 2) return '😕';
  if (mood === 3) return '😐';
  if (mood === 4) return '🙂';
  return '😄';
};

const getProductivityEmoji = (productivity: number): string => {
  if (productivity === 0) return '📊';
  if (productivity === 1) return '📉';
  if (productivity === 2) return '📊';
  if (productivity === 3) return '📊';
  if (productivity === 4) return '📈';
  return '🚀';
};

const StandupDetail: React.FC = () => {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  
  // Use the custom hook for standup operations
  const { loadStandup, toggleHighlight, deleteStandup } = useStandupOperations();
  
  // Use the context to get state
  const { currentStandup, loading, error } = useStandups();
  
  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      if (date && isMounted) {
        try {
          await loadStandup(date);
        } catch (error) {
          console.error(`Error loading standup for date ${date}:`, error);
        }
      }
    };
    
    fetchData();
    
    return () => {
      isMounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);
  
  const handleToggleHighlight = async () => {
    if (date && currentStandup) {
      try {
        await toggleHighlight(date);
      } catch (error) {
        console.error(`Error toggling highlight for date ${date}:`, error);
      }
    }
  };
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this standup?')) {
      if (date) {
        await deleteStandup(date);
        navigate('/standups');
      }
    }
  };
  
  if (loading) {
    return <LoadingMessage>Loading standup...</LoadingMessage>;
  }
  
  if (error) {
    return <ErrorMessage>Error: {error}</ErrorMessage>;
  }
  
  if (!currentStandup) {
    return <ErrorMessage>Standup not found</ErrorMessage>;
  }
  
  return (
    <PageContainer>
      <PageHeader>
        <BackLink to="/standups">← Back to all standups</BackLink>
        <ActionButtons>
          <ActionButton 
            onClick={handleToggleHighlight}
            title={currentStandup.isHighlight ? 'Remove highlight' : 'Highlight'}
          >
            {currentStandup.isHighlight ? '⭐ Highlighted' : '☆ Highlight'}
          </ActionButton>
          <EditButton to={`/standups/${date}/edit`} title="Edit">
            ✏️ Edit
          </EditButton>
          <ActionButton onClick={handleDelete} title="Delete">
            🗑️ Delete
          </ActionButton>
        </ActionButtons>
      </PageHeader>
      
      <Title>{formatDate(currentStandup.date)}</Title>
      
      <Card isHighlight={currentStandup.isHighlight}>
        <Section>
          <SectionTitle>Yesterday</SectionTitle>
          <SectionContent>{currentStandup.yesterday}</SectionContent>
        </Section>
        
        <Section>
          <SectionTitle>Today</SectionTitle>
          <SectionContent>{currentStandup.today}</SectionContent>
        </Section>
        
        {currentStandup.blockers && (
          <Section>
            <SectionTitle>Blockers</SectionTitle>
            <SectionContent>{currentStandup.blockers}</SectionContent>
          </Section>
        )}
        
        {currentStandup.tags && currentStandup.tags.length > 0 && (
          <TagContainer>
            {currentStandup.tags.map((tag, index) => (
              <Tag key={index}>#{tag}</Tag>
            ))}
          </TagContainer>
        )}
        
        <MetadataContainer>
          {currentStandup.mood > 0 && (
            <MetadataItem>
              <MetadataIcon>{getMoodEmoji(currentStandup.mood)}</MetadataIcon>
              Mood: {currentStandup.mood}/5
            </MetadataItem>
          )}
          
          {currentStandup.productivity > 0 && (
            <MetadataItem>
              <MetadataIcon>{getProductivityEmoji(currentStandup.productivity)}</MetadataIcon>
              Productivity: {currentStandup.productivity}/5
            </MetadataItem>
          )}
          
          {currentStandup.isBlockerResolved !== undefined && currentStandup.blockers && (
            <MetadataItem>
              <MetadataIcon>{currentStandup.isBlockerResolved ? '✅' : '⚠️'}</MetadataIcon>
              Blocker {currentStandup.isBlockerResolved ? 'resolved' : 'unresolved'}
            </MetadataItem>
          )}
        </MetadataContainer>
      </Card>
    </PageContainer>
  );
};

export default StandupDetail; 