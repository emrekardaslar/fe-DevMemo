import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Standup } from '../../redux/features/standups/types';

interface StandupCardProps {
  standup: Standup;
  onToggleHighlight: (date: string) => void;
  onDelete: (date: string) => void;
}

const Card = styled.div<{ $isHighlight: boolean }>`
  background-color: ${(props) => props.$isHighlight ? 'var(--highlight-color)' : 'var(--card-background)'};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border-left: ${(props) => props.$isHighlight ? '4px solid var(--warning-color)' : 'none'};
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const DateLink = styled(Link)`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--primary-color);
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: var(--text-secondary);
  padding: 0.25rem;
  border-radius: 4px;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    color: var(--text-color);
  }
`;

const Section = styled.div`
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h3`
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0 0 0.25rem 0;
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

const MoodIndicator = styled.span<{ value: number }>`
  color: ${props => {
    if (props.value === 0) return 'var(--text-secondary)';
    if (props.value <= 2) return 'var(--error-color)';
    if (props.value <= 3) return 'var(--warning-color)';
    return 'var(--success-color)';
  }};
`;

const ProductivityIndicator = styled.span<{ value: number }>`
  color: ${props => {
    if (props.value === 0) return 'var(--text-secondary)';
    if (props.value <= 2) return 'var(--error-color)';
    if (props.value <= 3) return 'var(--warning-color)';
    return 'var(--success-color)';
  }};
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

const StandupCard: React.FC<StandupCardProps> = ({ standup, onToggleHighlight, onDelete }) => {
  // Add a handler with debug logging
  const handleToggleHighlight = () => {
    console.log('StandupCard: Toggling highlight for standup:', standup);
    onToggleHighlight(standup.date);
  };

  return (
    <Card $isHighlight={standup.isHighlight}>
      <CardHeader>
        <DateLink to={`/standups/${standup.date}`}>
          {formatDate(standup.date)}
        </DateLink>
        <ActionButtons>
          <IconButton 
            onClick={handleToggleHighlight} 
            title={standup.isHighlight ? 'Remove highlight' : 'Highlight'}
          >
            {standup.isHighlight ? '⭐' : '☆'}
          </IconButton>
          <IconButton as={Link} to={`/standups/${standup.date}/edit`} title="Edit">
            ✏️
          </IconButton>
          <IconButton onClick={() => onDelete(standup.date)} title="Delete">
            🗑️
          </IconButton>
        </ActionButtons>
      </CardHeader>
      
      <Section>
        <SectionTitle>Yesterday</SectionTitle>
        <SectionContent>{standup.yesterday}</SectionContent>
      </Section>
      
      <Section>
        <SectionTitle>Today</SectionTitle>
        <SectionContent>{standup.today}</SectionContent>
      </Section>
      
      {standup.blockers && (
        <Section>
          <SectionTitle>Blockers</SectionTitle>
          <SectionContent>{standup.blockers}</SectionContent>
        </Section>
      )}
      
      {standup.tags && standup.tags.length > 0 && (
        <TagContainer>
          {standup.tags.map((tag, index) => (
            <Tag key={index}>#{tag}</Tag>
          ))}
        </TagContainer>
      )}
      
      <MetadataContainer>
        {standup.mood > 0 && (
          <MoodIndicator value={standup.mood}>
            Mood: {getMoodEmoji(standup.mood)} {standup.mood}/5
          </MoodIndicator>
        )}
        
        {standup.productivity > 0 && (
          <ProductivityIndicator value={standup.productivity}>
            Productivity: {getProductivityEmoji(standup.productivity)} {standup.productivity}/5
          </ProductivityIndicator>
        )}
      </MetadataContainer>
    </Card>
  );
};

export default StandupCard; 