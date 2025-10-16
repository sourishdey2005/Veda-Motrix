
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, Wrench, CheckCircle } from 'lucide-react';
import { liveQueueData } from '@/lib/data';
import type { LiveQueueVehicle } from '@/lib/types';
import { cn } from '@/lib/utils';

const stageConfig = {
  'In Service': { icon: Car, color: 'text-blue-400', progress: 25 },
  'Diagnosis': { icon: Wrench, color: 'text-yellow-400', progress: 60 },
  'Ready for Pickup': { icon: CheckCircle, color: 'text-green-400', progress: 100 },
};

export function LiveVehicleQueue() {
  const [queue, setQueue] = useState<LiveQueueVehicle[]>(liveQueueData);

  useEffect(() => {
    const interval = setInterval(() => {
      setQueue(prevQueue => {
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
    <Card>
      <CardHeader>
        <CardTitle>Live Vehicle Queue Tracker</CardTitle>
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

            return (
              <div
                key={vehicle.id}
                className="absolute top-1/2 -translate-y-[calc(50%+1rem)] transition-all duration-1000 ease-in-out"
                style={{ 
                    left: `calc(${leftPosition} - 1.5rem)`,
                    transform: `translateY(calc(-50% - ${index * 0.5 - queue.length*0.25}rem))`,
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
  );
}
