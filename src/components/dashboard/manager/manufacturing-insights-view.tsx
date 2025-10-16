
"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList, Legend, ResponsiveContainer, LineChart, Line, ScatterChart, Scatter, ZAxis } from "recharts"
import type { ChartConfig } from "@/components/ui/chart"
import { useState, useEffect, useMemo } from "react"
import { Activity, Award, BarChartBig, Bot, CheckCircle, ChevronRight, CircuitBoard, Factory, Settings, TrendingDown, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { rcaCapaAnalyticsData } from "@/lib/data"
import { cn } from "@/lib/utils"
import { SmartCapaApprovalAssistant } from "./manufacturing/smart-capa-approval-assistant"

const chartConfig: ChartConfig = {
  recurrence: { label: "Recurrence", color: "hsl(var(--chart-5))" },
  postCapa: { label: "Post-CAPA", color: "hsl(var(--chart-1))" },
  effectiveness: { label: "Effectiveness", color: "hsl(var(--chart-1))" },
  Hero: { label: "Hero", color: "hsl(var(--chart-1))" },
  Mahindra: { label: "Mahindra", color: "hsl(var(--chart-2))" },
  count: { label: "Count", color: "hsl(var(--chart-1))" },
}

const riskColors = {
    low: 'bg-green-500/20 text-green-200 border-green-500/30',
    medium: 'bg-yellow-500/20 text-yellow-200 border-yellow-500/30',
    high: 'bg-orange-500/20 text-orange-200 border-orange-500/30',
    critical: 'bg-red-500/20 text-red-200 border-red-500/30',
}

function useSimulatedData<T>(initialData: T, updater: (data: T) => T) {
    const [data, setData] = useState(initialData);

    useEffect(() => {
        const interval = setInterval(() => {
            setData(prevData => updater(prevData));
        }, 3000);
        return () => clearInterval(interval);
    }, [updater]);

    return data;
}

export function ManufacturingInsightsView() {
    
    const rcaClusters = useSimulatedData(rcaCapaAnalyticsData.rcaClusters, (d) => 
        d.map(c => ({...c, x: c.x + (Math.random() - 0.5) * 0.02, y: c.y + (Math.random() - 0.5) * 0.02}))
    );

    const recurrenceCurve = useSimulatedData(rcaCapaAnalyticsData.defectRecurrence, d => 
        d.map(p => ({...p, postCapa: Math.max(0, p.postCapa + (Math.random() - 0.6))}))
    );
    
    const capaEffectiveness = useSimulatedData(rcaCapaAnalyticsData.capaEffectiveness, d => ({
        successful: d.successful + (Math.random() > 0.7 ? 1 : 0),
        failed: d.failed + (Math.random() > 0.9 ? 1 : 0)
    }));

    const supplierDefects = useSimulatedData(rcaCapaAnalyticsData.supplierDefectCorrelation, d => 
        d.map(row => ({...row, issues: row.issues.map(issue => ({...issue, count: Math.max(0, issue.count + Math.floor(Math.random() * 3) -1)}))}))
    );

    const designVulnerability = useSimulatedData(rcaCapaAnalyticsData.designVulnerability, d => 
        d.map(v => ({...v, riskScore: Math.min(100, Math.max(0, v.riskScore + (Math.random() - 0.5) * 3))})).sort((a,b) => b.riskScore - a.riskScore)
    );

    const assemblyLineRisk = useSimulatedData(rcaCapaAnalyticsData.assemblyLineRisk, d => 
        d.map(l => ({...l, failureRate: Math.max(0, l.failureRate + (Math.random() - 0.5) * 0.05)}))
    );

    const impactScorecard = useSimulatedData(rcaCapaAnalyticsData.componentImpact, d => 
        d.map(c => ({...c, impactScore: Math.max(0, c.impactScore + (Math.random() - 0.4) * 5)})).sort((a,b) => b.impactScore - a.impactScore)
    );

    const getRiskFromScore = (score: number) => {
        if (score < 25) return 'low';
        if (score < 50) return 'medium';
        if (score < 75) return 'high';
        return 'critical';
    }
    
    const totalCapas = capaEffectiveness.successful + capaEffectiveness.failed;
    const effectivenessPercentage = totalCapas > 0 ? (capaEffectiveness.successful / totalCapas) * 100 : 0;

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>RCA / CAPA Insight Analytics</CardTitle>
                <CardDescription>Transform raw maintenance data into actionable manufacturing intelligence.</CardDescription>
            </CardHeader>
        </Card>
        
        <SmartCapaApprovalAssistant />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>RCA Similarity Cluster Map</CardTitle>
                    <CardDescription>Groups recurring RCA issues by semantic similarity. Bubbles are clickable for drill-down.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-96">
                        <ResponsiveContainer>
                            <ScatterChart margin={{ top: 20, right: 40, bottom: 20, left: 20 }}>
                                <CartesianGrid />
                                <XAxis type="number" dataKey="x" name="Semantic Vector X" tick={_ => ''} />
                                <YAxis type="number" dataKey="y" name="Semantic Vector Y" tick={_ => ''} />
                                <ZAxis type="number" dataKey="count" range={[100, 1500]} name="Issue Count" />
                                <ChartTooltip cursor={{ strokeDasharray: '3 3' }} content={<ChartTooltipContent />} />
                                <Legend />
                                <Scatter name="Hero" data={rcaClusters.filter(d => d.make === 'Hero')} fill="var(--color-Hero)" className="cursor-pointer" />
                                <Scatter name="Mahindra" data={rcaClusters.filter(d => d.make === 'Mahindra')} fill="var(--color-Mahindra)" className="cursor-pointer" />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Defect Recurrence Frequency Curve</CardTitle>
                        <CardDescription>How often the same issue reappears after CAPA closure.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-48">
                            <LineChart data={recurrenceCurve} margin={{left: -20, right: 10}}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="days" tickLine={false} axisLine={false} tickMargin={8} />
                                <YAxis />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Line type="monotone" dataKey="postCapa" stroke="var(--color-postCapa)" strokeWidth={2} dot={false} name="Recurrence Rate" />
                            </LineChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>CAPA Effectiveness Tracker</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <div className="relative h-24 w-24">
                                <svg className="h-full w-full" viewBox="0 0 36 36">
                                    <path className="text-muted/50" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                    <path className="text-primary" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray={`${effectivenessPercentage}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-2xl font-bold">{effectivenessPercentage.toFixed(0)}%</span>
                                </div>
                            </div>
                            <div className="flex-1 space-y-1">
                                <p className="text-sm font-medium leading-none">Successful CAPAs</p>
                                <p className="text-sm text-muted-foreground">{capaEffectiveness.successful} actions led to reduced recurrence.</p>
                                <p className="text-sm font-medium leading-none mt-2">Failed CAPAs</p>
                                <p className="text-sm text-muted-foreground">{capaEffectiveness.failed} actions did not resolve the issue.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Failure Chain Graph</CardTitle>
                <CardDescription>Visual flow from root cause to final resolution for a critical issue.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center space-x-2 md:space-x-4 overflow-x-auto p-6">
                {rcaCapaAnalyticsData.failureChain.map((item, index) => (
                    <React.Fragment key={index}>
                        <div className="flex flex-col items-center text-center w-32 shrink-0">
                            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted border-2 border-dashed border-primary/50 mb-2">
                                {React.createElement(
                                    { Settings, CircuitBoard, Factory, CheckCircle }[index] || Activity,
                                    { className: "w-8 h-8 text-primary" }
                                )}
                            </div>
                            <p className="font-semibold text-sm">{item.stage}</p>
                            <p className="text-xs text-muted-foreground">{item.detail}</p>
                        </div>
                        {index < rcaCapaAnalyticsData.failureChain.length - 1 && <ChevronRight className="w-8 h-8 text-muted-foreground shrink-0" />}
                    </React.Fragment>
                ))}
            </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Supplier Defect Correlation Heatmap</CardTitle>
                    <CardDescription>Which suppliers' parts are linked to which issues.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Supplier</TableHead>
                                {rcaCapaAnalyticsData.supplierDefectCorrelation[0].issues.map(issue => (
                                    <TableHead key={issue.name} className="text-center">{issue.name}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {supplierDefects.map(supplier => (
                                <TableRow key={supplier.supplier}>
                                    <TableCell className="font-medium">{supplier.supplier}</TableCell>
                                    {supplier.issues.map(issue => (
                                        <TableCell key={issue.name} className="text-center">
                                            <div className="w-full h-8 flex items-center justify-center rounded" style={{ backgroundColor: `hsl(var(--primary) / ${issue.count / 30})` }}>
                                               {issue.count > 0 && <span className="font-mono text-xs text-white" style={{ textShadow: '0 0 2px black' }}>{issue.count}</span>}
                                            </div>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>AI Root Cause Recommendation Engine</CardTitle>
                    <CardDescription>Probable manufacturing or design flaws based on field failures.</CardDescription>
                </CardHeader>
                <CardContent>
                    {rcaCapaAnalyticsData.aiRecommendations.map((rec, index) => (
                        <div key={index} className={cn("p-3 rounded-lg", index > 0 && "mt-3", index % 2 === 0 ? "bg-muted/50" : "")}>
                           <div className="flex items-start gap-3">
                                <Bot className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="font-semibold text-sm">{rec.issue}</p>
                                    <p className="text-xs text-muted-foreground">{rec.recommendation}</p>
                                    <Badge variant="outline" className="mt-2 text-xs">Confidence: {(rec.confidence * 100).toFixed(0)}%</Badge>
                                </div>
                           </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Design Vulnerability Index</CardTitle>
                    <CardDescription>AI-assigned risk scores for vehicle designs.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableBody>
                            {designVulnerability.map(item => {
                                const risk = getRiskFromScore(item.riskScore);
                                return (
                                    <TableRow key={item.model}>
                                        <TableCell className="font-medium">{item.model}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={cn("font-mono text-xs border", riskColors[risk])}>
                                                {item.riskScore.toFixed(1)}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                     </Table>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Component Impact Scorecard</CardTitle>
                    <CardDescription>Priority based on failure rate, severity & cost.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableBody>
                            {impactScorecard.map(item => (
                                <TableRow key={item.component}>
                                    <TableCell className="font-medium">{item.component}</TableCell>
                                    <TableCell className="text-right font-mono">{item.impactScore.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Assembly Line Risk Detection</CardTitle>
                    <CardDescription>Lots with higher-than-average failure rates.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableBody>
                            {assemblyLineRisk.map(item => (
                                <TableRow key={item.lotId}>
                                    <TableCell className="font-medium">{item.lotId}</TableCell>
                                    <TableCell className="flex items-center justify-end gap-2 text-right">
                                        <span className={cn(item.failureRate > 0.05 ? "text-red-400" : "text-green-400")}>
                                            {(item.failureRate * 100).toFixed(2)}%
                                        </span>
                                        {item.failureRate > 0.05 ? <TrendingUp className="w-4 h-4 text-red-500" /> : <TrendingDown className="w-4 h-4 text-green-500" />}
                                    </TableCell>
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
