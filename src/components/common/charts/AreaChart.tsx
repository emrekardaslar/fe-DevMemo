import React from 'react';
import { ResponsiveContainer, AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface AreaChartProps {
  data: any[];
  xDataKey: string;
  yDataKey: string;
  colors: string[];
  animate?: boolean;
}

const AreaChart: React.FC<AreaChartProps> = ({
  data,
  xDataKey,
  yDataKey,
  colors,
  animate = true
}) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsAreaChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xDataKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area 
          type="monotone" 
          dataKey={yDataKey} 
          stroke={colors[0]} 
          fill={colors[0]}
          fillOpacity={0.3}
          isAnimationActive={animate}
        />
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
};

export default AreaChart; 