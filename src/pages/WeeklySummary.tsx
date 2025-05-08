import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { queryAPI } from '../services/api';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

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

const WeekInfo = styled.div`
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
`;

const WeekDate = styled.div`
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  margin: 1.5rem 0 1rem 0;
  color: var(--text-color);
`;

const TaskList = styled.ul`
  margin: 0;
  padding-left: 1.5rem;
`;

const TaskItem = styled.li`
  margin-bottom: 0.75rem;
  line-height: 1.5;
`;

const TagsSection = styled.div`
  margin-top: 1.5rem;
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const Tag = styled.div`
  display: flex;
  align-items: center;
  background-color: rgba(52, 152, 219, 0.1);
  color: var(--primary-color);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.9rem;
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 1.5rem;
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

// Add new chart container
const ChartContainer = styled.div`
  margin: 2rem 0;
  height: 300px;
`;

const ChartSection = styled.div`
  margin-bottom: 2rem;
`;

interface WeeklySummary {
  period: {
    startDate: string;
    endDate: string;
  };
  standups: {
    total: number;
    dates: string[];
  };
  achievements: string[];
  plans: string[];
  blockers: string[];
  mood: {
    average: number;
    data: number[];
  };
  productivity: {
    average: number;
    data: number[];
  };
  tags: Array<{
    tag: string;
    count: number;
  }>;
  highlights: string[];
}

interface ChartData {
  name: string;
  mood: number;
  productivity: number;
}

const WeeklySummaryPage: React.FC = () => {
  const [weekData, setWeekData] = useState<WeeklySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  
  useEffect(() => {
    const fetchWeeklySummary = async () => {
      try {
        setLoading(true);
        const response = await queryAPI.getWeeklySummary();
        console.log('Weekly summary response:', response);
        
        if (response && response.data) {
          setWeekData(response.data);
          
          // Prepare chart data from standups
          if (response.data.standups && response.data.standups.dates) {
            const dates = response.data.standups.dates;
            const moodData = response.data.mood?.data || [];
            const productivityData = response.data.productivity?.data || [];
            
            const preparedData = dates.map((date: string, index: number) => {
              return {
                name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
                fullDate: date,
                mood: moodData[index] || 0,
                productivity: productivityData[index] || 0
              };
            });
            
            setChartData(preparedData);
          }
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching weekly summary:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchWeeklySummary();
  }, []);
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  if (loading) {
    return <LoadingMessage>Loading weekly summary...</LoadingMessage>;
  }
  
  if (error) {
    return <ErrorMessage>Error: {error}</ErrorMessage>;
  }
  
  if (!weekData) {
    return <ErrorMessage>No weekly data available</ErrorMessage>;
  }
  
  return (
    <PageContainer>
      <PageHeader>
        <Title>Weekly Summary</Title>
        <BackLink to="/dashboard">← Back to dashboard</BackLink>
      </PageHeader>
      
      <Card>
        <WeekInfo>
          <WeekDate>
            {formatDate(weekData.period.startDate)} to {formatDate(weekData.period.endDate)}
          </WeekDate>
          <div>{weekData.standups.total} standup entries this week</div>
        </WeekInfo>
        
        <StatsGrid>
          <StatCard>
            <StatValue>{weekData.mood.average ? weekData.mood.average.toFixed(1) : 'N/A'}</StatValue>
            <StatLabel>Average Mood</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatValue>{weekData.productivity.average ? weekData.productivity.average.toFixed(1) : 'N/A'}</StatValue>
            <StatLabel>Average Productivity</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatValue>{weekData.highlights.length}</StatValue>
            <StatLabel>Highlights</StatLabel>
          </StatCard>
        </StatsGrid>
        
        {chartData.length > 0 && (
          <ChartSection>
            <SectionTitle>Mood & Productivity Trends</SectionTitle>
            <ChartContainer>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip 
                    formatter={(value, name) => [value, name === 'mood' ? 'Mood' : 'Productivity']}
                    labelFormatter={(label) => `Day: ${label}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="mood"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                    name="Mood"
                  />
                  <Line
                    type="monotone"
                    dataKey="productivity"
                    stroke="#82ca9d"
                    name="Productivity"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </ChartSection>
        )}
        
        {weekData.tags.length > 0 && (
          <ChartSection>
            <SectionTitle>Tag Distribution</SectionTitle>
            <ChartContainer>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={weekData.tags}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="tag" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="count"
                    fill="#3498db"
                    name="Occurrences"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </ChartSection>
        )}
        
        {weekData.achievements.length > 0 && (
          <>
            <SectionTitle>Key Achievements</SectionTitle>
            <TaskList>
              {weekData.achievements.map((achievement, index) => (
                <TaskItem key={index}>{achievement}</TaskItem>
              ))}
            </TaskList>
          </>
        )}
        
        {weekData.plans.length > 0 && (
          <>
            <SectionTitle>Plans & Focus Areas</SectionTitle>
            <TaskList>
              {weekData.plans.map((plan, index) => (
                <TaskItem key={index}>{plan}</TaskItem>
              ))}
            </TaskList>
          </>
        )}
        
        {weekData.blockers.length > 0 && (
          <>
            <SectionTitle>Challenges & Blockers</SectionTitle>
            <TaskList>
              {weekData.blockers.map((blocker, index) => (
                <TaskItem key={index}>{blocker}</TaskItem>
              ))}
            </TaskList>
          </>
        )}
        
        {weekData.highlights.length > 0 && (
          <>
            <SectionTitle>Highlights</SectionTitle>
            <TaskList>
              {weekData.highlights.map((highlight, index) => (
                <TaskItem key={index}>{highlight}</TaskItem>
              ))}
            </TaskList>
          </>
        )}
      </Card>
    </PageContainer>
  );
};

export default WeeklySummaryPage; 