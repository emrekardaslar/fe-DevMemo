import React from 'react';
import styled from 'styled-components';
import { FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';

const ComparisonContainer = styled.div`
  background-color: var(--card-background);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ComparisonTitle = styled.h3`
  font-size: 1.1rem;
  margin: 0 0 1rem 0;
  color: var(--text-color);
`;

const ComparisonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
`;

const MetricCard = styled.div`
  display: flex;
  flex-direction: column;
`;

const MetricName = styled.div`
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
`;

const MetricValue = styled.div`
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--text-color);
  margin-bottom: 0.5rem;
`;

interface DeltaProps {
  type: 'increase' | 'decrease' | 'same';
}

const MetricDelta = styled.div<DeltaProps>`
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: ${props => 
    props.type === 'increase' 
      ? 'var(--success-color)' 
      : props.type === 'decrease' 
        ? 'var(--error-color)' 
        : 'var(--text-secondary)'
  };
`;

const DeltaIcon = styled.span`
  display: flex;
  align-items: center;
  margin-right: 0.25rem;
  font-size: 0.8rem;
`;

interface WeeklyComparisonProps {
  currentWeek: {
    standupCount: number;
    averageMood: number;
    averageProductivity: number;
    highlightCount: number;
    blockerCount: number;
    uniqueTagCount: number;
  };
  previousWeek: {
    standupCount: number;
    averageMood: number;
    averageProductivity: number;
    highlightCount: number;
    blockerCount: number;
    uniqueTagCount: number;
  } | null;
}

type ChangeType = 'increase' | 'decrease' | 'same';

interface Metric {
  name: string;
  value: number;
  previous?: number;
  valueFormatter: (val: number) => string;
  changeType: ChangeType;
  displayType?: ChangeType;
  change: string;
}

const WeeklyComparison: React.FC<WeeklyComparisonProps> = ({
  currentWeek,
  previousWeek
}) => {
  // Function to determine the change type
  const getChangeType = (current: number, previous: number | undefined): ChangeType => {
    if (!previous || current === previous) return 'same';
    return current > previous ? 'increase' : 'decrease';
  };
  
  // Function to calculate and format percentage change
  const calculateChange = (current: number, previous: number | undefined): string => {
    if (!previous || previous === 0) return '--';
    const percentChange = ((current - previous) / previous) * 100;
    return `${Math.abs(percentChange).toFixed(1)}%`;
  };
  
  // Function to get the appropriate icon for change type
  const getChangeIcon = (type: ChangeType) => {
    switch (type) {
      case 'increase':
        return <FaArrowUp />;
      case 'decrease':
        return <FaArrowDown />;
      case 'same':
        return <FaMinus />;
    }
  };
  
  // Function to get display type for blockers (where decrease is good)
  const getBlockerDisplayType = (changeType: ChangeType): ChangeType => {
    if (changeType === 'increase') return 'decrease';
    if (changeType === 'decrease') return 'increase';
    return 'same';
  };
  
  // Data for metrics
  const metrics: Metric[] = [
    {
      name: 'Standups',
      value: currentWeek.standupCount,
      previous: previousWeek?.standupCount,
      valueFormatter: (val: number) => val.toString(),
      changeType: getChangeType(currentWeek.standupCount, previousWeek?.standupCount),
      change: calculateChange(currentWeek.standupCount, previousWeek?.standupCount)
    },
    {
      name: 'Avg. Mood',
      value: currentWeek.averageMood,
      previous: previousWeek?.averageMood,
      valueFormatter: (val: number) => val.toFixed(1),
      changeType: getChangeType(currentWeek.averageMood, previousWeek?.averageMood),
      change: calculateChange(currentWeek.averageMood, previousWeek?.averageMood)
    },
    {
      name: 'Avg. Productivity',
      value: currentWeek.averageProductivity,
      previous: previousWeek?.averageProductivity,
      valueFormatter: (val: number) => val.toFixed(1),
      changeType: getChangeType(currentWeek.averageProductivity, previousWeek?.averageProductivity),
      change: calculateChange(currentWeek.averageProductivity, previousWeek?.averageProductivity)
    },
    {
      name: 'Highlights',
      value: currentWeek.highlightCount,
      previous: previousWeek?.highlightCount,
      valueFormatter: (val: number) => val.toString(),
      changeType: getChangeType(currentWeek.highlightCount, previousWeek?.highlightCount),
      change: calculateChange(currentWeek.highlightCount, previousWeek?.highlightCount)
    },
    {
      name: 'Blockers',
      value: currentWeek.blockerCount,
      previous: previousWeek?.blockerCount,
      valueFormatter: (val: number) => val.toString(),
      changeType: getChangeType(currentWeek.blockerCount, previousWeek?.blockerCount),
      // For blockers, decrease is generally better
      displayType: getBlockerDisplayType(
        getChangeType(currentWeek.blockerCount, previousWeek?.blockerCount)
      ),
      change: calculateChange(currentWeek.blockerCount, previousWeek?.blockerCount)
    },
    {
      name: 'Unique Tags',
      value: currentWeek.uniqueTagCount,
      previous: previousWeek?.uniqueTagCount,
      valueFormatter: (val: number) => val.toString(),
      changeType: getChangeType(currentWeek.uniqueTagCount, previousWeek?.uniqueTagCount),
      change: calculateChange(currentWeek.uniqueTagCount, previousWeek?.uniqueTagCount)
    }
  ];
  
  return (
    <ComparisonContainer>
      <ComparisonTitle>Weekly Comparison</ComparisonTitle>
      <ComparisonGrid>
        {metrics.map((metric) => (
          <MetricCard key={metric.name}>
            <MetricName>{metric.name}</MetricName>
            <MetricValue>{metric.valueFormatter(metric.value)}</MetricValue>
            <MetricDelta type={metric.displayType || metric.changeType}>
              <DeltaIcon>
                {getChangeIcon(metric.displayType || metric.changeType)}
              </DeltaIcon>
              {metric.change === '--' ? 'No change' : metric.change}
            </MetricDelta>
          </MetricCard>
        ))}
      </ComparisonGrid>
    </ComparisonContainer>
  );
};

export default WeeklyComparison; 