import React from 'react';
import { ResponsiveContainer, ScatterChart as RechartsScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ZAxis } from 'recharts';

interface ScatterChartProps {
  data: any[];
  xDataKey: string;
  yDataKey: string;
  colors: string[];
  animate?: boolean;
}

const ScatterChart: React.FC<ScatterChartProps> = ({
  data,
  xDataKey,
  yDataKey,
  colors,
  animate = true
}) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsScatterChart
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xDataKey} name="x" />
        <YAxis dataKey={yDataKey} name="y" />
        <ZAxis range={[60, 60]} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Legend />
        <Scatter 
          name="Data" 
          data={data} 
          fill={colors[0]}
          isAnimationActive={animate}
        />
      </RechartsScatterChart>
    </ResponsiveContainer>
  );
};

export default ScatterChart; 