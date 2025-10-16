
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ReferenceArea } from "recharts";
import { workloadForecast } from "@/lib/data";
import { format } from "date-fns";
import { Bot, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

const chartConfig = {
  predictedJobs: { label: "Predicted Jobs", color: "hsl(var(--chart-1))" },
};

export function WorkloadForecast() {
  const [data] = useState(workloadForecast);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Predictive Workload Forecast</CardTitle>
          <CardDescription>Projected service demand for the next 7 days.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-72">
            <AreaChart data={data}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => format(new Date(value), "EEE, d")}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <defs>
                <linearGradient id="fillJobs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-predictedJobs)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-predictedJobs)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <ReferenceArea x1={data[4].date} x2={data[5].date} fill="hsl(var(--primary))" opacity={0.1} label={{ value: "Peak Load", position: "insideTop", fill: "hsl(var(--primary))", fontSize: 12 }} />
               <ReferenceArea x1={data[0].date} x2={data[1].date} fill="hsl(var(--chart-2))" opacity={0.1} label={{ value: "Light Load", position: "insideTop", fill: "hsl(var(--chart-2))", fontSize: 12 }} />
              <Area
                type="monotone"
                dataKey="predictedJobs"
                stroke="var(--color-predictedJobs)"
                fill="url(#fillJobs)"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card className="border-primary/50 bg-primary/5">
         <CardHeader className="flex flex-row items-start gap-4">
            <Bot className="w-8 h-8 text-primary flex-shrink-0" />
            <div>
                <CardTitle className="text-primary">AI Recommendation</CardTitle>
                <CardDescription className="text-primary/80">
                    Add one additional technician on Friday due to a predicted surge in brake-related alerts.
                </CardDescription>
            </div>
         </CardHeader>
      </Card>
    </div>
  );
}
