import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { queryAPI } from '../services/api';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

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

const ChartContainer = styled.div`
  margin: 2rem 0;
  height: 300px;
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

const EmptyStateContainer = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  background-color: var(--card-background);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const EmptyStateIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--text-secondary);
`;

const EmptyStateText = styled.p`
  color: var(--text-secondary);
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
`;

const EmptyStateButton = styled(Link)`
  display: inline-block;
  background-color: var(--primary-color);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    background-color: var(--primary-dark);
  }
`;

const MonthSelector = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
`;

const MonthButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--primary-color);
  
  &:disabled {
    color: var(--text-secondary);
    cursor: not-allowed;
  }
`;

const CurrentMonth = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background-color: rgba(52, 152, 219, 0.1);
  border-radius: 6px;
  padding: 1rem;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--primary-color);
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
`;

const TagCloud = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const TagItem = styled.div<{ size: number }>`
  padding: 0.5rem 0.75rem;
  background-color: rgba(52, 152, 219, 0.1);
  border-radius: 16px;
  font-size: ${props => 0.8 + (props.size * 0.1)}rem;
  font-weight: ${props => props.size > 5 ? 600 : 400};
`;

interface MonthlySummary {
  month: string;
  totalEntries: number;
  averageMood: number;
  averageProductivity: number;
  topTags: Array<{ tag: string; count: number; }>;
  topAccomplishments: string[];
  topBlockers: string[];
  dailyBreakdown: Array<{ 
    date: string; 
    mood: number;
    productivity: number;
    hasBlockers: boolean;
  }>;
}

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const MonthlyFocus: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [monthlySummary, setMonthlySummary] = useState<MonthlySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noData, setNoData] = useState(false);
  
  useEffect(() => {
    const fetchMonthlySummary = async () => {
      try {
        setLoading(true);
        setError(null);
        setNoData(false);
        
        // Format month as YYYY-MM for API
        const month = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`;
        
        const response = await queryAPI.getMonthlySummary(month);
        
        if (response && response.data) {
          if (response.data.totalEntries === 0) {
            // We have a response but no entries for this month
            setNoData(true);
            setMonthlySummary(null);
          } else {
            setMonthlySummary(response.data);
          }
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMonthlySummary();
  }, [currentDate]);
  
  const goToPreviousMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };
  
  const goToNextMonth = () => {
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    // Don't allow going beyond current month
    if (nextMonth <= new Date()) {
      setCurrentDate(nextMonth);
    }
  };
  
  const formatMonth = (date: Date): string => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };
  
  // Empty state component
  const EmptyState = () => (
    <EmptyStateContainer>
      <EmptyStateIcon>📅</EmptyStateIcon>
      <EmptyStateText>No standup entries for {formatMonth(currentDate)}</EmptyStateText>
      <EmptyStateButton to="/standup/new">Add a standup entry</EmptyStateButton>
    </EmptyStateContainer>
  );
  
  if (loading) {
    return (
      <PageContainer>
        <PageHeader>
          <Title>Monthly Focus</Title>
          <BackLink to="/">← Back to dashboard</BackLink>
        </PageHeader>
        
        <MonthSelector>
          <MonthButton onClick={goToPreviousMonth}>
            ←
          </MonthButton>
          <CurrentMonth>{formatMonth(currentDate)}</CurrentMonth>
          <MonthButton 
            onClick={goToNextMonth}
            disabled={
              currentDate.getMonth() === new Date().getMonth() && 
              currentDate.getFullYear() === new Date().getFullYear()
            }
          >
            →
          </MonthButton>
        </MonthSelector>
        
        <LoadingMessage>Loading monthly focus data...</LoadingMessage>
      </PageContainer>
    );
  }
  
  if (error) {
    return (
      <PageContainer>
        <PageHeader>
          <Title>Monthly Focus</Title>
          <BackLink to="/">← Back to dashboard</BackLink>
        </PageHeader>
        
        <MonthSelector>
          <MonthButton onClick={goToPreviousMonth}>
            ←
          </MonthButton>
          <CurrentMonth>{formatMonth(currentDate)}</CurrentMonth>
          <MonthButton 
            onClick={goToNextMonth}
            disabled={
              currentDate.getMonth() === new Date().getMonth() && 
              currentDate.getFullYear() === new Date().getFullYear()
            }
          >
            →
          </MonthButton>
        </MonthSelector>
        
        <ErrorMessage>Error: {error}</ErrorMessage>
      </PageContainer>
    );
  }
  
  if (noData || !monthlySummary) {
    return (
      <PageContainer>
        <PageHeader>
          <Title>Monthly Focus</Title>
          <BackLink to="/">← Back to dashboard</BackLink>
        </PageHeader>
        
        <MonthSelector>
          <MonthButton onClick={goToPreviousMonth}>
            ←
          </MonthButton>
          <CurrentMonth>{formatMonth(currentDate)}</CurrentMonth>
          <MonthButton 
            onClick={goToNextMonth}
            disabled={
              currentDate.getMonth() === new Date().getMonth() && 
              currentDate.getFullYear() === new Date().getFullYear()
            }
          >
            →
          </MonthButton>
        </MonthSelector>
        
        <EmptyState />
      </PageContainer>
    );
  }
  
  // Prepare data for tag distribution pie chart
  const tagData = monthlySummary.topTags?.slice(0, 5).map(tag => ({
    name: tag.tag,
    value: tag.count
  })) || [];
  
  // Prepare data for daily productivity chart
  const productivityData = monthlySummary.dailyBreakdown?.map(day => ({
    name: new Date(day.date).getDate().toString(),
    productivity: day.productivity,
    mood: day.mood,
    date: day.date,
    hasBlockers: day.hasBlockers
  })) || [];
  
  return (
    <PageContainer>
      <PageHeader>
        <Title>Monthly Focus</Title>
        <BackLink to="/">← Back to dashboard</BackLink>
      </PageHeader>
      
      <MonthSelector>
        <MonthButton onClick={goToPreviousMonth}>
          ←
        </MonthButton>
        <CurrentMonth>{formatMonth(currentDate)}</CurrentMonth>
        <MonthButton 
          onClick={goToNextMonth}
          disabled={
            currentDate.getMonth() === new Date().getMonth() && 
            currentDate.getFullYear() === new Date().getFullYear()
          }
        >
          →
        </MonthButton>
      </MonthSelector>
      
      <Card>
        <StatsGrid>
          <StatCard>
            <StatValue>{monthlySummary.totalEntries || 0}</StatValue>
            <StatLabel>Total Entries</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{monthlySummary.averageMood?.toFixed(1) || 0}</StatValue>
            <StatLabel>Avg Mood</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{monthlySummary.averageProductivity?.toFixed(1) || 0}</StatValue>
            <StatLabel>Avg Productivity</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{monthlySummary.dailyBreakdown?.filter(d => d.hasBlockers).length || 0}</StatValue>
            <StatLabel>Days with Blockers</StatLabel>
          </StatCard>
        </StatsGrid>
        
        <SectionTitle>Daily Productivity & Mood</SectionTitle>
        <ChartContainer>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={productivityData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 10]} />
              <Tooltip 
                formatter={(value, name) => [`${value}`, name === 'productivity' ? 'Productivity' : 'Mood']}
                labelFormatter={(value) => `Day ${value}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="productivity" 
                stroke="#8884d8" 
                name="Productivity"
                strokeWidth={2}
                dot={{ stroke: '#8884d8', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="mood" 
                stroke="#82ca9d" 
                name="Mood"
                strokeWidth={2}
                dot={{ stroke: '#82ca9d', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        <SectionTitle>Top Tags This Month</SectionTitle>
        {monthlySummary.topTags && monthlySummary.topTags.length > 0 ? (
          <>
            <ChartContainer>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tagData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {tagData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} occurrences`, 'Frequency']} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <TagCloud>
              {monthlySummary.topTags.map((tag, index) => (
                <TagItem key={index} size={Math.min(10, tag.count)}>
                  #{tag.tag} ({tag.count})
                </TagItem>
              ))}
            </TagCloud>
          </>
        ) : (
          <div>No tags recorded this month</div>
        )}
        
        <SectionTitle>Key Accomplishments</SectionTitle>
        {monthlySummary.topAccomplishments && monthlySummary.topAccomplishments.length > 0 ? (
          <ul>
            {monthlySummary.topAccomplishments.map((accomplishment, index) => (
              <li key={index}>{accomplishment}</li>
            ))}
          </ul>
        ) : (
          <div>No key accomplishments recorded this month</div>
        )}
        
        <SectionTitle>Common Blockers</SectionTitle>
        {monthlySummary.topBlockers && monthlySummary.topBlockers.length > 0 ? (
          <ul>
            {monthlySummary.topBlockers.map((blocker, index) => (
              <li key={index}>{blocker}</li>
            ))}
          </ul>
        ) : (
          <div>No blockers recorded this month</div>
        )}
      </Card>
    </PageContainer>
  );
};

export default MonthlyFocus; 