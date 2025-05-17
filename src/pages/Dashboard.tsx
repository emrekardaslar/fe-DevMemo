import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useStandups, Standup, StandupStats } from '../context/StandupContext';
import StandupCard from '../components/standups/StandupCard';

const PageContainer = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const WelcomeSection = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin: 0 0 0.5rem 0;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin: 0;
`;

const ActionButton = styled(Link)`
  display: inline-block;
  background-color: var(--primary-color);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  margin-top: 1rem;
  
  &:hover {
    background-color: var(--primary-dark);
    text-decoration: none;
  }
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const GridSection = styled.div`
  background-color: var(--card-background);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
`;

const SectionIcon = styled.span`
  margin-right: 0.5rem;
`;

const ViewAllLink = styled(Link)`
  font-size: 0.9rem;
  margin-left: auto;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const StatCard = styled.div`
  background-color: rgba(52, 152, 219, 0.1);
  border-radius: 6px;
  padding: 1rem;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Tag = styled.div`
  background-color: rgba(52, 152, 219, 0.1);
  color: var(--primary-color);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
`;

const TagCount = styled.span`
  background-color: var(--primary-color);
  color: white;
  border-radius: 50%;
  width: 1.25rem;
  height: 1.25rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  margin-left: 0.5rem;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 1rem;
  color: var(--error-color);
  background-color: rgba(231, 76, 60, 0.1);
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const Dashboard: React.FC = () => {
  const { standups, loading, fetchStandups, toggleHighlight, deleteStandup, getStats } = useStandups();
  
  const [stats, setStats] = useState<StandupStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [recentStandups, setRecentStandups] = useState<Standup[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // This function ensures we only load data once on component mount
    const loadInitialData = async () => {
      try {
        // Load all standups
        await fetchStandups();
        
        // Fetch stats
        setLoadingStats(true);
        try {
          const statsData = await getStats();
          setStats(statsData);
          setError(null);
        } catch (err) {
          console.error('Error fetching stats:', err);
          setError('Failed to load statistics');
        } finally {
          setLoadingStats(false);
        }
      } catch (error) {
        console.error('Error loading standups:', error);
        setError('Failed to load standups');
      }
    };
    
    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Update recentStandups when standups change
  useEffect(() => {
    if (standups && standups.length > 0) {
      setRecentStandups(standups.slice(0, 3));
    }
  }, [standups]);
  
  // Use the recentStandups
  const displayStandups = recentStandups.length > 0 ? recentStandups : [];
  
  const handleToggleHighlight = async (date: string) => {
    try {
      await toggleHighlight(date);
      
      // Update the local state to reflect the change
      setRecentStandups(prevStandups => 
        prevStandups.map(standup => 
          standup.date === date 
            ? { ...standup, isHighlight: !standup.isHighlight } 
            : standup
        )
      );
    } catch (err) {
      console.error('Error toggling highlight:', err);
      setError('Failed to update highlight status');
    }
  };
  
  const handleDelete = async (date: string) => {
    if (window.confirm('Are you sure you want to delete this standup?')) {
      try {
        await deleteStandup(date);
        
        // Update the local state to reflect the deletion
        setRecentStandups(prevStandups => 
          prevStandups.filter(standup => standup.date !== date)
        );
      } catch (err) {
        console.error('Error deleting standup:', err);
        setError('Failed to delete standup');
      }
    }
  };
  
  const renderStats = () => {
    if (loadingStats) {
      return <LoadingMessage>Loading stats...</LoadingMessage>;
    }
    
    if (!stats) {
      return <ErrorMessage>Unable to load statistics</ErrorMessage>;
    }
    
    return (
      <StatsGrid>
        <StatCard>
          <StatValue>{stats.totalStandups}</StatValue>
          <StatLabel>Total Entries</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatValue>{stats.highlights?.count || 0}</StatValue>
          <StatLabel>Highlights</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatValue>
            {stats.moodStats?.average ? stats.moodStats.average.toFixed(1) : '-'}
          </StatValue>
          <StatLabel>Avg. Mood</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatValue>
            {stats.productivityStats?.average ? stats.productivityStats.average.toFixed(1) : '-'}
          </StatValue>
          <StatLabel>Avg. Productivity</StatLabel>
        </StatCard>
      </StatsGrid>
    );
  };
  
  const renderTopTags = () => {
    if (loadingStats) {
      return <LoadingMessage>Loading tags...</LoadingMessage>;
    }
    
    if (!stats || !stats.tagsStats || !stats.tagsStats.topTags || stats.tagsStats.topTags.length === 0) {
      return <p>No tags found.</p>;
    }
    
    return (
      <TagList>
        {stats.tagsStats.topTags.map((tag, index) => (
          <Tag key={index}>
            #{tag.tag}
            <TagCount>{tag.count}</TagCount>
          </Tag>
        ))}
      </TagList>
    );
  };
  
  return (
    <PageContainer>
      <WelcomeSection>
        <Title>Welcome to StandupSync</Title>
        <Subtitle>Track and manage your daily standups all in one place</Subtitle>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <ActionButton to="/standups/new">Create Today's Standup</ActionButton>
          <ActionButton to="/weekly-summary" style={{ backgroundColor: 'var(--secondary-color)' }}>
            View Weekly Summary
          </ActionButton>
          <ActionButton to="/blocker-analysis" style={{ backgroundColor: 'var(--warning-color)' }}>
            Blocker Analysis
          </ActionButton>
        </div>
      </WelcomeSection>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <DashboardGrid>
        <GridSection>
          <SectionTitle>
            <SectionIcon>📝</SectionIcon>
            Recent Standups
            <ViewAllLink to="/standups">View All</ViewAllLink>
          </SectionTitle>
          
          {loading && displayStandups.length === 0 ? (
            <LoadingMessage>Loading standups...</LoadingMessage>
          ) : displayStandups.length === 0 ? (
            <p>No standups found. Get started by creating your first standup!</p>
          ) : (
            displayStandups.map((standup) => (
              <StandupCard
                key={standup.date}
                standup={standup}
                onToggleHighlight={handleToggleHighlight}
                onDelete={handleDelete}
              />
            ))
          )}
        </GridSection>
        
        <div>
          <GridSection>
            <SectionTitle>
              <SectionIcon>📊</SectionIcon>
              Stats Overview
            </SectionTitle>
            {renderStats()}
          </GridSection>
          
          <GridSection style={{ marginTop: '1.5rem' }}>
            <SectionTitle>
              <SectionIcon>🏷️</SectionIcon>
              Top Tags
              <ViewAllLink to="/tags">View All</ViewAllLink>
            </SectionTitle>
            {renderTopTags()}
          </GridSection>
        </div>
      </DashboardGrid>
    </PageContainer>
  );
};

export default Dashboard; 