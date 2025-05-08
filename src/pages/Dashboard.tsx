import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { fetchStandups, toggleHighlight, deleteStandup } from '../redux/standups/actions';
import { RootState } from '../redux/store';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { standupAPI, queryAPI } from '../services/api';
import StandupCard from '../components/standups/StandupCard';
import { Standup } from '../redux/standups/types';

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

interface Stats {
  totalStandups: number;
  dateRange: {
    firstDate: string;
    lastDate: string;
    totalDays: number;
  };
  tagsStats: {
    uniqueTagsCount: number;
    topTags: Array<{ tag: string; count: number }>;
  };
  blockersStats: {
    total: number;
    percentage: number;
  };
  moodStats: {
    average: number;
    entriesWithMood: number;
  };
  productivityStats: {
    average: number;
    entriesWithProductivity: number;
  };
  highlights: {
    count: number;
    dates: string[];
  };
}

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { standups, loading } = useSelector((state: RootState) => state.standups);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [recentStandups, setRecentStandups] = useState<Standup[]>([]);
  
  useEffect(() => {
    dispatch(fetchStandups());
    
    const fetchStats = async () => {
      setLoadingStats(true);
      try {
        const response = await standupAPI.getStats();
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoadingStats(false);
      }
    };
    
    const fetchRecentStandups = async () => {
      try {
        const response = await standupAPI.getAll();
        setRecentStandups(response.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching recent standups:', error);
      }
    };
    
    fetchStats();
    fetchRecentStandups();
  }, [dispatch]);
  
  const handleToggleHighlight = (date: string) => {
    console.log('Dashboard: Toggling highlight for date:', date);
    dispatch(toggleHighlight(date));
    
    setRecentStandups(prevStandups => 
      prevStandups.map(standup => 
        standup.date === date 
          ? { ...standup, isHighlight: !standup.isHighlight } 
          : standup
      )
    );
  };
  
  const handleDelete = (date: string) => {
    if (window.confirm('Are you sure you want to delete this standup?')) {
      console.log('Dashboard: Deleting standup for date:', date);
      dispatch(deleteStandup(date));
      
      setRecentStandups(prevStandups => 
        prevStandups.filter(standup => standup.date !== date)
      );
    }
  };
  
  const renderStats = () => {
    if (loadingStats || !stats) {
      return <LoadingMessage>Loading stats...</LoadingMessage>;
    }
    
    return (
      <StatsGrid>
        <StatCard>
          <StatValue>{stats.totalStandups}</StatValue>
          <StatLabel>Total Entries</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatValue>{stats.highlights.count}</StatValue>
          <StatLabel>Highlights</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatValue>{stats.moodStats.average ? stats.moodStats.average.toFixed(1) : '-'}</StatValue>
          <StatLabel>Avg. Mood</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatValue>{stats.productivityStats.average ? stats.productivityStats.average.toFixed(1) : '-'}</StatValue>
          <StatLabel>Avg. Productivity</StatLabel>
        </StatCard>
      </StatsGrid>
    );
  };
  
  const renderTopTags = () => {
    if (loadingStats || !stats) {
      return <LoadingMessage>Loading tags...</LoadingMessage>;
    }
    
    if (stats.tagsStats.topTags.length === 0) {
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
        <ActionButton to="/standups/new">Create Today's Standup</ActionButton>
      </WelcomeSection>
      
      <DashboardGrid>
        <GridSection>
          <SectionTitle>
            <SectionIcon>📝</SectionIcon>
            Recent Standups
            <ViewAllLink to="/standups">View All</ViewAllLink>
          </SectionTitle>
          
          {loading ? (
            <LoadingMessage>Loading standups...</LoadingMessage>
          ) : recentStandups.length === 0 ? (
            <p>No standups found. Get started by creating your first standup!</p>
          ) : (
            recentStandups.map((standup) => (
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
            </SectionTitle>
            {renderTopTags()}
          </GridSection>
        </div>
      </DashboardGrid>
    </PageContainer>
  );
};

export default Dashboard; 