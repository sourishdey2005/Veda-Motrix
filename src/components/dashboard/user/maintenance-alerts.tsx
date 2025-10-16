"use client"

import { useState, useEffect, useCallback } from "react";
import type { Vehicle, PredictedAlert } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils";
import { AlertTriangle, IndianRupee, Wrench } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const priorityStyles = {
    High: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/50',
      icon: 'text-red-400',
    },
    Medium: {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/50',
      icon: 'text-yellow-400',
    },
    Low: {
      bg: 'bg-green-500/10',
      border: 'border-green-500/50',
      icon: 'text-green-400',
    }
}

export function MaintenanceAlerts({ vehicle }: { vehicle: Vehicle }) {

    // For simulation, we'll just cycle through the alerts
    const [alerts, setAlerts] = useState(vehicle.predictedAlerts);
    
    useEffect(() => {
      const interval = setInterval(() => {
        setAlerts(prev => [...prev.slice(1), prev[0]]);
      }, 5000);
      return () => clearInterval(interval);
    }, []);

    return (
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle>Predicted Maintenance Alerts</CardTitle>
                <CardDescription>AI-powered predictions for upcoming service needs.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                 <ScrollArea className="h-64 pr-4 -mr-4">
                    <div className="space-y-4">
                        {alerts.map((alert) => {
                            const styles = priorityStyles[alert.priority];
                            return (
                                <div key={alert.id} className={cn("p-3 rounded-lg border", styles.bg, styles.border)}>
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle className={cn("w-5 h-5 mt-1 flex-shrink-0", styles.icon)} />
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm">{alert.issue}</p>
                                            <p className="text-xs text-muted-foreground">{alert.recommendation}</p>
                                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                                <div className="flex items-center gap-1"><Wrench className="w-3 h-3" /> {alert.estimatedTime}</div>
                                                <div className="flex items-center gap-1"><IndianRupee className="w-3 h-3" /> {alert.estimatedCost.toLocaleString('en-IN')}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
