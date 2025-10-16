"use client"

import { useState, useEffect } from "react";
import type { Vehicle } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const getHealthColor = (score: number) => {
    if (score > 80) return 'text-green-500';
    if (score > 50) return 'text-yellow-500';
    return 'text-red-500';
};

const getStatusColor = (status: Vehicle['healthStatus']) => {
    switch (status) {
        case 'Good': return 'bg-green-500';
        case 'Warning': return 'bg-yellow-500';
        case 'Critical': return 'bg-red-500';
        default: return 'bg-gray-500';
    }
}

export function VehicleDetailsCard({ vehicle }: { vehicle: Vehicle }) {
    const [healthScore, setHealthScore] = useState(vehicle.healthScore);
    const [sensorData, setSensorData] = useState(vehicle.sensorData);

    useEffect(() => {
        const interval = setInterval(() => {
            setHealthScore(prev => Math.min(100, Math.max(20, prev + (Math.random() - 0.5) * 5)));
            setSensorData(prev => ({
                engine_temp: prev.engine_temp + (Math.random() - 0.5) * 2,
                oil_level: Math.min(1, Math.max(0, prev.oil_level + (Math.random() - 0.5) * 0.05)),
                vibration: prev.vibration + (Math.random() - 0.5) * 1,
                tire_pressure: prev.tire_pressure + (Math.random() - 0.5) * 0.2,
                battery_voltage: prev.battery_voltage + (Math.random() - 0.5) * 0.1,
                fuel_level: Math.min(1, Math.max(0, prev.fuel_level + (Math.random() - 0.5) * 0.02)),
            }))
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>{vehicle.make} {vehicle.model}</CardTitle>
                        <CardDescription>{vehicle.vin}</CardDescription>
                    </div>
                     <div className="flex items-center gap-2">
                        <div className={cn("w-3 h-3 rounded-full", getStatusColor(vehicle.healthStatus))}></div>
                        <span className="font-semibold text-sm">{vehicle.healthStatus}</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm">
                    <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted/50">
                        <p className="text-muted-foreground text-xs">Overall Health</p>
                        <p className={cn("text-3xl font-bold", getHealthColor(healthScore))}>{healthScore.toFixed(0)}%</p>
                    </div>
                    <div className="flex flex-col">
                        <p className="font-medium">Engine Temp</p>
                        <p className="text-2xl font-bold font-mono">{sensorData.engine_temp.toFixed(1)}°C</p>
                    </div>
                    <div className="flex flex-col">
                        <p className="font-medium">Oil Level</p>
                        <p className="text-2xl font-bold font-mono">{(sensorData.oil_level * 100).toFixed(0)}%</p>
                    </div>
                    <div className="flex flex-col">
                        <p className="font-medium">Tire Pressure</p>
                        <p className="text-2xl font-bold font-mono">{sensorData.tire_pressure.toFixed(1)} PSI</p>
                    </div>
                    <div className="flex flex-col">
                        <p className="font-medium">Battery Voltage</p>
                        <p className="text-2xl font-bold font-mono">{sensorData.battery_voltage.toFixed(2)}V</p>
                    </div>
                    <div className="flex flex-col">
                        <p className="font-medium">Vibration</p>
                        <p className="text-2xl font-bold font-mono">{sensorData.vibration.toFixed(2)} m/s²</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

    