

"use client"

import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { AlertTriangle, Bot, Cpu, Car, Eye, PlusCircle, DollarSign, TrendingUp, TrendingDown, ShieldAlert, Legend as LegendIcon } from "lucide-react"
import Link from "next/link"
import React, { useState, useEffect, useMemo, useCallback } from "react"
import { executiveAnalyticsData, predictedIssues, vehicles as allVehicles } from "@/lib/data"
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
import { AreaChart, Area, PieChart, Pie, Cell, BarChart, CartesianGrid, XAxis, YAxis, Bar } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, RechartsPrimitive } from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"

const maintenanceChartConfig: ChartConfig = {
  predictive: { label: "Predictive", color: "hsl(var(--chart-1))" },
  reactive: { label: "Reactive", color: "hsl(var(--chart-5))" },
}

const statusChartConfig: ChartConfig = {
  Good: { label: "Good", color: "hsl(var(--chart-2))" },
  Warning: { label: "Warning", color: "hsl(var(--chart-3))" },
  Critical: { label: "Critical", color: "hsl(var(--chart-5))" },
}

const serviceLoadChartConfig: ChartConfig = {
  workload: { label: "Workload", color: "hsl(var(--chart-1))" },
  backlog: { label: "Backlog", color: "hsl(var(--chart-2))" },
}

const warrantyChartConfig: ChartConfig = {
  beforeAI: { label: "Before AI", color: "hsl(var(--chart-5))" },
  afterAI: { label: "After AI", color: "hsl(var(--chart-1))" },
}

