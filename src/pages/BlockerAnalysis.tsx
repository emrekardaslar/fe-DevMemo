import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { queryAPI } from '../services/api';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid, Legend } from 'recharts';

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

const ChartContainer = styled.div`
  margin: 2rem 0;
  height: 300px;
`;

const ChartLegend = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.9rem;
`;

const LegendColor = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.color};
  margin-right: 8px;
`;

const TabContainer = styled.div`
  margin-top: 2rem;
`;

const TabButtons = styled.div`
  display: flex;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 1.5rem;
`;

const TabButton = styled.button<{ active: boolean }>`
  padding: 0.75rem 1.25rem;
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  border-bottom: 2px solid ${props => props.active ? 'var(--primary-color)' : 'transparent'};
  color: ${props => props.active ? 'var(--primary-color)' : 'var(--text-secondary)'};
  font-weight: ${props => props.active ? '600' : '400'};
  transition: all 0.2s ease;
  
  &:hover {
    color: var(--primary-color);
  }
`;

const TabContent = styled.div`
  padding: 0.5rem 0;
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

// Interface for backend response
interface BlockerResponseItem {
  blocker: string;
  occurrences: number;
  dates: string[];
}

// Interface for standup with blockers
interface StandupWithBlocker {
  date: string;
  blockers: string;
  isBlockerResolved: boolean;
}

interface BlockerTrend {
  month: string;
  count: number;
  resolvedCount: number;
  unresolvedCount: number;
}

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
const RESOLVED_COLOR = '#2ecc71';
const UNRESOLVED_COLOR = '#e74c3c';

const BlockerAnalysis: React.FC = () => {
  const [blockerData, setBlockerData] = useState<BlockerData | null>(null);
  const [blockerTrends, setBlockerTrends] = useState<BlockerTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'trend' | 'details'>('overview');
  
  useEffect(() => {
    const fetchBlockers = async () => {
      try {
        setLoading(true);
        const response = await queryAPI.getBlockers();
        console.log('Blocker analysis response:', response);
        
        if (response && response.data) {
          // Transform the backend response to match the expected format
          const rawBlockers = Array.isArray(response.data) ? response.data as BlockerResponseItem[] : [];
          
          // Count total blockers
          const total = rawBlockers.reduce((sum: number, item: BlockerResponseItem) => sum + (item.occurrences || 0), 0);
          
          // Fetch all standups with blockers to check resolved status
          const blockerStandups = await queryAPI.getAllWithBlockers();
          
          // Count resolved and unresolved blockers
          let resolved = 0;
          let unresolved = 0;
          
          if (blockerStandups && blockerStandups.data) {
            const standups = blockerStandups.data as StandupWithBlocker[];
            resolved = standups.filter((s: StandupWithBlocker) => s.isBlockerResolved).length;
            unresolved = standups.filter((s: StandupWithBlocker) => !s.isBlockerResolved && s.blockers && s.blockers.trim() !== '').length;
          }
          
          // Process the blockers into the expected format
          const processedData: BlockerData = {
            total,
            resolved,
            unresolved,
            blockers: [],
            mostFrequentTerms: []
          };
          
          // Convert to the format expected by the component
          if (rawBlockers.length > 0) {
            // Extract blockers
            processedData.blockers = rawBlockers.flatMap((item: BlockerResponseItem) => {
              // Each blocker item might have multiple dates
              return (item.dates || []).map((date: string) => {
                // Find the standup to determine if it's resolved
                const standup = blockerStandups?.data?.find((s: StandupWithBlocker) => s.date === date);
                const resolved = standup ? standup.isBlockerResolved : false;
                
                return {
                  date,
                  text: item.blocker || '',
                  resolved
                };
              });
            });
            
            // Extract most frequent terms - using the blockers themselves as terms
            processedData.mostFrequentTerms = rawBlockers
              .slice(0, 5)
              .map((item: BlockerResponseItem) => ({
                term: item.blocker || '',
                count: item.occurrences || 0
              }));
          }

          // Generate trend data by grouping by month
          const trendMap = new Map<string, BlockerTrend>();

          if (blockerStandups && blockerStandups.data) {
            const standups = blockerStandups.data as StandupWithBlocker[];
            
            standups.forEach((standup: StandupWithBlocker) => {
              try {
                const date = new Date(standup.date);
                const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
                const monthName = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
                
                if (!trendMap.has(monthKey)) {
                  trendMap.set(monthKey, {
                    month: monthName,
                    count: 0,
                    resolvedCount: 0,
                    unresolvedCount: 0
                  });
                }
                
                const trendData = trendMap.get(monthKey)!;
                trendData.count += 1;
                
                if (standup.isBlockerResolved) {
                  trendData.resolvedCount += 1;
                } else {
                  trendData.unresolvedCount += 1;
                }
              } catch (err) {
                console.error('Error processing date for trend:', err);
              }
            });
          }
          
          // Convert map to array and sort by date
          const trends = Array.from(trendMap.values());
          trends.sort((a, b) => {
            const [monthA, yearA] = a.month.split(' ');
            const [monthB, yearB] = b.month.split(' ');
            
            if (yearA !== yearB) {
              return yearA.localeCompare(yearB);
            }
            
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return monthNames.indexOf(monthA) - monthNames.indexOf(monthB);
          });
          
          setBlockerTrends(trends);
          setBlockerData(processedData);
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
    if (!dateString) return 'Unknown Date';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  // Custom tooltip for the pie chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ 
          backgroundColor: '#fff', 
          padding: '10px', 
          border: '1px solid #ccc',
          borderRadius: '4px' 
        }}>
          <p style={{ margin: 0 }}>{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
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

  // Prepare data for pie chart
  const pieData = [
    { name: 'Resolved', value: blockerData.resolved },
    { name: 'Unresolved', value: blockerData.unresolved }
  ];

  // Prepare data for the bar chart of most frequent terms
  const barData = blockerData.mostFrequentTerms.map(term => ({
    name: term.term.length > 15 ? term.term.substring(0, 15) + '...' : term.term,
    value: term.count,
    fullName: term.term // Keep the full name for tooltip
  }));
  
  return (
    <PageContainer>
      <PageHeader>
        <Title>Blocker Analysis</Title>
        <BackLink to="/">← Back to dashboard</BackLink>
      </PageHeader>
      
      <Card>
        <StatsContainer>
          <StatCard>
            <StatValue>{blockerData.total || 0}</StatValue>
            <StatLabel>Total Blockers</StatLabel>
          </StatCard>
          
          <StatCard style={{ backgroundColor: 'rgba(46, 204, 113, 0.1)' }}>
            <StatValue style={{ color: 'var(--success-color)' }}>{blockerData.resolved || 0}</StatValue>
            <StatLabel>Resolved</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatValue>{blockerData.unresolved || 0}</StatValue>
            <StatLabel>Unresolved</StatLabel>
          </StatCard>
        </StatsContainer>

        <TabContainer>
          <TabButtons>
            <TabButton 
              active={activeTab === 'overview'} 
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </TabButton>
            <TabButton 
              active={activeTab === 'trend'} 
              onClick={() => setActiveTab('trend')}
            >
              Trends
            </TabButton>
            <TabButton 
              active={activeTab === 'details'} 
              onClick={() => setActiveTab('details')}
            >
              Details
            </TabButton>
          </TabButtons>

          <TabContent>
            {activeTab === 'overview' && (
              <>
                {/* Resolution Status Pie Chart */}
                <SectionTitle>Blocker Resolution Status</SectionTitle>
                <ChartContainer>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        <Cell key="resolved" fill={RESOLVED_COLOR} />
                        <Cell key="unresolved" fill={UNRESOLVED_COLOR} />
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <ChartLegend>
                  <LegendItem>
                    <LegendColor color={RESOLVED_COLOR} />
                    Resolved
                  </LegendItem>
                  <LegendItem>
                    <LegendColor color={UNRESOLVED_COLOR} />
                    Unresolved
                  </LegendItem>
                </ChartLegend>

                {/* Most Common Blockers Bar Chart */}
                {blockerData.mostFrequentTerms && blockerData.mostFrequentTerms.length > 0 && (
                  <>
                    <SectionTitle>Common Blocker Terms</SectionTitle>
                    <ChartContainer>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="name" 
                            angle={-45} 
                            textAnchor="end" 
                            height={60} 
                            interval={0}
                          />
                          <YAxis />
                          <Tooltip 
                            formatter={(value: any, name: any, props: any) => [value, props.payload.fullName]} 
                            labelFormatter={(value) => ''}
                          />
                          <Bar dataKey="value" fill="#8884d8">
                            {barData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </>
                )}
              </>
            )}

            {activeTab === 'trend' && (
              <>
                <SectionTitle>Blocker Trends Over Time</SectionTitle>
                {blockerTrends.length > 0 ? (
                  <ChartContainer>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={blockerTrends}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="count" 
                          name="Total Blockers" 
                          stroke="#8884d8" 
                          activeDot={{ r: 8 }} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="resolvedCount" 
                          name="Resolved" 
                          stroke={RESOLVED_COLOR} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="unresolvedCount" 
                          name="Unresolved" 
                          stroke={UNRESOLVED_COLOR} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <EmptyMessage>Not enough data to display trends</EmptyMessage>
                )}
              </>
            )}

            {activeTab === 'details' && (
              <>
                <SectionTitle>Blockers List</SectionTitle>
                {!blockerData.blockers || blockerData.blockers.length === 0 ? (
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
              </>
            )}
          </TabContent>
        </TabContainer>
      </Card>
    </PageContainer>
  );
};

export default BlockerAnalysis; 