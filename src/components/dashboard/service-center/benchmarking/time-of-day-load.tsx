
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { timeOfDayLoadData, TimeOfDayLoadData } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function TimeOfDayLoad() {
  const [data, setData] = useState<TimeOfDayLoadData[]>(timeOfDayLoadData);

  const memoizedUpdater = useCallback(() => {
    setData(prevData =>
      prevData.map(item => ({
        ...item,
        vehicles: Math.max(0, item.vehicles + Math.floor((Math.random() - 0.5) * 3)),
      }))
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(memoizedUpdater, 2500);
    return () => clearInterval(interval);
  }, [memoizedUpdater]);

  const maxVehicles = Math.max(...data.map(d => d.vehicles), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Time-of-Day Service Load</CardTitle>
        <CardDescription>Heatmap showing the number of vehicles serviced per hour (9 AM - 6 PM).</CardDescription>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
            <div className="flex gap-1">
                {data.map(item => (
                <Tooltip key={item.hour}>
                    <TooltipTrigger asChild>
                    <div className="flex-1 flex flex-col items-center gap-1">
                        <div 
                            className="w-full h-24 rounded-md border transition-colors"
                            style={{ backgroundColor: `hsl(var(--primary) / ${item.vehicles / maxVehicles})` }}
                        />
                        <span className="text-xs text-muted-foreground">{item.hour}</span>
                    </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{item.hour}: {item.vehicles} vehicles</p>
                    </TooltipContent>
                </Tooltip>
                ))}
            </div>
        </TooltipProvider>
         <p className="text-xs text-muted-foreground mt-4">
            <span className="font-semibold">Insight:</span> Peak service load occurs between 11 AM and 3 PM. Consider staggering lunch breaks to optimize coverage.
        </p>
      </CardContent>
    </Card>
  );
}