const reliabilityChartConfig: ChartConfig = {
  '2023': { label: "2023", color: "hsl(var(--chart-5))" },
  '2024': { label: "2024", color: "hsl(var(--chart-1))" },
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

const getHealthColor = (score: number) => {
    if (score > 80) return 'text-green-500';
    if (score > 50) return 'text-yellow-500';
    return 'text-red-500';
};

const healthToPercentage = (status: Vehicle['healthStatus']) => {
    switch (status) {
        case 'Good': return 90 + Math.random() * 10;
        case 'Warning': return 60 + Math.random() * 20;
        case 'Critical': return 20 + Math.random() * 30;
        default: return 0;
    }
}

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
            let newStatus: Vehicle['healthStatus'] = v.healthStatus;
            let newHealthScore = v.healthScore;
            
            const random = Math.random();
            if (random < 0.1) {
                newStatus = 'Good';
                newHealthScore = Math.min(100, v.healthScore + 5);
            } else if (random < 0.2) {
                newStatus = 'Warning';
                newHealthScore = Math.max(50, v.healthScore - 5);
            } else if (random < 0.25) {
                newStatus = 'Critical';
                newHealthScore = Math.max(10, v.healthScore - 10);
            } else {
                newHealthScore = Math.min(100, Math.max(0, v.healthScore + (Math.random() - 0.5) * 3));
            }
            return {...v, healthStatus: newStatus, healthScore: newHealthScore }
        }))
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const maintenanceRatio = useSimulatedData(executiveAnalyticsData.maintenanceRatio, d => 
    d.map(m => ({...m, predictive: Math.min(100, m.predictive + 1), reactive: Math.max(0, m.reactive -1)}))
  );

  const warrantyCost = useSimulatedData(executiveAnalyticsData.warrantyCost, d => 
    d.map(w => ({...w, afterAI: Math.max(0, w.afterAI - Math.random() * 5000)}))
  );

  const reliabilityComparison = useSimulatedData(executiveAnalyticsData.fleetReliability, d => 
    d.map(item => ({...item, '2024': Math.max(0, item['2024'] - (Math.random() * 0.1))}))
  );

  const aiRoi = useSimulatedData(executiveAnalyticsData.aiRoi, d => ({
    costSavings: d.costSavings + Math.random() * 10000,
    timeSavings: d.timeSavings + Math.random() * 0.1,
    breakdownReduction: d.breakdownReduction + Math.random() * 0.05
  }));

  const serviceLoad = useSimulatedData(executiveAnalyticsData.serviceLoad, (prevData) =>
    prevData.map(item => ({
        ...item,
        workload: Math.max(0, item.workload + Math.floor((Math.random() - 0.4) * 10)),
        backlog: Math.max(0, item.backlog + Math.floor((Math.random() - 0.45) * 5))
    }))
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

  const highestRiskVehicles = useMemo(() => {
    return [...simulatedVehicles]
      .sort((a, b) => a.healthScore - b.healthScore)
      .slice(0, 5);
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
                                <Link href={`/dashboard/vehicles/${vehicle.id}`}>
                                  <Button variant="outline" size="sm" className="w-full">
                                      <Eye className="mr-2 h-3 w-3"/>
                                      View Details
                                  </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI ROI Snapshot</CardTitle>
          <CardDescription>Key performance indicators demonstrating the value of the AI system.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-3">
          <div className="flex items-center gap-4">
              <DollarSign className="w-10 h-10 text-green-500" />
              <div>
                  <p className="text-sm text-muted-foreground">Cost Savings</p>
                  <p className="text-2xl font-bold">₹{aiRoi.costSavings.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
              </div>
          </div>
          <div className="flex items-center gap-4">
              <TrendingUp className="w-10 h-10 text-blue-500" />
              <div>
                  <p className="text-sm text-muted-foreground">Time Savings (Avg. Service)</p>
                  <p className="text-2xl font-bold">{aiRoi.timeSavings.toFixed(1)}%</p>
              </div>
          </div>
          <div className="flex items-center gap-4">
              <TrendingDown className="w-10 h-10 text-red-500" />
              <div>
                  <p className="text-sm text-muted-foreground">Breakdown Reduction</p>
                  <p className="text-2xl font-bold">{aiRoi.breakdownReduction.toFixed(1)}%</p>
              </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                         <RechartsPrimitive.Legend />
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
              <div className="rounded-lg overflow-hidden">
                <ChartContainer config={maintenanceChartConfig} className="h-64">
                    <AreaChart data={maintenanceRatio} stackOffset="expand" margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                        <defs>
                            <linearGradient id="fillPredictive" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-predictive)" stopOpacity={0.8}>
                                  <animate attributeName="stop-opacity" values="0.8; 0.4; 0.8" dur="4s" repeatCount="indefinite" />
                                </stop>
                                <stop offset="95%" stopColor="var(--color-predictive)" stopOpacity={0.1}>
                                  <animate attributeName="stop-opacity" values="0.1; 0.3; 0.1" dur="4s" repeatCount="indefinite" />
                                </stop>
                            </linearGradient>
                             <linearGradient id="fillReactive" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-reactive)" stopOpacity={0.8}>
                                    <animate attributeName="stop-opacity" values="0.8; 0.4; 0.8" dur="5s" repeatCount="indefinite" />
                                </stop>
                                <stop offset="95%" stopColor="var(--color-reactive)" stopOpacity={0.1}>
                                    <animate attributeName="stop-opacity" values="0.1; 0.3; 0.1" dur="5s" repeatCount="indefinite" />
                                </stop>
                            </linearGradient>
                        </defs>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <RechartsPrimitive.Legend />
                        <Area type="monotone" dataKey="predictive" stackId="1" stroke="var(--color-predictive)" fill="url(#fillPredictive)" />
                        <Area type="monotone" dataKey="reactive" stackId="1" stroke="var(--color-reactive)" fill="url(#fillReactive)" />
                    </AreaChart>
                </ChartContainer>
              </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Top Predicted Issues</CardTitle>
                <CardDescription>Most frequent potential failures across the fleet.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="space-y-3">
                    {predictedIssues.slice(0, 5).map(issue => (
                        <div key={issue.issue} className="flex justify-between items-center">
                            <span className="text-sm font-medium">{issue.issue}</span>
                             <Badge variant={issue.risk === 'High' || issue.risk === 'Critical' ? 'destructive' : 'secondary'}>
                                {issue.risk}
                            </Badge>
                        </div>
                    ))}
                 </div>
            </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
            <CardHeader>
                <CardTitle>Service Center Load Distribution</CardTitle>
                <CardDescription>Comparison of service center workloads and backlogs.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={serviceLoadChartConfig} className="h-64">
                    <BarChart data={serviceLoad}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={10} />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <RechartsPrimitive.Legend />
                        <Bar dataKey="workload" fill="var(--color-workload)" radius={4} />
                        <Bar dataKey="backlog" fill="var(--color-backlog)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Highest Risk Vehicles</CardTitle>
                <CardDescription>Vehicles with the lowest health scores requiring attention.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableBody>
                        {highestRiskVehicles.map(vehicle => (
                            <TableRow key={vehicle.id}>
                                <TableCell>
                                    <div className="font-medium">{vehicle.make} {vehicle.model}</div>
                                    <div className="text-xs text-muted-foreground">{vehicle.vin}</div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className={cn("font-bold", getHealthColor(vehicle.healthScore))}>
                                        {vehicle.healthScore.toFixed(0)}%
                                    </div>
                                    <div className="text-xs text-muted-foreground">{vehicle.healthStatus}</div>
                                </TableCell>
                                <TableCell className="text-right">
                                     <Link href={`/dashboard/vehicles/${vehicle.id}`}>
                                        <Button variant="ghost" size="sm">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
              <CardTitle>Warranty Cost Reduction Graph</CardTitle>
              <CardDescription>Visual comparison of warranty claims before vs. after AI integration.</CardDescription>
          </CardHeader>
          <CardContent>
              <ChartContainer config={warrantyChartConfig} className="h-64">
                  <BarChart data={warrantyCost}>
                      <CartesianGrid vertical={false} />
                      <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} />
                      <YAxis tickFormatter={(val) => `₹${val/1000}k`} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <RechartsPrimitive.Legend />
                      <Bar dataKey="beforeAI" fill="var(--color-beforeAI)" radius={4} />
                      <Bar dataKey="afterAI" fill="var(--color-afterAI)" radius={4} />
                  </BarChart>
              </ChartContainer>
          </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Fleet Reliability Comparison</CardTitle>
                <CardDescription>“Model XUV700 shows 15% fewer failures than 2023 after CAPA.”</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={reliabilityChartConfig} className="h-64">
                    <BarChart data={reliabilityComparison}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="model" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <RechartsPrimitive.Legend />
                        <Bar dataKey="2023" fill="var(--color-2023)" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="2024" fill="var(--color-2024)" radius={[4, 4, 0, 0]} />
                    </BarChart>
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
