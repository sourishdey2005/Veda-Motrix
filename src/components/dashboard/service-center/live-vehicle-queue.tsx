
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Car, Wrench, CheckCircle } from 'lucide-react';
import { liveQueueData } from '@/lib/data';
import type { LiveQueueVehicle } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart, Bar, XAxis, YAxis, LabelList
} from 'recharts';
import type { ChartConfig } from "@/components/ui/chart";
import { technicians } from '@/lib/data';

const stageConfig = {
  'In Service': { icon: Car, color: 'text-blue-400', progress: 25 },
  'Diagnosis': { icon: Wrench, color: 'text-yellow-400', progress: 60 },
  'Ready for Pickup': { icon: CheckCircle, color: 'text-green-400', progress: 100 },
};

const chartConfig: ChartConfig = {
    vehiclesServiced: { label: "Vehicles Serviced", color: "hsl(var(--chart-1))" },
};


export function LiveVehicleQueue() {
  const [queue, setQueue] = useState<LiveQueueVehicle[]>(liveQueueData);
  const allTechsPerformance = technicians.map(tech => ({
    name: tech.name.split(' ')[0],
    vehiclesServiced: tech.performance.vehiclesServicedToday
  }));


  useEffect(() => {
    const interval = setInterval(() => {
      setQueue(prevQueue => {
        if(prevQueue.length === 0) return [];
        const newQueue = [...prevQueue];
        const vehicleToUpdate = newQueue[Math.floor(Math.random() * newQueue.length)];
        
        if (vehicleToUpdate) {
            const stages = Object.keys(stageConfig) as LiveQueueVehicle['stage'][];
            const currentStageIndex = stages.indexOf(vehicleToUpdate.stage);
            const nextStageIndex = (currentStageIndex + 1) % stages.length;
            vehicleToUpdate.stage = stages[nextStageIndex];
        }

        return newQueue.sort((a,b) => stageConfig[a.stage].progress - stageConfig[b.stage].progress);
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
        <Card>
        <CardHeader>
            <CardTitle>Live Vehicle Queue Tracker</CardTitle>
            <CardDescription>Real-time visualization of vehicles in the service bay.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="relative w-full h-24 bg-muted rounded-lg overflow-hidden">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-border -translate-y-1/2" />
            <div className="absolute top-1/2 left-0 w-full flex justify-between -translate-y-1/2">
                {Object.keys(stageConfig).map(stage => (
                <div key={stage} className="relative">
                    <div className="w-4 h-4 bg-background border-2 border-border rounded-full" />
                    <p className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">{stage}</p>
                </div>
                ))}
            </div>

            {queue.map((vehicle, index) => {
                const config = stageConfig[vehicle.stage];
                const leftPosition = `${config.progress}%`;

                // Stagger vehicles vertically to avoid overlap
                const verticalOffset = (index % 2 === 0 ? -1 : 1) * (Math.floor(index / 2) * 0.7 + 1);

                return (
                <div
                    key={vehicle.id}
                    className="absolute top-1/2 -translate-y-1/2 transition-all duration-1000 ease-in-out"
                    style={{ 
                        left: `calc(${leftPosition} - 1.5rem)`,
                        transform: `translateY(calc(-50% + ${verticalOffset}rem))`,
                        zIndex: 20 + index
                    }}
                >
                    <div className="relative flex flex-col items-center">
                    <div className="flex items-center justify-center p-2 rounded-full bg-background border shadow-md">
                        <config.icon className={cn("w-5 h-5", config.color)} />
                    </div>
                    <div className="absolute -bottom-5 w-max px-1.5 py-0.5 rounded bg-foreground text-background text-[10px] font-medium">
                        {vehicle.model}
                    </div>
                    </div>
                </div>
                );
            })}
            </div>
        </CardContent>
        </Card>
        <Card>
            <CardHeader>
            <CardTitle>Vehicles Serviced Today</CardTitle>
            <CardDescription>Productivity across all technicians.</CardDescription>
            </CardHeader>
            <CardContent>
            <ChartContainer config={chartConfig} className="h-64">
                <BarChart
                data={allTechsPerformance}
                layout="vertical"
                margin={{ left: 10, top: 10, right: 10, bottom: 10 }}
                >
                <YAxis
                    dataKey="name"
                    type="category"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={5}
                    width={60}
                />
                <XAxis dataKey="vehiclesServiced" type="number" hide />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="vehiclesServiced" fill="var(--color-vehiclesServiced)" radius={4}>
                    <LabelList
                        dataKey="vehiclesServiced"
                        position="right"
                        offset={8}
                        className="fill-foreground"
                        fontSize={12}
                    />
                </Bar>
                </BarChart>
            </ChartContainer>
            </CardContent>
      </Card>
    </>
  );
}
