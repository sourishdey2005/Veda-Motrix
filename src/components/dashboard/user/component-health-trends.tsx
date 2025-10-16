
"use client"

import { useState } from "react";
import type { Vehicle } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Legend, ReferenceLine, Label } from "recharts";
import type { ChartConfig } from "@/components/ui/chart";
import { format, parseISO } from "date-fns";
import { Switch } from "@/components/ui/switch";

const chartConfig = {
  engine: { label: "Engine", color: "hsl(var(--chart-1))" },
  brakes: { label: "Brakes", color: "hsl(var(--chart-2))" },
  battery: { label: "Battery", color: "hsl(var(--chart-3))" },
  suspension: { label: "Suspension", color: "hsl(var(--chart-4))" },
  sensors: { label: "Sensors", color: "hsl(var(--chart-5))" },
} satisfies ChartConfig;

type ComponentKey = keyof typeof chartConfig;

export function ComponentHealthTrends({ vehicle }: { vehicle: Vehicle }) {
  const [showOnlyCritical, setShowOnlyCritical] = useState(false);
  const [activeComponents, setActiveComponents] = useState<ComponentKey[]>(['engine', 'brakes']);

  const healthData = vehicle.healthHistory || [];
  
  const toggleComponent = (component: ComponentKey) => {
    setActiveComponents(prev => 
      prev.includes(component) 
        ? prev.filter(c => c !== component) 
        : [...prev, component]
    );
  };

  const filteredData = healthData.map(entry => {
    const newEntry: any = { date: entry.date };
    if (!showOnlyCritical) {
      activeComponents.forEach(comp => newEntry[comp] = entry[comp]);
    } else {
      activeComponents.forEach(comp => {
        if (entry[comp] < 50) {
          newEntry[comp] = entry[comp];
        }
      });
    }
    return newEntry;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Component-Level Health Trend (Last 30 Days)</CardTitle>
            <CardDescription>Visualize the health of individual systems over time.</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="critical-only"
              checked={showOnlyCritical}
              onCheckedChange={setShowOnlyCritical}
            />
            <label htmlFor="critical-only" className="text-sm font-medium">Show Critical Only (&lt;50%)</label>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 pt-4">
            {Object.keys(chartConfig).map(key => (
                <button
                    key={key}
                    onClick={() => toggleComponent(key as ComponentKey)}
                    className={`px-3 py-1 text-xs rounded-full border transition-colors ${activeComponents.includes(key as ComponentKey) ? 'bg-primary text-primary-foreground border-primary' : 'bg-transparent'}`}
                    style={{ '--component-color': `var(--color-${key})` } as React.CSSProperties}
                >
                    {chartConfig[key as ComponentKey].label}
                </button>
            ))}
        </div>
      </CardHeader>
      <CardContent>
        {healthData.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-72">
            <LineChart data={filteredData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => format(parseISO(value), "MMM d")}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis domain={[0, 100]} unit="%" />
              <ChartTooltip
                cursor={true}
                content={<ChartTooltipContent />}
              />
              <Legend />
              {activeComponents.map(key => (
                 <Line
                    key={key}
                    dataKey={key}
                    type="monotone"
                    stroke={`var(--color-${key})`}
                    strokeWidth={2}
                    dot={false}
                 />
              ))}
              <ReferenceLine y={50} stroke="hsl(var(--destructive))" strokeDasharray="3 3">
                <Label value="Critical Threshold" position="insideTopLeft" fill="hsl(var(--destructive))" fontSize={10} />
              </ReferenceLine>
            </LineChart>
          </ChartContainer>
        ) : (
          <div className="flex h-72 items-center justify-center text-sm text-muted-foreground">
            No health history data available for this vehicle.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
