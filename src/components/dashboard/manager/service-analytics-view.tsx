"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell, ScatterChart, Scatter, ZAxis, LabelList, Legend, ResponsiveContainer, LineChart, Line } from "recharts"
import type { ChartConfig } from "@/components/ui/chart"
import { useState, useEffect, useMemo } from "react"
import { ArrowDown, ArrowUp, IndianRupee } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { analyticsData } from "@/lib/data"
import { cn } from "@/lib/utils"

const chartConfig: ChartConfig = {
  defects: { label: "Defects", color: "hsl(var(--chart-1))" },
  demand: { label: "Demand", color: "hsl(var(--chart-1))" },
  workload: { label: "Workload", color: "hsl(var(--chart-1))" },
  backlog: { label: "Backlog", color: "hsl(var(--chart-2))" },
  Hero: { label: "Hero", color: "hsl(var(--chart-1))" },
  Mahindra: { label: "Mahindra", color: "hsl(var(--chart-2))" },
  count: { label: "Count", color: "hsl(var(--chart-1))" },
  Clutch: { label: "Clutch", color: "hsl(var(--chart-1))" },
  "Brake Pad": { label: "Brake Pad", color: "hsl(var(--chart-2))" },
  Injector: { label: "Injector", color: "hsl(var(--chart-3))" },
}

const severityColors = {
  Low: "hsl(var(--chart-2))",
  Medium: "hsl(var(--chart-3))",
  High: "hsl(var(--chart-4))",
  Critical: "hsl(var(--chart-5))",
}

const riskColors = {
    low: 'bg-green-500/20 text-green-200 border-green-500/30',
    medium: 'bg-yellow-500/20 text-yellow-200 border-yellow-500/30',
    high: 'bg-orange-500/20 text-orange-200 border-orange-500/30',
    critical: 'bg-red-500/20 text-red-200 border-red-500/30',
}

function useSimulatedData<T>(initialData: T[], updater: (item: T) => T) {
    const [data, setData] = useState(initialData);

    useEffect(() => {
        const interval = setInterval(() => {
            setData(prevData => prevData.map(item => updater(item)));
        }, 3000);
        return () => clearInterval(interval);
    }, [updater, initialData]);

    return data;
}

