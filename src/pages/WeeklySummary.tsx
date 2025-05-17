import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { queryAPI } from '../services/api';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import WeekNavigation from '../components/standups/WeekNavigation';
import WeekCalendar from '../components/standups/WeekCalendar';
import WeeklyComparison from '../components/standups/WeeklyComparison';
import { FaDownload, FaCopy, FaPrint, FaShare } from 'react-icons/fa';

const PageContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
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

const ActionBar = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--card-background);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 0.5rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
  }
  
  svg {
    margin-right: 0.5rem;
  }
`;

const LinkItem = styled(Link)`
  color: var(--primary-color);
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
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
  fullDate: string;
  mood: number;
  productivity: number;
}

interface ComparisonData {
  standupCount: number;
  averageMood: number;
  averageProductivity: number;
  highlightCount: number;
  blockerCount: number;
  uniqueTagCount: number;
}

// Add type for tooltip payload
interface TooltipPayload {
  payload: ChartData;
  value: number;
  name: 'Mood' | 'Productivity';
}

const WeeklySummaryPage: React.FC = () => {
  const [weekData, setWeekData] = useState<WeeklySummary | null>(null);
  const [previousWeekData, setPreviousWeekData] = useState<WeeklySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Initialize start and end dates to current week
  useEffect(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    
    setStartDate(startOfWeek.toISOString().split('T')[0]);
    setEndDate(endOfWeek.toISOString().split('T')[0]);
  }, []);
  
  // Fetch week data when dates change
  useEffect(() => {
    if (startDate && endDate) {
      fetchWeeklySummary(startDate, endDate);
      fetchPreviousWeekSummary(startDate);
    }
  }, [startDate, endDate]);
  
  // Fetch weekly summary
  const fetchWeeklySummary = async (start: string, end: string) => {
    try {
      setLoading(true);
      const response = await queryAPI.getWeeklySummary(start, end);
      console.log('Weekly summary response:', response);
      
      if (!response) {
        throw new Error('No data received from API');
      }
      
      // Set the weekly data
      setWeekData(response);
      
      // Prepare chart data from standups
      if (response.standups && Array.isArray(response.standups.dates)) {
        const dates = response.standups.dates;
        const moodData = response.mood?.data || [];
        const productivityData = response.productivity?.data || [];
        
        const preparedData = dates.map((date: string, index: number) => ({
          name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
          fullDate: date,
          mood: moodData[index] || 0,
          productivity: productivityData[index] || 0
        }));
        
        setChartData(preparedData);
      } else {
        setChartData([]);
      }
    } catch (err) {
      console.error('Error fetching weekly summary:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch previous week's summary
  const fetchPreviousWeekSummary = async (currentStartDate: string) => {
    try {
      const currentStart = new Date(currentStartDate);
      const previousStart = new Date(currentStart);
      previousStart.setDate(currentStart.getDate() - 7);
      
      const previousEnd = new Date(previousStart);
      previousEnd.setDate(previousStart.getDate() + 6);
      
      const prevStart = previousStart.toISOString().split('T')[0];
      const prevEnd = previousEnd.toISOString().split('T')[0];
      
      const response = await queryAPI.getWeeklySummary(prevStart, prevEnd);
      
      if (response) {
        setPreviousWeekData(response);
      } else {
        setPreviousWeekData(null);
      }
    } catch (err) {
      console.error('Error fetching previous week summary:', err);
      setPreviousWeekData(null);
    }
  };
  
  // Handle week change
  const handleWeekChange = (newStartDate: string, newEndDate: string) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };
  
  // Get comparison data
  const getComparisonData = (): { current: ComparisonData, previous: ComparisonData | null } => {
    const current: ComparisonData = {
      standupCount: weekData?.standups?.total || 0,
      averageMood: weekData?.mood?.average || 0,
      averageProductivity: weekData?.productivity?.average || 0,
      highlightCount: weekData?.highlights?.length || 0,
      blockerCount: weekData?.blockers?.length || 0,
      uniqueTagCount: weekData?.tags?.length || 0
    };
    
    const previous = previousWeekData ? {
      standupCount: previousWeekData?.standups?.total || 0,
      averageMood: previousWeekData?.mood?.average || 0,
      averageProductivity: previousWeekData?.productivity?.average || 0,
      highlightCount: previousWeekData?.highlights?.length || 0,
      blockerCount: previousWeekData?.blockers?.length || 0,
      uniqueTagCount: previousWeekData?.tags?.length || 0
    } : null;
    
    return { current, previous };
  };
  
  // Format date for display
  const formatDate = (dateString: string): string => {
    if (!dateString) return 'Unknown Date';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };
  
  // Copy summary to clipboard
  const handleCopySummary = () => {
    if (!weekData) return;
    
    const summaryText = `
Weekly Summary (${formatDate(weekData.period.startDate)} to ${formatDate(weekData.period.endDate)})

Standups: ${weekData.standups.total}
Average Mood: ${weekData.mood.average.toFixed(1)}/5
Average Productivity: ${weekData.productivity.average.toFixed(1)}/5
Highlights: ${weekData.highlights.length}

Key Achievements:
${weekData.achievements.map(a => `- ${a}`).join('\n')}

Plans:
${weekData.plans.map(p => `- ${p}`).join('\n')}

Blockers:
${weekData.blockers.map(b => `- ${b}`).join('\n')}

Top Tags:
${weekData.tags.slice(0, 5).map(t => `- ${t.tag} (${t.count})`).join('\n')}
    `.trim();
    
    navigator.clipboard.writeText(summaryText)
      .then(() => {
        alert('Summary copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy summary:', err);
        alert('Failed to copy summary. Please try again.');
      });
  };
  
  // Print summary
  const handlePrint = () => {
    window.print();
  };
  
  if (loading && !weekData) {
    return <LoadingMessage>Loading weekly summary...</LoadingMessage>;
  }
  
  if (error && !weekData) {
    return <ErrorMessage>Error: {error}</ErrorMessage>;
  }
  
  if (!weekData) {
    return <ErrorMessage>No weekly data available</ErrorMessage>;
  }
  
  const { current, previous } = getComparisonData();
  
  return (
    <PageContainer>
      <PageHeader>
        <Title>Weekly Summary</Title>
        <BackLink to="/">← Back to dashboard</BackLink>
      </PageHeader>
      
      <WeekNavigation 
        startDate={startDate} 
        endDate={endDate} 
        onWeekChange={handleWeekChange} 
      />
      
      <ActionBar>
        <ActionButton onClick={handleCopySummary} title="Copy summary to clipboard">
          <FaCopy /> Copy
        </ActionButton>
        <ActionButton onClick={handlePrint} title="Print summary">
          <FaPrint /> Print
        </ActionButton>
      </ActionBar>
      
      <WeekCalendar 
        startDate={startDate}
        dates={weekData.standups.dates || []}
        highlights={weekData.highlights.map(h => {
          console.log("Processing highlight for calendar:", h);
          const datePart = h.split(':')[0].trim();
          console.log("Extracted date part for highlight:", datePart);
          return datePart;
        }) || []}
      />
      
      {previous && <WeeklyComparison currentWeek={current} previousWeek={previous} />}
      
      <Card>
        <WeekInfo>
          <WeekDate>
            {weekData.period && weekData.period.startDate ? formatDate(weekData.period.startDate) : 'Unknown'} to {weekData.period && weekData.period.endDate ? formatDate(weekData.period.endDate) : 'Unknown'}
          </WeekDate>
          <div>{weekData.standups && weekData.standups.total ? weekData.standups.total : 0} standup entries this week</div>
        </WeekInfo>
        
        <StatsGrid>
          <StatCard>
            <StatValue>{weekData.mood && weekData.mood.average ? weekData.mood.average.toFixed(1) : 'N/A'}</StatValue>
            <StatLabel>Average Mood</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatValue>{weekData.productivity && weekData.productivity.average ? weekData.productivity.average.toFixed(1) : 'N/A'}</StatValue>
            <StatLabel>Average Productivity</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatValue>{weekData.highlights && weekData.highlights.length ? weekData.highlights.length : 0}</StatValue>
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
                    labelFormatter={(label: string, payload: any[]) => {
                      if (payload?.[0]?.payload?.fullDate) {
                        return `${label} (${new Date(payload[0].payload.fullDate).toLocaleDateString()})`;
                      }
                      return label;
                    }}
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
        
        {weekData.tags && weekData.tags.length > 0 && (
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
        
        {weekData.achievements && weekData.achievements.length > 0 && (
          <>
            <SectionTitle>Key Achievements</SectionTitle>
            <TaskList>
              {weekData.achievements.map((achievement, index) => (
                <TaskItem key={index}>{achievement}</TaskItem>
              ))}
            </TaskList>
          </>
        )}
        
        {weekData.plans && weekData.plans.length > 0 && (
          <>
            <SectionTitle>Plans & Focus Areas</SectionTitle>
            <TaskList>
              {weekData.plans.map((plan, index) => (
                <TaskItem key={index}>{plan}</TaskItem>
              ))}
            </TaskList>
          </>
        )}
        
        {weekData.blockers && weekData.blockers.length > 0 && (
          <>
            <SectionTitle>Challenges & Blockers</SectionTitle>
            <TaskList>
              {weekData.blockers.map((blocker, index) => (
                <TaskItem key={index}>{blocker}</TaskItem>
              ))}
            </TaskList>
          </>
        )}
        
        {weekData.highlights && weekData.highlights.length > 0 && (
          <>
            <SectionTitle>Highlights</SectionTitle>
            <TaskList>
              {weekData.highlights.map((highlight, index) => {
                const parts = highlight.split(':');
                const date = parts[0];
                const content = parts.slice(1).join(':');
                
                return (
                  <TaskItem key={index}>
                    <LinkItem to={`/standups/${date.trim()}`}>
                      {new Date(date).toLocaleDateString()}: 
                    </LinkItem> {content.trim()}
                  </TaskItem>
                );
              })}
            </TaskList>
          </>
        )}
      </Card>
    </PageContainer>
  );
};

export default WeeklySummaryPage; 