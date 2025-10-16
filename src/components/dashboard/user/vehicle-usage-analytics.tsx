"use client"

import { useState, useEffect } from "react";
import type { Vehicle, UsageDataPoint } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceDot } from "recharts";
import type { ChartConfig } from "@/components/ui/chart";
import { format, parseISO } from "date-fns";
import { AlertTriangle } from "lucide-react";

const chartConfig = {
  distance: { label: "Distance (km)", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig;

export function VehicleUsageAnalytics({ vehicle }: { vehicle: Vehicle }) {
  const [usageData, setUsageData] = useState<UsageDataPoint[]>([]);

  useEffect(() => {
    // Initialize with static data and then simulate updates
    setUsageData(vehicle.usageHistory || []);

    const interval = setInterval(() => {
      setUsageData(prevData => {
        if (prevData.length === 0) return [];
        const newData = [...prevData];
        const randomIndex = Math.floor(Math.random() * newData.length);
        newData[randomIndex] = {
          ...newData[randomIndex],
          distance: Math.max(0, newData[randomIndex].distance + (Math.random() - 0.5) * 10),
          avgSpeed: Math.max(0, newData[randomIndex].avgSpeed + (Math.random() - 0.5) * 5),
        };
        return newData;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [vehicle.usageHistory]);

  const anomalies = usageData.filter(d => d.anomaly);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Last 30 Days Usage Analytics</CardTitle>
        <CardDescription>An overview of your driving patterns and vehicle performance.</CardDescription>
      </CardHeader>
      <CardContent>
        {usageData.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-64">
            <AreaChart data={usageData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="date"
                    tickFormatter={(value) => format(parseISO(value), "MMM d")}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                />
                <YAxis dataKey="distance" unit=" km" />
                <ChartTooltip
                    cursor={false}
                    content={
                        <ChartTooltipContent
                            formatter={(value, name, props) => (
                                <div>
                                    <p>Distance: {Number(value).toFixed(1)} km</p>
                                    <p>Avg Speed: {props.payload.avgSpeed.toFixed(1)} km/h</p>
                                    <p>Consumption: {props.payload.consumption.toFixed(1)} L/100km</p>
                                    {props.payload.anomaly && (
                                        <p className="text-red-500 mt-1">Anomaly: {props.payload.anomaly.replace('_', ' ')}</p>
                                    )}
                                </div>
                            )}
                            labelFormatter={(label) => format(parseISO(label), "eeee, MMM d")}
                        />
                    }
                />
                <Area
                    dataKey="distance"
                    type="natural"
                    fill="var(--color-distance)"
                    fillOpacity={0.4}
                    stroke="var(--color-distance)"
                />
                {anomalies.map(anomaly => (
                   <ReferenceDot
                        key={anomaly.date}
                        x={anomaly.date}
                        y={anomaly.distance}
                        r={5}
                        fill="hsl(var(--destructive))"
                        stroke="none"
                    >
                         <AlertTriangle className="w-4 h-4 text-white" />
                    </ReferenceDot>
                ))}
            </AreaChart>
            </ChartContainer>
        ) : (
             <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
                No usage data available for this vehicle.
            </div>
        )}
      </CardContent>
    </Card>
  );
}
