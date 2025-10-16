
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, Car, Clock, Star, Wrench } from "lucide-react"
import { appointments } from "@/lib/data"

const initialKpis = {
    activeServices: 0,
    pendingAppointments: 0,
    completedToday: 0,
    satisfaction: 92.0,
    avgDuration: 1.4,
}

export function KpiCards() {
    const [kpis, setKpis] = useState(initialKpis);

    useEffect(() => {
        const active = appointments.filter(a => a.status === 'In Service').length;
        const pending = appointments.filter(a => a.status === 'Pending').length;
        const completed = appointments.filter(a => a.status === 'Completed').length;
        
        setKpis(prev => ({ ...prev, activeServices: active, pendingAppointments: pending, completedToday: completed }));

        const interval = setInterval(() => {
             setKpis(prev => ({
                ...prev,
                satisfaction: Math.max(85, Math.min(99, prev.satisfaction + (Math.random() - 0.5) * 0.2)),
                avgDuration: Math.max(1.2, Math.min(2.5, prev.avgDuration + (Math.random() - 0.5) * 0.1)),
             }));
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Services</CardTitle>
                    <Car className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{kpis.activeServices}</div>
                    <p className="text-xs text-muted-foreground flex items-center">
                        <ArrowUp className="h-3 w-3 mr-1 text-green-500" /> +2 from yesterday
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Appointments</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{kpis.pendingAppointments}</div>
                     <p className="text-xs text-muted-foreground flex items-center">
                        <ArrowDown className="h-3 w-3 mr-1 text-red-500" /> -1 from yesterday
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
                    <Wrench className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{kpis.completedToday}</div>
                     <p className="text-xs text-muted-foreground">
                        Target: 20
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
                    <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{kpis.satisfaction.toFixed(1)}%</div>
                    <p className="text-xs text-muted-foreground flex items-center">
                        <ArrowUp className="h-3 w-3 mr-1 text-green-500" /> +0.1% this week
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Service Duration</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{kpis.avgDuration.toFixed(1)} hrs</div>
                    <p className="text-xs text-muted-foreground flex items-center">
                        <ArrowDown className="h-3 w-3 mr-1 text-green-500" /> -5% this week
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
