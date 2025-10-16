
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList } from 'recharts';
import type { ChartConfig } from "@/components/ui/chart";
import { repairCostData, type RepairCostData } from '@/lib/data';
import { cn } from '@/lib/utils';

const chartConfig: ChartConfig = {
  deviation: { label: "Deviation (%)" },
};

export function RepairCostAnalysis() {
  const [data, setData] = useState<RepairCostData[]>(repairCostData);

  const memoizedUpdater = useCallback(() => {
    setData(prevData =>
      prevData.map(item => ({
        ...item,
        actualCost: item.actualCost + (Math.random() - 0.5) * 500,
      }))
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(memoizedUpdater, 4000);
    return () => clearInterval(interval);
  }, [memoizedUpdater]);

  const chartData = data.map(item => ({
    ...item,
    deviation: ((item.actualCost - item.standardCost) / item.standardCost) * 100,
  }));

  const overallDeviation = (data.reduce((sum, item) => sum + item.actualCost, 0) / data.reduce((sum, item) => sum + item.standardCost, 0) - 1) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Repair Cost Deviation Analysis</CardTitle>
        <CardDescription>
          Comparison of actual repair costs against standard benchmarks.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64">
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis unit="%" />
            <ChartTooltip
              content={<ChartTooltipContent
                formatter={(value) => `${Number(value).toFixed(1)}%`}
                labelClassName="font-bold"
              />}
            />
            <Bar dataKey="deviation" fill="var(--color-deviation)" radius={4}>
              {chartData.map((entry, index) => (
                <LabelList
                  key={index}
                  dataKey="deviation"
                  position="top"
                  formatter={(value: number) => `${value.toFixed(1)}%`}
                  className={cn(
                    "text-xs",
                    entry.deviation > 0 ? "fill-red-500" : "fill-green-500"
                  )}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
        <p className="text-xs text-muted-foreground mt-4">
          <span className="font-semibold">Insight:</span> The center exceeded standard repair cost by <span className={cn("font-bold", overallDeviation > 0 ? "text-red-500" : "text-green-500")}>{overallDeviation.toFixed(1)}%</span> on average in the last 6 months.
        </p>
      </CardContent>
    </Card>
  );
}
