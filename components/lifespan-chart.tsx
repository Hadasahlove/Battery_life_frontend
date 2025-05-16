"use client";

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

interface LifespanChartProps {
  rul: number;
  yearsLeft: number;
  mileagePerCycle: number;
  dailyMileage: number;
}

export function LifespanChart({ rul, yearsLeft, mileagePerCycle, dailyMileage }: LifespanChartProps) {
  const { theme } = useTheme();
  const [chartData, setChartData] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const data = [];
    const totalMileage = rul * mileagePerCycle;
    const cyclesPerYear = (365 * dailyMileage) / mileagePerCycle;
    const totalYears = rul / cyclesPerYear;

    const initialHealth = 100;
    const finalHealth = 20;

    for (let year = 0; year <= Math.ceil(totalYears) + 1; year++) {
      const cyclesUsed = year * cyclesPerYear;
      const health = Math.max(
        finalHealth,
        initialHealth - (initialHealth - finalHealth) * Math.pow(year / totalYears, 1.2)
      );
      const mileage = Math.min(totalMileage, year * 365 * dailyMileage);

      data.push({ year, health, mileage });
    }

    setChartData(data);
  }, [rul, yearsLeft, mileagePerCycle, dailyMileage, mounted]);

  if (!mounted) return null;

  return (
    <div className="h-96 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          <defs>
            <linearGradient id="healthGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="mileageGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />

          <XAxis
            dataKey="year"
            tick={{ fontSize: 12 }}
            label={{
              value: 'Years',
              offset: -8,
              position: 'insideBottomRight',
              fill: '#6b7280',
              fontSize: 12,
            }}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            label={{
              value: 'Health (%)',
              angle: -90,
              position: 'insideLeft',
              fill: '#6b7280',
              fontSize: 12,
            }}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
              borderColor: theme === 'dark' ? '#374151' : '#d1d5db',
            }}
            labelClassName="font-semibold"
            formatter={(value: number, name: string) => {
              if (name === 'health') return [`${Math.round(value)}%`, 'Battery Health'];
              if (name === 'mileage') return [`${Math.round(value)} km`, 'Total Mileage'];
              return [value, name];
            }}
          />

          <Area
            type="monotone"
            dataKey="health"
            stroke="#16a34a"
            fill="url(#healthGradient)"
            strokeWidth={2}
          />

          <Area
            type="monotone"
            dataKey="mileage"
            stroke="#3b82f6"
            fill="url(#mileageGradient)"
            strokeWidth={1.5}
            dot={false}
          />

          <ReferenceLine
            x={yearsLeft}
            stroke="#f97316"
            strokeDasharray="3 3"
            label={{
              value: 'End of Life',
              position: 'top',
              fill: '#f97316',
              fontSize: 12,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
