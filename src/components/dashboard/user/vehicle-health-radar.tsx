"use client"

import { useState, useEffect, useCallback } from "react";
import type { Vehicle } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, RadarChart } from "recharts"
import type { ChartConfig } from "@/components/ui/chart"

const chartConfig = {
  health: { label: "Health", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig

export function VehicleHealthRadar({ vehicle }: { vehicle: Vehicle }) {

    const [healthData, setHealthData] = useState(vehicle.subsystemHealth || []);

    useEffect(() => {
        if (healthData.length > 0) {
            const interval = setInterval(() => {
                setHealthData(prevData => (prevData || []).map(subsystem => ({
                    ...subsystem,
                    health: Math.min(100, Math.max(0, subsystem.health + (Math.random() - 0.5) * 10)),
                    anomalyProbability: Math.min(1, Math.max(0, subsystem.anomalyProbability + (Math.random() - 0.5) * 0.1))
                })));
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [healthData.length]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Real-Time Vehicle Health</CardTitle>
                <CardDescription>Live visualization of subsystem health for your {vehicle.model}.</CardDescription>
            </CardHeader>
            <CardContent>
                {healthData.length > 0 ? (
                    <ChartContainer config={chartConfig} className="h-64">
                        <RadarChart data={healthData}>
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent
                                    labelKey="name"
                                    formatter={(value, name, props) => (
                                        <div className="text-sm">
                                            <p>Health: {Number(value).toFixed(0)}%</p>
                                            <p>Anomaly Risk: {(props.payload.anomalyProbability * 100).toFixed(0)}%</p>
                                        </div>
                                    )}
                                />}
                            />
                            <PolarGrid />
                            <PolarAngleAxis dataKey="name" />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                            <Radar
                                name="Subsystem Health"
                                dataKey="health"
                                stroke="hsl(var(--chart-1))"
                                fill="hsl(var(--chart-1))"
                                fillOpacity={0.6}
                            />
                        </RadarChart>
                    </ChartContainer>
                ) : (
                    <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
                        No subsystem health data available.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
