
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from "recharts";
import type { ChartConfig } from "@/components/ui/chart";
import { centerBenchmarkData, CenterBenchmarkData } from '@/lib/data';

const chartConfig: ChartConfig = {
  center: { label: "Your Center", color: "hsl(var(--chart-1))" },
  average: { label: "Network Average", color: "hsl(var(--chart-2))" },
};

export function MultiCenterBenchmark() {
  const [data, setData] = useState<CenterBenchmarkData[]>(centerBenchmarkData);

  const memoizedUpdater = useCallback(() => {
    setData(prevData =>
      prevData.map(item => ({
        ...item,
        center: Math.max(0, Math.min(120, item.center + (Math.random() - 0.5) * 4)),
      }))
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(memoizedUpdater, 3000);
    return () => clearInterval(interval);
  }, [memoizedUpdater]);

  const normalizedData = data.map(item => {
    const maxVal = Math.max(item.center, item.average) + 10;
    // For cost, lower is better, so we invert the logic
    if (item.metric === 'Cost') {
      return {
        ...item,
        center: (1 - (item.center / 150)) * 100, // Normalize inverted
        average: (1 - (item.average / 150)) * 100,
      }
    }
     if (item.metric === 'Turnaround') {
      return {
        ...item,
        center: (1 - (item.center / 8)) * 100, // Normalize inverted
        average: (1 - (item.average / 8)) * 100,
      }
    }
    return {
      ...item,
      center: (item.center / 100) * 100,
      average: (item.average / 100) * 100,
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Multi-Center Benchmark</CardTitle>
        <CardDescription>Your center's performance vs. network average.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-80">
          <RadarChart data={normalizedData}>
            <ChartTooltip content={<ChartTooltipContent />} />
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar name="center" dataKey="center" stroke="var(--color-center)" fill="var(--color-center)" fillOpacity={0.6} />
            <Radar name="average" dataKey="average" stroke="var(--color-average)" fill="var(--color-average)" fillOpacity={0.5} />
            <Legend />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
