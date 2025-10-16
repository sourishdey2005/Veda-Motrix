"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Vehicle, SensorData } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import React, { useState, useEffect } from "react"
import { Thermometer, Droplets, Waves, Gauge, Battery, Fuel } from "lucide-react"

const getHealthColor = (status: 'Good' | 'Warning' | 'Critical') => {
  if (status === 'Good') return 'text-green-500';
  if (status === 'Warning') return 'text-yellow-500';
  return 'text-red-500';
};

const sensorIcons = {
  engine_temp: Thermometer,
  oil_level: Droplets,
  vibration: Waves,
  tire_pressure: Gauge,
  battery_voltage: Battery,
  fuel_level: Fuel,
}

export function VehicleHealthCard({ vehicle }: { vehicle: Vehicle }) {
  const [currentSensorData, setCurrentSensorData] = useState<SensorData>(vehicle.sensorData);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSensorData(prevData => ({
        ...prevData,
        engine_temp: vehicle.sensorData.engine_temp + (Math.random() - 0.5) * 5,
        oil_level: vehicle.sensorData.oil_level + (Math.random() - 0.5) * 0.1,
        vibration: vehicle.sensorData.vibration + (Math.random() - 0.5) * 2,
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, [vehicle.sensorData]);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            {vehicle.make} {vehicle.model} ({vehicle.year})
          </CardTitle>
          <CardDescription>VIN: {vehicle.vin}</CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <Badge className={cn("text-base", 
            vehicle.healthStatus === 'Good' && 'bg-green-600',
            vehicle.healthStatus === 'Warning' && 'bg-yellow-600',
            vehicle.healthStatus === 'Critical' && 'bg-red-600',
          )}>
            {vehicle.healthStatus}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6 text-sm">
        <div className="grid gap-4">
            <h3 className="font-semibold">Live Sensor Data</h3>
            {Object.entries(currentSensorData).map(([key, value]) => {
                const Icon = sensorIcons[key as keyof typeof sensorIcons] || Fuel;
                const progressValue = key === 'oil_level' || key === 'fuel_level' ? value * 100 : value;
                return (
                    <div key={key} className="grid grid-cols-3 items-center gap-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Icon className="w-4 h-4" />
                            <span className="capitalize text-xs">{key.replace('_', ' ')}</span>
                        </div>
                        <Progress value={progressValue} className="h-2 col-span-1" />
                        <span className="font-mono text-right text-xs">
                            {key === 'oil_level' || key === 'fuel_level' ? `${(value * 100).toFixed(0)}%` : value.toFixed(2)}
                        </span>
                    </div>
                )
            })}
        </div>
      </CardContent>
    </Card>
  )
}
