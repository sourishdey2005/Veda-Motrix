
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, ReferenceLine } from 'recharts';
import type { ChartConfig } from "@/components/ui/chart";
import { firstTimeFixRateData, type FirstTimeFixRateData } from '@/lib/data';

const chartConfig: ChartConfig = {
  rate: { label: "Fix Rate (%)", color: "hsl(var(--chart-1))" },
};

export function FirstTimeFixRate() {
  const [data, setData] = useState<FirstTimeFixRateData[]>(firstTimeFixRateData);

  const memoizedUpdater = useCallback(() => {
    setData(prevData =>
      prevData.map(item => ({
        ...item,
        rate: Math.min(100, Math.max(80, item.rate + (Math.random() - 0.45) * 0.5)),
      }))
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(memoizedUpdater, 4000);
    return () => clearInterval(interval);
  }, [memoizedUpdater]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>First-Time Fix Rate Trend</CardTitle>
        <CardDescription>Percentage of issues resolved on the first visit.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64">
          <LineChart data={data} margin={{ left: -20, right: 10 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis unit="%" domain={[80, 100]} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent
                indicator='line'
                formatter={(value) => `${Number(value).toFixed(1)}%`}
              />}
            />
            <Line
              type="monotone"
              dataKey="rate"
              stroke="var(--color-rate)"
              strokeWidth={2}
              dot={false}
            />
             <ReferenceLine y={95} stroke="hsl(var(--chart-2))" strokeDasharray="3 3" label={{ value: "Target", position: 'insideTopRight', fill: 'hsl(var(--chart-2))' }}/>
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
