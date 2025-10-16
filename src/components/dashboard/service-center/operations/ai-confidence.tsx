
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList } from 'recharts';
import type { ChartConfig } from "@/components/ui/chart";
import { aiConfidenceData, AiConfidenceData } from '@/lib/data';

const chartConfig: ChartConfig = {
  High: { label: "High", color: "hsl(var(--chart-2))" },
  Medium: { label: "Medium", color: "hsl(var(--chart-1))" },
  Low: { label: "Low", color: "hsl(var(--chart-4))" },
};

export function AiConfidence() {
  const [data, setData] = useState<AiConfidenceData[]>(aiConfidenceData);

  const memoizedUpdater = useCallback(() => {
    setData(prevData => {
      const total = prevData.reduce((sum, item) => sum + item.count, 0);
      let remaining = total;
      
      const newHigh = Math.max(5, Math.min(40, prevData[0].count + Math.floor((Math.random() - 0.4) * 3)));
      remaining -= newHigh;

      const newLow = Math.max(5, Math.min(25, prevData[2].count + Math.floor((Math.random() - 0.6) * 2)));
      remaining -= newLow;

      return [
        { level: 'High', count: newHigh },
        { level: 'Medium', count: remaining },
        { level: 'Low', count: newLow },
      ]
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(memoizedUpdater, 3000);
    return () => clearInterval(interval);
  }, [memoizedUpdater]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Confidence in Failure Prediction</CardTitle>
        <CardDescription>Distribution of prediction confidence levels.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64">
          <BarChart data={data} layout="vertical" margin={{left: 10, right: 30}}>
              <CartesianGrid horizontal={false} />
              <YAxis dataKey="level" type="category" tickLine={false} axisLine={false} tickMargin={10} />
              <XAxis type="number" hide />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="var(--color-value)" radius={4}>
                  {data.map((entry) => (
                      <LabelList
                          key={entry.level}
                          dataKey="count"
                          position="right"
                          offset={8}
                          className="fill-foreground text-xs"
                          formatter={(value: number) => `${((value / data.reduce((acc, d) => acc + d.count, 0)) * 100).toFixed(0)}%`}
                      />
                  ))}
              </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
