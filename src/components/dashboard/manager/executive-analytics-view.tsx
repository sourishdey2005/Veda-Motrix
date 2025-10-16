"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area } from "recharts"
import type { ChartConfig } from "@/components/ui/chart"
import { useState, useEffect, useMemo, useCallback } from "react"
import { Activity, Award, BarChartBig, Bot, CheckCircle, ChevronRight, CircuitBoard, DollarSign, Factory, FileText, Settings, ShieldCheck, TrendingDown, TrendingUp, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { executiveAnalyticsData } from "@/lib/data"
import { cn } from "@/lib/utils"
import { Button }from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

const chartConfig: ChartConfig = {
  predictive: { label: "Predictive", color: "hsl(var(--chart-1))" },
  reactive: { label: "Reactive", color: "hsl(var(--chart-5))" },
  beforeAI: { label: "Before AI", color: "hsl(var(--chart-5))" },
  afterAI: { label: "After AI", color: "hsl(var(--chart-1))" },
}

function useSimulatedData<T>(initialData: T, updater: (data: T) => T) {
    const [data, setData] = useState(initialData);

    // Using useCallback to memoize the updater function
    const memoizedUpdater = useCallback(updater, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setData(prevData => memoizedUpdater(prevData));
        }, 3000);
        return () => clearInterval(interval);
    }, [memoizedUpdater]);

    return data;
}

export function ExecutiveAnalyticsView() {
    
    const aiRoi = useSimulatedData(executiveAnalyticsData.aiRoi, d => ({
        costSavings: d.costSavings + Math.random() * 10000,
        timeSavings: d.timeSavings + Math.random() * 0.1,
        breakdownReduction: d.breakdownReduction + Math.random() * 0.05
    }));

    const regionalPerformance = useSimulatedData(executiveAnalyticsData.regionalPerformance, d => 
        d.map(r => ({...r, efficiency: Math.min(100, r.efficiency + (Math.random() - 0.5) * 2), uptime: Math.min(100, r.uptime + (Math.random() - 0.5) * 1)}))
    );

    const compliance = useSimulatedData(executiveAnalyticsData.policyCompliance, d => 
        d.map(c => ({...c, score: Math.min(100, Math.max(80, c.score + (Math.random() - 0.5) * 2))}))
    );

    const maintenanceRatio = useSimulatedData(executiveAnalyticsData.maintenanceRatio, d => 
        d.map(m => ({...m, predictive: Math.min(100, m.predictive + 1), reactive: Math.max(0, m.reactive -1)}))
    );

    const warrantyCost = useSimulatedData(executiveAnalyticsData.warrantyCost, d => 
        d.map(w => ({...w, afterAI: Math.max(0, w.afterAI - Math.random() * 5000)}))
    );
    
    const rul = useSimulatedData(executiveAnalyticsData.rulPrediction, d => 
        d.map(v => ({...v, rul: Math.max(0, v.rul - (Math.random() * 0.01))}))
    )

    const detectionRate = useSimulatedData(executiveAnalyticsData.detectionRate, r => Math.min(100, r + (Math.random() - 0.4) * 0.1));
    const sri = useSimulatedData(executiveAnalyticsData.sri, s => Math.min(100, s + (Math.random() - 0.5) * 0.2));


  return (
    <div className="space-y-6">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Strategic & Executive Analytics</CardTitle>
                    <CardDescription>Manager-level business insights that demonstrate system ROI and operational health.</CardDescription>
                </div>
                 <Button>
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Executive Report
                </Button>
            </CardHeader>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-3">
                <CardHeader>
                    <CardTitle>AI ROI Dashboard</CardTitle>
                    <CardDescription>Quantifies time, cost, and breakdown reduction since implementing VEDA-MOTRIX AI.</CardDescription>
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <Card className="lg:col-span-3">
                <CardHeader>
                    <CardTitle>Predictive vs. Reactive Maintenance Ratio</CardTitle>
                    <CardDescription>Shows the system’s success in turning reactive into predictive cases.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-64">
                         <AreaChart
                            data={maintenanceRatio}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0, }}
                            stackOffset="expand"
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="month" />
                            <YAxis tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                             <Legend />
                            <Area type="monotone" dataKey="predictive" stackId="1" stroke="var(--color-predictive)" fill="var(--color-predictive)" />
                            <Area type="monotone" dataKey="reactive" stackId="1" stroke="var(--color-reactive)" fill="var(--color-reactive)" />
                        </AreaChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>System Reliability & Detection</CardTitle>
                    <CardDescription>Overall system health and issue detection rates.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <p className="text-sm font-medium">System Reliability Index (SRI)</p>
                            <span className="font-mono text-sm font-bold">{sri.toFixed(1)}%</span>
                        </div>
                        <Progress value={sri} />
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <p className="text-sm font-medium">Early Warning Detection Rate</p>
                            <span className="font-mono text-sm font-bold">{detectionRate.toFixed(1)}%</span>
                        </div>
                        <Progress value={detectionRate} />
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Warranty Cost Reduction Graph</CardTitle>
                    <CardDescription>Visual comparison of warranty claims before vs. after AI integration.</CardDescription>
                </CardHeader>
                <CardContent>
                     <ChartContainer config={chartConfig} className="h-64">
                        <BarChart data={warrantyCost}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} />
                            <YAxis tickFormatter={(val) => `₹${val/1000}k`} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Legend />
                            <Bar dataKey="beforeAI" fill="var(--color-beforeAI)" radius={4} />
                            <Bar dataKey="afterAI" fill="var(--color-afterAI)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Policy Compliance Scoreboard</CardTitle>
                    <CardDescription>Checks service center adherence to maintenance protocols.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Center</TableHead>
                                <TableHead className="text-right">Score</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {compliance.map(item => (
                                <TableRow key={item.center}>
                                    <TableCell className="font-medium flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-primary" /> {item.center}</TableCell>
                                    <TableCell className="text-right font-mono font-bold text-green-500">{item.score.toFixed(1)}%</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                     </Table>
                </CardContent>
            </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             <Card>
                <CardHeader>
                    <CardTitle>Innovation Opportunity Detector</CardTitle>
                    <CardDescription>AI suggestions for R&D focus areas.</CardDescription>
                </CardHeader>
                <CardContent>
                     {executiveAnalyticsData.innovationOpportunities.map((rec, index) => (
                        <div key={index} className={cn("p-3 rounded-lg", index > 0 && "mt-3", index % 2 === 0 ? "bg-muted/50" : "")}>
                           <div className="flex items-start gap-3">
                                <Bot className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="font-semibold text-sm">{rec.area}</p>
                                    <p className="text-xs text-muted-foreground">{rec.suggestion}</p>
                                    <div className="flex items-center gap-4 mt-2">
                                        <Badge variant="outline" className="text-xs">Impact: {rec.impact}/10</Badge>
                                        <Badge variant="outline" className="text-xs">Feasibility: {rec.feasibility}/10</Badge>
                                    </div>
                                </div>
                           </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Vehicle Lifetime Prediction Model</CardTitle>
                    <CardDescription>Predicted remaining useful life (RUL) across the fleet.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Model</TableHead>
                                <TableHead className="text-right">Remaining Useful Life (Years)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rul.map(item => (
                                <TableRow key={item.model}>
                                    <TableCell className="font-medium">{item.model}</TableCell>
                                    <TableCell className="text-right font-mono">{item.rul.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    </div>
  )
}