export function AnalyticsDashboard() {
  const [kpis, setKpis] = useState(analyticsData.kpis);

  useEffect(() => {
    const interval = setInterval(() => {
        setKpis(prev => ({
            ...prev,
            downtimeReduction: prev.downtimeReduction + (Math.random() - 0.45) * 0.1,
            predictionAccuracy: prev.predictionAccuracy + (Math.random() - 0.5) * 0.05,
            fleetUtilization: prev.fleetUtilization + (Math.random() - 0.5) * 0.2,
            preventiveSavings: prev.preventiveSavings + Math.random() * 500,
        }))
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  
  const breakdownData = useSimulatedData(
    analyticsData.predictiveBreakdown,
    item => ({ ...item, probability: Math.min(1, Math.max(0, item.probability + (Math.random() - 0.5) * 0.1)) })
  );

  const maintenanceForecast = useSimulatedData(
    analyticsData.maintenanceForecast,
    item => ({ ...item, demand: Math.max(0, item.demand + Math.floor((Math.random() - 0.4) * 5)) })
  );

  const serviceLoad = useSimulatedData(
    analyticsData.serviceLoad,
    item => ({ 
        ...item, 
        workload: Math.max(0, item.workload + Math.floor((Math.random() - 0.4) * 10)),
        backlog: Math.max(0, item.backlog + Math.floor((Math.random() - 0.45) * 5))
    })
  );

  const ageVsFailure = useSimulatedData(
    analyticsData.ageVsFailureRate,
    item => ({ ...item, failureRate: Math.max(0, item.failureRate + (Math.random() - 0.5) * 0.1), vehicleCount: item.vehicleCount + (Math.random() > 0.8 ? 1 : 0) })
  );

  const failureSeverity = useSimulatedData(
    analyticsData.failureSeverity,
    item => ({ ...item, count: Math.max(0, item.count + Math.floor((Math.random() - 0.3) * 10)) })
  );

  const partsTrend = useSimulatedData(
    analyticsData.partsReplacementTrend,
    item => ({
        ...item,
        ...Object.keys(item).reduce((acc, key) => {
            if(key !== 'month') {
                acc[key as keyof typeof item] = Math.max(0, (item[key as keyof typeof item] as number) + Math.floor((Math.random() - 0.4) * 3));
            }
            return acc;
        }, {} as Partial<typeof item>)
    })
  )

  const getRiskFromProb = (prob: number) => {
      if (prob < 0.25) return 'low';
      if (prob < 0.5) return 'medium';
      if (prob < 0.75) return 'high';
      return 'critical';
  }

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Predictive & Operational Analytics</CardTitle>
                <CardDescription>Deep, continuous insights into fleet performance and maintenance operations.</CardDescription>
            </CardHeader>
        </Card>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium">Downtime Reduction Index</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold flex items-center">
                        {kpis.downtimeReduction.toFixed(1)}%
                        <ArrowUp className="w-5 h-5 ml-2 text-green-500" />
                    </div>
                    <p className="text-xs text-muted-foreground">vs. pre-AI baseline</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium">Predictive Maint. Accuracy</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold flex items-center">
                        {kpis.predictionAccuracy.toFixed(1)}%
                    </div>
                    <p className="text-xs text-muted-foreground">True vs. False predictions</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium">Fleet Utilization Ratio</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold flex items-center">
                        {kpis.fleetUtilization.toFixed(1)}%
                        <ArrowDown className="w-5 h-5 ml-2 text-red-500" />
                    </div>
                    <p className="text-xs text-muted-foreground">Active vs. Idle vehicles</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium">Preventive Maintenance Savings</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold flex items-center">
                        <IndianRupee className="w-5 h-5 mr-1" /> {Math.floor(kpis.preventiveSavings).toLocaleString('en-IN')}
                    </div>
                    <p className="text-xs text-muted-foreground">Estimated savings this quarter</p>
                </CardContent>
            </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
            <Card className="lg:col-span-3">
                <CardHeader>
                    <CardTitle>Predictive Breakdown Probability (Next 90 Days)</CardTitle>
                    <CardDescription>Forecast likelihood of component failure shown as a risk heatmap across models.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Component</TableHead>
                                {breakdownData.filter(d => d.component === 'Engine').map(d => (
                                    <TableHead key={d.model} className="text-center">{d.model}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {useMemo(() => [...new Set(breakdownData.map(d => d.component))], [breakdownData]).map(component => (
                                <TableRow key={component}>
                                    <TableCell className="font-medium">{component}</TableCell>
                                    {breakdownData.filter(d => d.component === component).map(d => {
                                        const risk = getRiskFromProb(d.probability);
                                        return (
                                            <TableCell key={d.model} className="text-center">
                                                <Badge variant="outline" className={cn("font-mono text-xs border", riskColors[risk])}>
                                                    {(d.probability * 100).toFixed(0)}%
                                                </Badge>
                                            </TableCell>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Maintenance Forecast Dashboard</CardTitle>
                    <CardDescription>Predicted service demand across major cities for the next month.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-64">
                        <BarChart data={maintenanceForecast} layout="vertical" margin={{left: 10, right: 30}}>
                            <CartesianGrid horizontal={false} />
                            <YAxis dataKey="city" type="category" tickLine={false} axisLine={false} tickMargin={10} />
                            <XAxis dataKey="demand" type="number" />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="demand" fill="var(--color-demand)" radius={4}>
                                <LabelList dataKey="demand" position="right" offset={8} className="fill-foreground text-xs" />
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            
            <Card className="lg:col-span-3">
                <CardHeader>
                    <CardTitle>Service Load Distribution</CardTitle>
                    <CardDescription>Comparison of service center workloads and backlogs.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-64">
                        <BarChart data={serviceLoad}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={10} />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Legend />
                            <Bar dataKey="workload" fill="var(--color-workload)" radius={4} />
                            <Bar dataKey="backlog" fill="var(--color-backlog)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Failure Severity Distribution</CardTitle>
                    <CardDescription>Histogram dividing issues into severity categories.</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <ChartContainer config={chartConfig} className="h-64 aspect-square">
                        <PieChart>
                            <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                            <Pie data={failureSeverity} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                {failureSeverity.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={severityColors[entry.name as keyof typeof severityColors]} />
                                ))}
                            </Pie>
                            <Legend />
                        </PieChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            <Card className="lg:col-span-3">
                <CardHeader>
                    <CardTitle>Vehicle Age vs. Failure Rate Correlation</CardTitle>
                    <CardDescription>Bubble plot showing failure frequency as vehicles age. Size indicates fleet volume.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-72">
                        <ResponsiveContainer width="100%" height={300}>
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid />
                                <XAxis type="number" dataKey="age" name="Vehicle Age (years)" unit="yrs" />
                                <YAxis type="number" dataKey="failureRate" name="Failure Rate (%)" unit="%" />
                                <ZAxis type="number" dataKey="vehicleCount" range={[100, 1000]} name="Vehicle Count" />
                                <ChartTooltip cursor={{ strokeDasharray: '3 3' }} content={<ChartTooltipContent />} />
                                <Legend />
                                <Scatter name="Hero" data={ageVsFailure.filter(d => d.make === 'Hero')} fill="var(--color-Hero)" />
                                <Scatter name="Mahindra" data={ageVsFailure.filter(d => d.make === 'Mahindra')} fill="var(--color-Mahindra)" />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Parts Replacement Trend Analysis</CardTitle>
                    <CardDescription>Top 3 replaced components by month.</CardDescription>
                </CardHeader>
                <CardContent>
                     <ChartContainer config={chartConfig} className="h-72">
                        <LineChart data={partsTrend}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line type="monotone" dataKey="Clutch" stroke="var(--color-Clutch)" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="Brake Pad" stroke="var(--color-Brake Pad)" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="Injector" stroke="var(--color-Injector)" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    </div>
  )
}
