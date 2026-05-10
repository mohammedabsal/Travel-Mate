'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const COLORS = ['#0f766e', '#14b8a6', '#67e8f9', '#0f172a'];

export function BudgetDashboard({ data = [] }) {
  const chartData = data.length
    ? data
    : [
        { name: 'Accommodation', value: 42 },
        { name: 'Food', value: 24 },
        { name: 'Transport', value: 18 },
        { name: 'Activities', value: 16 }
      ];

  return (
    <Card className="rounded-[2rem]">
      <CardHeader>
        <CardTitle>Budget analytics</CardTitle>
        <CardDescription>Monitor spend categories and over-budget warnings.</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={65} outerRadius={110} paddingAngle={4}>
              {chartData.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}