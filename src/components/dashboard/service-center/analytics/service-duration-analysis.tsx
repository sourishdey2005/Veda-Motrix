
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ReferenceLine, Label } from 'recharts';
import type { ChartConfig } from "@/components/ui/chart";
import { serviceDurationData, type ServiceDurationData } from '@/lib/data';
import { cn } from '@/lib/utils';

const chartConfig: ChartConfig = {
  actual: { label: "Actual Time (hrs)" },
  predicted: { label: "Predicted Time (hrs)" },
};

export function ServiceDurationAnalysis() {
  const [data, setData] = useState<ServiceDurationData[]>(serviceDurationData);

  const memoizedUpdater = useCallback(() => {
    setData(prevData =>
      prevData.map(item => ({
        ...item,
        actual: Math.max(0.5, item.actual + (Math.random() - 0.5) * 0.4),
      }))
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(memoizedUpdater, 3000);
    return () => clearInterval(interval);
  }, [memoizedUpdater]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Duration: Prediction vs. Actual</CardTitle>
        <CardDescription>
          Scatter plot showing predicted vs. actual completion times.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64">
          <ScatterChart
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid />
            <XAxis type="number" dataKey="predicted" name="Predicted" unit="hr" domain={[0, 'dataMax + 1']}>
              <Label value="Predicted Time (hrs)" offset={-15} position="insideBottom" />
            </XAxis>
            <YAxis type="number" dataKey="actual" name="Actual" unit="hr" domain={[0, 'dataMax + 1']}>
              <Label value="Actual Time (hrs)" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
            </YAxis>
            <ChartTooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={<ChartTooltipContent
                labelFormatter={(_, payload) => payload[0]?.payload.task}
                formatter={(value, name) => `${Number(value).toFixed(1)}hr`}
              />}
            />
            <ReferenceLine type="y" segment={[{ x: 0, y: 0 }, { x: 10, y: 10 }]} stroke="hsl(var(--chart-1))" strokeDasharray="3 3" />
            <Scatter name="Service Tasks" data={data} fill="hsl(var(--chart-2))">
              {data.map((entry) => {
                const deviation = entry.actual > entry.predicted;
                return <circle key={entry.id} cx={0} cy={0} r={5} className={cn(deviation ? "fill-red-500" : "fill-green-500")} />;
              })}
            </Scatter>
          </ScatterChart>
        </ChartContainer>
         <p className="text-xs text-muted-foreground mt-4">
            <span className="font-semibold">Insight:</span> Points above the diagonal line indicate tasks that took longer than predicted, highlighting potential inefficiencies.
        </p>
      </CardContent>
    </Card>
  );
}
