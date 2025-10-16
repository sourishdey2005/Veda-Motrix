
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ReferenceLine } from 'recharts';
import type { ChartConfig } from "@/components/ui/chart";
import { partLifecycleData, type PartLifecycleData } from '@/lib/data';

const chartConfig: ChartConfig = {
  failureProbability: { label: "Failure Probability (%)", color: "hsl(var(--chart-5))" },
};

export function PartFailureLifecycle() {
  const [data, setData] = useState<PartLifecycleData[]>(partLifecycleData);

  const memoizedUpdater = useCallback(() => {
    setData(prevData =>
      prevData.map(item => ({
        ...item,
        failureProbability: Math.min(100, item.failureProbability + (Math.random() - 0.48) * 2),
      }))
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(memoizedUpdater, 3500);
    return () => clearInterval(interval);
  }, [memoizedUpdater]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Part Failure Lifecycle Curve</CardTitle>
        <CardDescription>
          Failure probability of the oil pump over vehicle mileage.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64">
          <AreaChart data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="mileage"
              tickFormatter={(value) => `${value / 1000}k`}
              unit=" km"
              type="number"
              domain={[0, 'dataMax']}
            />
            <YAxis unit="%" domain={[0, 100]} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent
                indicator='line'
                formatter={(value) => `${Number(value).toFixed(1)}%`}
                labelFormatter={(label) => `${Number(label).toLocaleString()} km`}
              />}
            />
            <defs>
              <linearGradient id="fillLifecycle" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-failureProbability)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-failureProbability)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Area
              dataKey="failureProbability"
              type="natural"
              fill="url(#fillLifecycle)"
              stroke="var(--color-failureProbability)"
              strokeWidth={2}
            />
            <ReferenceLine x={45000} stroke="hsl(var(--destructive))" strokeDasharray="3 3" />
          </AreaChart>
        </ChartContainer>
        <p className="text-xs text-muted-foreground mt-4">
          <span className="font-semibold">Insight:</span> Oil pump failure probability rises sharply after 45,000 km, indicating a need for proactive replacement.
        </p>
      </CardContent>
    </Card>
  );
}
