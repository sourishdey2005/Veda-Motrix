"use client"

import { useState, useEffect, useCallback } from "react";
import type { Vehicle, PredictedAlert } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Calendar, Wrench } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

const getHealthColor = (score: number) => {
    if (score > 80) return 'text-green-500';
    if (score > 50) return 'text-yellow-500';
    return 'text-red-500';
};

const getRiskColor = (priority: PredictedAlert['priority']) => {
    if (priority === 'Low') return 'bg-green-500/20 text-green-300';
    if (priority === 'Medium') return 'bg-yellow-500/20 text-yellow-300';
    return 'bg-red-500/20 text-red-300';
}

export function VehicleSummaryCard({ vehicle }: { vehicle: Vehicle }) {
    const [healthScore, setHealthScore] = useState(vehicle.healthScore || 0);
    const [predictedAlert, setPredictedAlert] = useState(vehicle.predictedAlerts?.[0]);

    useEffect(() => {
        const interval = setInterval(() => {
            setHealthScore(prev => {
                const currentScore = prev || 75; // Fallback to a neutral score
                return Math.min(100, Math.max(20, currentScore + (Math.random() - 0.5) * 5))
            });
            if (vehicle.predictedAlerts && vehicle.predictedAlerts.length > 0) {
              setPredictedAlert(vehicle.predictedAlerts[Math.floor(Math.random() * vehicle.predictedAlerts.length)]);
            }
        }, 3000 + Math.random() * 1000);
        return () => clearInterval(interval);
    }, [vehicle.predictedAlerts]);

    return (
        <Card className="flex flex-col">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>{vehicle.make} {vehicle.model}</CardTitle>
                        <CardDescription>{vehicle.vin}</CardDescription>
                    </div>
                    <div className="relative h-20 w-20">
                        <svg className="h-full w-full" viewBox="0 0 36 36">
                            <path className="text-muted" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2" />
                            <path className={cn("transition-all duration-500", getHealthColor(healthScore))} stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray={`${healthScore.toFixed(0)}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl font-bold">{healthScore.toFixed(0)}%</span>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-between space-y-4">
                <div>
                    {predictedAlert && (
                      <Badge variant="outline" className={cn("w-full justify-center py-1 relative", getRiskColor(predictedAlert.priority))}>
                          {predictedAlert.issue} - {predictedAlert.priority} Risk
                          {predictedAlert.priority === 'High' && <span className="absolute top-1 right-1 flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span></span>}
                      </Badge>
                    )}
                     <div className="flex justify-between text-xs text-muted-foreground mt-2">
                        <div className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Last: {format(new Date(vehicle.lastService), "dd MMM yyyy")}</div>
                        <div className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Next: {format(new Date(vehicle.nextServiceDue), "dd MMM yyyy")}</div>
                    </div>
                </div>
                 <Link href={`/dashboard/vehicles/${vehicle.id}`} className="w-full">
                    <Button className="w-full">
                        <Wrench className="mr-2 h-4 w-4" /> Book Service
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
}
