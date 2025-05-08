import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { queryAPI } from '../services/api';

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

const BackLink = styled(Link)`
  color: var(--primary-color);
  text-decoration: none;
  display: flex;
  align-items: center;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Card = styled.div`
  background-color: var(--card-background);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  margin: 1.5rem 0 1rem 0;
  color: var(--text-color);
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  gap: 1rem;
`;

const StatCard = styled.div`
  background-color: rgba(231, 76, 60, 0.1);
  border-radius: 6px;
  padding: 1rem;
  text-align: center;
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--warning-color);
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
`;

const BlockerList = styled.div`
  margin-top: 1.5rem;
`;

const BlockerItem = styled.div`
  padding: 1rem;
  background-color: rgba(231, 76, 60, 0.05);
  border-left: 3px solid var(--warning-color);
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const BlockerDate = styled.div`
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
`;

const BlockerText = styled.div`
  line-height: 1.5;
`;

const BlockerLink = styled(Link)`
  display: inline-block;
  margin-top: 0.5rem;
  color: var(--primary-color);
  font-size: 0.9rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
  background-color: var(--card-background);
  border-radius: 8px;
  margin-top: 1rem;
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

interface BlockerData {
  total: number;
  resolved: number;
  unresolved: number;
  blockers: Array<{
    date: string;
    text: string;
    resolved: boolean;
  }>;
  mostFrequentTerms: Array<{
    term: string;
    count: number;
  }>;
}

const BlockerAnalysis: React.FC = () => {
  const [blockerData, setBlockerData] = useState<BlockerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchBlockers = async () => {
      try {
        setLoading(true);
        const response = await queryAPI.getBlockers();
        console.log('Blocker analysis response:', response);
        
        if (response && response.data) {
          setBlockerData(response.data);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching blocker analysis:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlockers();
  }, []);
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  if (loading) {
    return <LoadingMessage>Loading blocker analysis...</LoadingMessage>;
  }
  
  if (error) {
    return <ErrorMessage>Error: {error}</ErrorMessage>;
  }
  
  if (!blockerData) {
    return <ErrorMessage>No blocker data available</ErrorMessage>;
  }
  
  return (
    <PageContainer>
      <PageHeader>
        <Title>Blocker Analysis</Title>
        <BackLink to="/dashboard">← Back to dashboard</BackLink>
      </PageHeader>
      
      <Card>
        <StatsContainer>
          <StatCard>
            <StatValue>{blockerData.total}</StatValue>
            <StatLabel>Total Blockers</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatValue>{blockerData.resolved}</StatValue>
            <StatLabel>Resolved</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatValue>{blockerData.unresolved}</StatValue>
            <StatLabel>Unresolved</StatLabel>
          </StatCard>
        </StatsContainer>
        
        {blockerData.mostFrequentTerms.length > 0 && (
          <>
            <SectionTitle>Common Blocker Terms</SectionTitle>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {blockerData.mostFrequentTerms.map((term, index) => (
                <div
                  key={index}
                  style={{
                    padding: '0.5rem 0.75rem',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    borderRadius: '16px',
                    fontSize: '0.9rem',
                  }}
                >
                  {term.term} ({term.count})
                </div>
              ))}
            </div>
          </>
        )}
        
        <SectionTitle>Recent Blockers</SectionTitle>
        
        {blockerData.blockers.length === 0 ? (
          <EmptyMessage>No blockers reported yet</EmptyMessage>
        ) : (
          <BlockerList>
            {blockerData.blockers.map((blocker, index) => (
              <BlockerItem key={index} style={{
                backgroundColor: blocker.resolved 
                  ? 'rgba(46, 204, 113, 0.05)' 
                  : 'rgba(231, 76, 60, 0.05)',
                borderLeftColor: blocker.resolved 
                  ? 'var(--success-color)' 
                  : 'var(--warning-color)'
              }}>
                <BlockerDate>{formatDate(blocker.date)}</BlockerDate>
                <BlockerText>{blocker.text}</BlockerText>
                <BlockerLink to={`/standups/${blocker.date}`}>
                  View standup details →
                </BlockerLink>
              </BlockerItem>
            ))}
          </BlockerList>
        )}
      </Card>
    </PageContainer>
  );
};

export default BlockerAnalysis; 