"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface HealthIndicatorProps {
  value: number;
  maxValue: number;
}

export function HealthIndicator({ value, maxValue }: HealthIndicatorProps) {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    setPercentage(Math.min(100, (value / maxValue) * 100));
  }, [value, maxValue]);

  const getColors = () => {
    if (percentage > 70) return ['#22c55e', '#86efac']; // green
    if (percentage > 40) return ['#3b82f6', '#93c5fd']; // blue
    if (percentage > 20) return ['#facc15', '#fde047']; // yellow
    return ['#ef4444', '#fca5a5']; // red
  };

  const [startColor, endColor] = getColors();

  return (
    <div
      className="relative h-52 w-full flex flex-col items-center justify-center"
      role="img"
      aria-label={`Battery health is ${Math.round(percentage)} percent`}
    >
      <svg viewBox="0 0 100 100" className="w-40 h-40">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          className="text-muted opacity-20"
        />
        <defs>
          <linearGradient id="health-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={startColor} />
            <stop offset="100%" stopColor={endColor} />
          </linearGradient>
        </defs>
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
          animate={{ strokeDashoffset: 282.74 - (percentage / 100 * 282.74) }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          transform="rotate(-90 50 50)"
        />
      </svg>

      <motion.span
        className="text-4xl font-bold mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        {Math.round(percentage)}%
      </motion.span>
      <span className="text-sm text-muted-foreground">Estimated Battery Health</span>

      {/* Optional color legend */}
      <div className="flex justify-between mt-4 text-xs w-full px-4 text-gray-500">
        <span className="text-green-500">Healthy</span>
        <span className="text-blue-500">Good</span>
        <span className="text-yellow-500">Fair</span>
        <span className="text-red-500">Poor</span>
      </div>
    </div>
  );
}
