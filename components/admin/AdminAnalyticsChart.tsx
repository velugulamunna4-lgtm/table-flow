'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const data = [
  { time: '12 PM', orders: 18, revenue: 8400 },
  { time: '1 PM', orders: 34, revenue: 16800 },
  { time: '2 PM', orders: 28, revenue: 13900 },
  { time: '3 PM', orders: 12, revenue: 5600 },
  { time: '4 PM', orders: 8, revenue: 3800 },
  { time: '7 PM', orders: 42, revenue: 21500 },
  { time: '8 PM', orders: 55, revenue: 28400 },
  { time: '9 PM', orders: 48, revenue: 24600 },
  { time: '10 PM', orders: 24, revenue: 11200 },
];

export const AdminAnalyticsChart: React.FC = () => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EBE4DC" />
          <XAxis
            dataKey="time"
            stroke="#847C76"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#847C76"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => `₹${val / 1000}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #EBE4DC',
              boxShadow: '0 8px 30px rgba(58, 42, 34, 0.08)',
              fontFamily: 'inherit',
            }}
            formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Revenue']}
          />
          <Bar
            dataKey="revenue"
            fill="var(--accent-primary)"
            radius={[12, 12, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
