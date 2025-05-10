import React from 'react';
import { ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface LineChartProps {
  data: any[];
  xDataKey: string;
  yDataKey: string;
  colors: string[];
  animate?: boolean;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  xDataKey,
  yDataKey,
  colors,
  animate = true
}) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xDataKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line 
          type="monotone" 
          dataKey={yDataKey} 
          stroke={colors[0]} 
          activeDot={{ r: 8 }}
          isAnimationActive={animate}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart; 