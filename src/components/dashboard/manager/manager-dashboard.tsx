
"use client"

import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { AlertTriangle, Bot, Cpu, Car, Eye, PlusCircle } from "lucide-react"
import Link from "next/link"
import React, { useState, useEffect, useMemo, useCallback } from "react"
import { allVehicles, executiveAnalyticsData } from "@/lib/data"
import type { Vehicle } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AddVehicleForm } from "./add-vehicle-form"
import { AreaChart, Area, PieChart, Pie, Cell, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"

const maintenanceChartConfig: ChartConfig = {
  predictive: { label: "Predictive", color: "hsl(var(--chart-1))" },
  reactive: { label: "Reactive", color: "hsl(var(--chart-5))" },
}

const statusChartConfig: ChartConfig = {
  Good: { label: "Good", color: "hsl(var(--chart-2))" },
  Warning: { label: "Warning", color: "hsl(var(--chart-3))" },
  Critical: { label: "Critical", color: "hsl(var(--chart-5))" },
}


function useSimulatedData<T>(initialData: T, updater: (data: T) => T) {
    const [data, setData] = useState(initialData);
    const memoizedUpdater = useCallback(updater, []);
    useEffect(() => {
        const interval = setInterval(() => {
            setData(prevData => memoizedUpdater(prevData));
        }, 3000);
        return () => clearInterval(interval);
    }, [memoizedUpdater]);
    return data;
}

const getStatusColor = (status: Vehicle['healthStatus']) => {
    switch (status) {
        case 'Good': return 'bg-green-500';
        case 'Warning': return 'bg-yellow-500';
        case 'Critical': return 'bg-red-500';
        default: return 'bg-gray-500';
    }
}

const healthToPercentage = (status: Vehicle['healthStatus']) => {
    switch (status) {
        case 'Good': return 90 + Math.random() * 10;
        case 'Warning': return 60 + Math.random() * 20;
        case 'Critical': return 20 + Math.random() * 30;
        default: return 0;
    }
}

const predictedIssues = [
    { issue: "Battery Wear", risk: "High" },
    { issue: "Brake Pad Thinning", risk: "Medium" },
    { issue: "Oil Pressure Drop", risk: "Critical" },
    { issue: "Coolant Level Low", risk: "Low" },
    { issue: "Tire Pressure Imbalance", risk: "Medium" },
]

export function ManagerDashboard() {
  const { vehicles, addVehicle } = useAuth();
  const [open, setOpen] = useState(false);

  const displayedVehicles = useMemo(() => vehicles.slice(0, 8), [vehicles]);

  const [simulatedVehicles, setSimulatedVehicles] = useState(vehicles);

  useEffect(() => {
    setSimulatedVehicles(vehicles);
  }, [vehicles]);
  
  useEffect(() => {
    const interval = setInterval(() => {
        setSimulatedVehicles(currentVehicles => currentVehicles.map(v => {
            const random = Math.random();
            let newStatus: Vehicle['healthStatus'] = v.healthStatus;
            if (random < 0.1) newStatus = 'Good';
            else if (random < 0.2) newStatus = 'Warning';
            else if (random < 0.3) newStatus = 'Critical';
            return {...v, healthStatus: newStatus}
        }))
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const maintenanceRatio = useSimulatedData(executiveAnalyticsData.maintenanceRatio, d => 
    d.map(m => ({...m, predictive: Math.min(100, m.predictive + 1), reactive: Math.max(0, m.reactive -1)}))
  );
  
  const globalHealthIndex = useMemo(() => {
    if (simulatedVehicles.length === 0) return 0;
    const totalHealth = simulatedVehicles.reduce((sum, v) => sum + healthToPercentage(v.healthStatus), 0);
    return totalHealth / simulatedVehicles.length;
  }, [simulatedVehicles]);

  const statusDistribution = useMemo(() => {
    const counts = simulatedVehicles.reduce((acc, v) => {
        acc[v.healthStatus] = (acc[v.healthStatus] || 0) + 1;
        return acc;
    }, {} as Record<Vehicle['healthStatus'], number>);
    
    return [
      { name: 'Good', value: counts['Good'] || 0, fill: statusChartConfig.Good.color },
      { name: 'Warning', value: counts['Warning'] || 0, fill: statusChartConfig.Warning.color },
      { name: 'Critical', value: counts['Critical'] || 0, fill: statusChartConfig.Critical.color },
    ];
  }, [simulatedVehicles]);


  return (
    <div className="space-y-6">
       <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Fleet Health Overview</CardTitle>
            <CardDescription>
              Real-time status and predictive alerts for the entire monitored fleet.
            </CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
               <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New Vehicle
               </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Vehicle</DialogTitle>
                <DialogDescription>
                  Enter the details for the new vehicle to monitor.
                </DialogDescription>
              </DialogHeader>
              <AddVehicleForm onVehicleAdded={() => setOpen(false)} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1 flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-muted/50">
                 <div className="relative h-32 w-32">
                    <svg className="h-full w-full" viewBox="0 0 36 36">
                        <path className="text-muted" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                        <path className="text-primary transition-all duration-500" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray={`${globalHealthIndex.toFixed(0)}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl font-bold">{globalHealthIndex.toFixed(0)}%</span>
                    </div>
                </div>
                <p className="font-semibold">Global Health Index</p>
            </div>
            <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {simulatedVehicles.slice(0, 8).map((vehicle, index) => {
                    const issue = predictedIssues[index % predictedIssues.length];
                    return (
                        <Card key={vehicle.id} className="flex flex-col">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-sm font-medium">{vehicle.make} {vehicle.model}</CardTitle>
                                    <div className={cn("w-3 h-3 rounded-full", getStatusColor(vehicle.healthStatus))}></div>
                                </div>
                                <CardDescription className="text-xs">{vehicle.vin}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow flex flex-col justify-end">
                                <Badge variant={issue.risk === 'High' || issue.risk === 'Critical' ? 'destructive' : 'secondary'} className="mb-2 w-full justify-center text-xs">{issue.risk} Risk: {issue.issue}</Badge>
                                <Link href={`/dashboard/vehicles/${vehicle.id}`} legacyBehavior>
                                  <a className="w-full">
                                    <Button variant="outline" size="sm" className="w-full">
                                        <Eye className="mr-2 h-3 w-3"/>
                                        View Details
                                    </Button>
                                  </a>
                                </Link>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
            <CardHeader>
                <CardTitle>Fleet Status Distribution</CardTitle>
                <CardDescription>Live breakdown of vehicle health across the fleet.</CardDescription>
            </CardHeader>
            <CardContent>
                 <ChartContainer config={statusChartConfig} className="h-64">
                    <PieChart>
                         <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                         <Pie data={statusDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                            {statusDistribution.map((entry) => (
                                <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                            ))}
                         </Pie>
                         <Legend />
                    </PieChart>
                 </ChartContainer>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Predictive vs. Reactive Maintenance</CardTitle>
                <CardDescription>Shows the shift towards predictive maintenance over time.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={maintenanceChartConfig} className="h-64">
                    <AreaChart data={maintenanceRatio} stackOffset="expand" margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="fillPredictive" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-predictive)" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="var(--color-predictive)" stopOpacity={0.1}/>
                            </linearGradient>
                             <linearGradient id="fillReactive" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-reactive)" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="var(--color-reactive)" stopOpacity={0.1}/>
                            </linearGradient>
                        </defs>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area type="monotone" dataKey="predictive" stackId="1" stroke="var(--color-predictive)" fill="url(#fillPredictive)" />
                        <Area type="monotone" dataKey="reactive" stackId="1" stroke="var(--color-reactive)" fill="url(#fillReactive)" />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold text-green-500">Optimal</div>
            <p className="text-xs text-muted-foreground">All agent systems are running.</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">{simulatedVehicles.filter(v => v.healthStatus === 'Critical').length + simulatedVehicles.filter(v => v.healthStatus === 'Warning').length}</div>
            <p className="text-xs text-muted-foreground">{simulatedVehicles.filter(v => v.healthStatus === 'Warning').length} Warnings, {simulatedVehicles.filter(v => v.healthStatus === 'Critical').length} Critical</p>
            </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
                Active AI Agents
            </CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
                <Link href="/dashboard/orchestration" className="hover:underline">
                View orchestration
              </Link>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <Link href="/dashboard/analytics" className="hover:underline">
                Monitored Fleet
              </Link>
            </CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vehicles.length}</div>
            <p className="text-xs text-muted-foreground">Vehicle models being monitored.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
