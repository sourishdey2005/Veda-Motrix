
"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell } from 'recharts';
import type { ChartConfig } from "@/components/ui/chart";
import { repairComplexityData, RepairComplexityData } from '@/lib/data';

const chartConfig: ChartConfig = {
  easy: { label: "Easy", color: "hsl(var(--chart-2))" },
  complex: { label: "Complex", color: "hsl(var(--chart-5))" },
};

export function RepairComplexityIndex() {
  const [data, setData] = useState<RepairComplexityData>(repairComplexityData);

  const memoizedUpdater = useCallback(() => {
    setData(prevData => {
      const shift = (Math.random() - 0.5) * 4;
      const newEasy = Math.max(10, Math.min(90, prevData.easy + shift));
      return {
        easy: newEasy,
        complex: 100 - newEasy,
      };
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(memoizedUpdater, 3500);
    return () => clearInterval(interval);
  }, [memoizedUpdater]);

  const chartData = useMemo(() => [
    { name: 'easy', value: data.easy, fill: 'var(--color-easy)' },
    { name: 'complex', value: data.complex, fill: 'var(--color-complex)' },
  ], [data]);

  const complexityScore = useMemo(() => {
    return (data.complex / (data.easy + data.complex)) * 100;
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Repair Complexity Index</CardTitle>
        <CardDescription>Ratio of easy vs. complex repairs performed.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
            >
              <Cell key="easy" fill="var(--color-easy)" />
              <Cell key="complex" fill="var(--color-complex)" />
            </Pie>
             <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-foreground text-3xl font-bold"
            >
                {complexityScore.toFixed(0)}
            </text>
             <text
                x="50%"
                y="60%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-muted-foreground text-sm"
            >
                Score
            </text>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
