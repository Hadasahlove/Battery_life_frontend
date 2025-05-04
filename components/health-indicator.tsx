"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface HealthIndicatorProps {
  value: number;
  maxValue: number;
}

export function HealthIndicator({ value, maxValue }: HealthIndicatorProps) {
  const [percentage, setPercentage] = useState(0);
  
  useEffect(() => {
    // Animate from 0 to the actual percentage
    setPercentage(Math.min(100, (value / maxValue) * 100));
  }, [value, maxValue]);
  
  const getColor = () => {
    if (percentage > 70) return 'from-green-500 to-green-300';
    if (percentage > 40) return 'from-blue-500 to-blue-300';
    if (percentage > 20) return 'from-yellow-500 to-yellow-300';
    return 'from-red-500 to-red-300';
  };

  return (
    <div className="relative h-52 w-full flex items-center justify-center">
      <div className="absolute inset-0 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-muted opacity-20"
          />
          
          {/* Foreground circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#health-gradient)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="282.74"
            initial={{ strokeDashoffset: 282.74 }}
            animate={{ 
              strokeDashoffset: 282.74 - (percentage / 100 * 282.74)
            }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            transform="rotate(-90 50 50)"
          />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="health-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" className={cn("stop-color-start", getColor().split(' ')[0])} />
              <stop offset="100%" className={cn("stop-color-end", getColor().split(' ')[1])} />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      <div className="relative flex flex-col items-center justify-center text-center">
        <motion.span
          className="text-4xl font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {Math.round(percentage)}%
        </motion.span>
        <span className="text-sm text-muted-foreground">Battery Health</span>
      </div>
    </div>
  );
}