
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ReferenceLine } from 'recharts';
import type { ChartConfig } from "@/components/ui/chart";
import { anomalyTimelineData, AnomalyTimelineDataPoint } from '@/lib/data';
import { ShieldAlert } from 'lucide-react';

const chartConfig: ChartConfig = {
  score: { label: "Anomaly Score", color: "hsl(var(--chart-5))" },
};

export function AnomalyTimeline() {
  const [data, setData] = useState<AnomalyTimelineDataPoint[]>(anomalyTimelineData);

  const memoizedUpdater = useCallback(() => {
    setData(prevData =>
      prevData.map(item => ({
        ...item,
        score: Math.min(1, Math.max(0, item.score + (Math.random() - 0.5) * 0.1)),
      }))
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(memoizedUpdater, 2500);
    return () => clearInterval(interval);
  }, [memoizedUpdater]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
            <ShieldAlert className='w-6 h-6 text-red-500'/>
            Anomaly Detection Timeline
        </CardTitle>
        <CardDescription>
          UEBA-driven visualization of the anomaly score per hour. Spikes indicate unusual events.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-72">
          <AreaChart data={data}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="time" tickMargin={8} />
            <YAxis domain={[0, 1]} tickFormatter={(val) => val.toFixed(1)} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator='line' />}
            />
            <defs>
              <linearGradient id="fillAnomaly" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-score)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-score)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Area
              dataKey="score"
              type="monotone"
              fill="url(#fillAnomaly)"
              stroke="var(--color-score)"
              strokeWidth={2}
            />
            <ReferenceLine y={0.7} stroke="hsl(var(--destructive))" strokeDasharray="3 3" label={{ value: "High Anomaly Threshold", position: 'insideTopLeft', fill: 'hsl(var(--destructive))' }} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
