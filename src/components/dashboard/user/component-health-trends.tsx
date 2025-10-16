
"use client"

import { useState } from "react";
import type { Vehicle } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, ReferenceLine, Label } from "recharts";
import type { ChartConfig } from "@/components/ui/chart";
import { format, parseISO } from "date-fns";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

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
  const [activeComponents, setActiveComponents] = useState<ComponentKey[]>(['engine', 'brakes', 'battery', 'suspension', 'sensors']);

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
    activeComponents.forEach(comp => {
      const value = entry[comp as keyof typeof entry];
      if (typeof value === 'number') {
        if (showOnlyCritical) {
          if (value < 50) {
            newEntry[comp] = value;
          } else {
            newEntry[comp] = null;
          }
        } else {
          newEntry[comp] = value;
        }
      }
    });
    return newEntry;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="flex-1">
            <CardTitle>Component-Level Health Trend (Last 30 Days)</CardTitle>
            <CardDescription>Visualize the health of individual systems over time.</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="critical-only"
              checked={showOnlyCritical}
              onCheckedChange={setShowOnlyCritical}
            />
            <label htmlFor="critical-only" className="text-sm font-medium whitespace-nowrap">Show Critical Only (&lt;50%)</label>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 pt-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Select Components
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Visible Components</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(Object.keys(chartConfig) as ComponentKey[]).map(key => (
                  <DropdownMenuCheckboxItem
                    key={key}
                    checked={activeComponents.includes(key)}
                    onCheckedChange={() => toggleComponent(key)}
                    onSelect={(e) => e.preventDefault()}
                  >
                    {chartConfig[key].label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
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
              {activeComponents.map(key => (
                 <Line
                    key={key}
                    dataKey={key}
                    name={chartConfig[key].label}
                    type="monotone"
                    stroke={`var(--color-${key})`}
                    strokeWidth={2}
                    dot={false}
                    connectNulls
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
