
"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList, Line, ComposedChart } from 'recharts';
import type { ChartConfig } from "@/components/ui/chart";
import { customerExperienceData, type ServiceDelayReason } from '@/lib/data';

const chartConfig: ChartConfig = {
  count: { label: "Count", color: "hsl(var(--chart-1))" },
  cumulative: { label: "Cumulative %", color: "hsl(var(--chart-5))" },
};

export function ServiceDelayAnalysis() {
  const [data, setData] = useState<ServiceDelayReason[]>(customerExperienceData.serviceDelayReasons);

  const memoizedUpdater = useCallback(() => {
    setData(prevData =>
      prevData.map(item => ({
        ...item,
        count: Math.max(0, item.count + Math.floor((Math.random() - 0.5) * 3)),
      }))
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(memoizedUpdater, 3000);
    return () => clearInterval(interval);
  }, [memoizedUpdater]);

  const chartData = useMemo(() => {
    const sortedData = [...data].sort((a, b) => b.count - a.count);
    const totalCount = sortedData.reduce((sum, item) => sum + item.count, 0);
    let cumulative = 0;
    return sortedData.map(item => {
      cumulative += item.count;
      return {
        ...item,
        cumulative: (cumulative / totalCount) * 100,
      };
    });
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Delay Cause Analysis (Pareto)</CardTitle>
        <CardDescription>
          Identifies the most significant reasons for service delays based on the 80/20 principle.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64">
          <ComposedChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="reason" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" unit="%" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" yAxisId="left" fill="var(--color-count)" radius={4}>
              <LabelList dataKey="count" position="top" offset={5} className="fill-foreground text-xs" />
            </Bar>
            <Line
              type="monotone"
              dataKey="cumulative"
              yAxisId="right"
              stroke="var(--color-cumulative)"
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
