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
import { Card } from '@/components/ui/card';

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
    
    // Generate chart data based on battery degradation over time
    const data = [];
    const totalMileage = rul * mileagePerCycle;
    const cyclesPerYear = 365 * dailyMileage / mileagePerCycle;
    const totalYears = rul / cyclesPerYear;
    
    // Start with brand new battery
    const initialHealth = 100;
    
    // End with 0% health at end of life
    const finalHealth = 20;
    
    // Create a non-linear degradation curve (accelerating degradation)
    for (let year = 0; year <= Math.ceil(totalYears) + 1; year++) {
      const cyclesUsed = year * cyclesPerYear;
      const cyclesRemaining = Math.max(0, rul - cyclesUsed);
      const healthPercentage = Math.max(
        finalHealth, 
        initialHealth - (initialHealth - finalHealth) * Math.pow(year / totalYears, 1.2)
      );
      
      data.push({
        year,
        health: cyclesUsed > rul ? finalHealth : healthPercentage,
        mileage: Math.min(totalMileage, year * 365 * dailyMileage),
      });
    }
    
    setChartData(data);
  }, [rul, yearsLeft, mileagePerCycle, dailyMileage, mounted]);

  if (!mounted) return null;

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
          <XAxis 
            dataKey="year" 
            label={{ 
              value: 'Years', 
              position: 'insideBottomRight', 
              offset: -10 
            }}
            className="text-muted-foreground text-xs"
          />
          <YAxis 
            label={{ 
              value: 'Health (%)', 
              angle: -90, 
              position: 'insideLeft',
              className: "text-muted-foreground text-xs" 
            }}
            className="text-muted-foreground text-xs"
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: theme === 'dark' ? 'hsl(var(--card))' : 'white',
              borderColor: 'hsl(var(--border))',
              color: theme === 'dark' ? 'hsl(var(--foreground))' : 'black',
            }}
            formatter={(value, name) => {
              if (name === 'health') return [`${Math.round(value as number)}%`, 'Battery Health'];
              if (name === 'mileage') return [`${Math.round(value as number)} miles`, 'Total Mileage'];
              return [value, name];
            }}
          />
          <defs>
            <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Area 
            type="monotone" 
            dataKey="health" 
            stroke="hsl(var(--chart-1))" 
            fill="url(#colorHealth)" 
            strokeWidth={2}
          />
          <ReferenceLine 
            x={yearsLeft} 
            stroke="hsl(var(--chart-2))" 
            strokeDasharray="3 3"
            label={{ 
              value: 'End of Life', 
              position: 'top',
              fill: 'hsl(var(--chart-2))',
              fontSize: 12 
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}