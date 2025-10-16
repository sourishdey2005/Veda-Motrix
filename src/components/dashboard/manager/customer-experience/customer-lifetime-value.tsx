
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList } from 'recharts';
import type { ChartConfig } from "@/components/ui/chart";
import { customerExperienceData, type CustomerLifetimeValueData } from '@/lib/data';
import { IndianRupee } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const chartConfig: ChartConfig = {
  clv: { label: "CLV", color: "hsl(var(--chart-1))" },
};

export function CustomerLifetimeValue() {
  const [data, setData] = useState<CustomerLifetimeValueData[]>(customerExperienceData.customerLifetimeValue);

  const memoizedUpdater = useCallback(() => {
    setData(prevData =>
      prevData.map(item => ({
        ...item,
        clv: Math.max(50000, item.clv + (Math.random() - 0.45) * 5000),
        retentionProbability: Math.min(1, Math.max(0.7, item.retentionProbability + (Math.random() - 0.5) * 0.02)),
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
        <CardTitle>Customer Lifetime Service Value (CLV)</CardTitle>
        <CardDescription>
          Predicted total revenue per customer based on service history and loyalty metrics.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map(item => (
            <div key={item.customerId} className="grid grid-cols-3 gap-4 items-center">
              <p className="font-medium text-sm truncate">{item.name}</p>
              <div className="col-span-2">
                <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-mono flex items-center">
                        <IndianRupee className="w-3.5 h-3.5 mr-1" />
                        {item.clv.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Retention: {(item.retentionProbability * 100).toFixed(0)}%
                    </p>
                </div>
                <Progress value={item.retentionProbability * 100} className="h-2" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
