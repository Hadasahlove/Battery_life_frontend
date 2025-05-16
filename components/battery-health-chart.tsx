import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface BatteryHealthChartProps {
  rul: number;
}

export function BatteryHealthChart({ rul }: BatteryHealthChartProps) {
  // Simulate battery degradation data
  const totalCycles = Math.ceil(rul);
  const degradationData = Array.from({ length: totalCycles + 1 }, (_, i) => {
    const health = Math.max(0, 100 - (i / totalCycles) * 100);
    return {
      cycle: i,
      health: parseFloat(health.toFixed(2))
    };
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={degradationData}
        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="cycle" label={{ value: 'Cycle', position: 'insideBottomRight', offset: -5 }} />
        <YAxis label={{ value: 'Health (%)', angle: -90, position: 'insideLeft' }} />
        <Tooltip formatter={(value) => `${value}%`} />
        <Line type="monotone" dataKey="health" stroke="#82ca9d" dot={false} strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
