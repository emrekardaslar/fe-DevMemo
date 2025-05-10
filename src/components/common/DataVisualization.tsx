import React, { Suspense, lazy, useMemo } from 'react';
import styled from 'styled-components';

// Lazy loaded chart components for better performance
const LineChartComponent = lazy(() => import('./charts/LineChart'));
const BarChartComponent = lazy(() => import('./charts/BarChart'));
const PieChartComponent = lazy(() => import('./charts/PieChart'));
const AreaChartComponent = lazy(() => import('./charts/AreaChart'));
const ScatterChartComponent = lazy(() => import('./charts/ScatterChart'));

const VisualizationContainer = styled.div`
  margin: 1rem 0;
  height: 300px;
  width: 100%;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1rem;
`;

const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: rgba(231, 76, 60, 0.1);
  border-radius: 8px;
  padding: 1rem;
  color: var(--error-color);
`;

export type ChartType = 'line' | 'bar' | 'pie' | 'area' | 'scatter';

interface DataVisualizationProps {
  type: ChartType;
  data: any[];
  xDataKey?: string;
  yDataKey?: string;
  nameKey?: string;
  valueKey?: string;
  colors?: string[];
  height?: number;
  animate?: boolean;
  isLoading?: boolean;
  error?: string | null;
}

const DataVisualization: React.FC<DataVisualizationProps> = ({
  type,
  data,
  xDataKey = 'name',
  yDataKey = 'value',
  nameKey = 'name',
  valueKey = 'value',
  colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'],
  height = 300,
  animate = true,
  isLoading = false,
  error = null
}) => {
  // Memoize the data to prevent unnecessary re-renders
  const memoizedData = useMemo(() => data, [data]);
  
  if (isLoading) {
    return (
      <VisualizationContainer style={{ height }}>
        <LoadingContainer>
          <div>Loading visualization...</div>
        </LoadingContainer>
      </VisualizationContainer>
    );
  }
  
  if (error) {
    return (
      <VisualizationContainer style={{ height }}>
        <ErrorContainer>
          <div>Error: {error}</div>
        </ErrorContainer>
      </VisualizationContainer>
    );
  }
  
  if (!data || data.length === 0) {
    return (
      <VisualizationContainer style={{ height }}>
        <LoadingContainer>
          <div>No data available for visualization</div>
        </LoadingContainer>
      </VisualizationContainer>
    );
  }
  
  // Render the appropriate chart based on the type prop
  return (
    <VisualizationContainer style={{ height }}>
      <Suspense fallback={<LoadingContainer>Loading chart...</LoadingContainer>}>
        {type === 'line' && (
          <LineChartComponent 
            data={memoizedData} 
            xDataKey={xDataKey} 
            yDataKey={yDataKey} 
            colors={colors}
            animate={animate}
          />
        )}
        {type === 'bar' && (
          <BarChartComponent 
            data={memoizedData} 
            xDataKey={xDataKey} 
            yDataKey={yDataKey} 
            colors={colors}
            animate={animate}
          />
        )}
        {type === 'pie' && (
          <PieChartComponent 
            data={memoizedData} 
            nameKey={nameKey} 
            valueKey={valueKey} 
            colors={colors}
            animate={animate}
          />
        )}
        {type === 'area' && (
          <AreaChartComponent 
            data={memoizedData} 
            xDataKey={xDataKey} 
            yDataKey={yDataKey} 
            colors={colors}
            animate={animate}
          />
        )}
        {type === 'scatter' && (
          <ScatterChartComponent 
            data={memoizedData} 
            xDataKey={xDataKey} 
            yDataKey={yDataKey} 
            colors={colors}
            animate={animate}
          />
        )}
      </Suspense>
    </VisualizationContainer>
  );
};

export default DataVisualization; 