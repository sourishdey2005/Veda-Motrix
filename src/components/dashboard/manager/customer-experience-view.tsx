"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts"
import type { ChartConfig } from "@/components/ui/chart"
import { useState, useEffect, useCallback } from "react"
import { TrendingUp, TrendingDown, Star, PhoneForwarded, MessageSquareQuote, CheckCheck, UserCheck, Repeat, Users, Network, Gauge } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { customerExperienceData, serviceCenters } from "@/lib/data"
import { Progress } from "@/components/ui/progress"

const chartConfig: ChartConfig = {
    predictionToAppointment: { label: "Prediction to Appointment", color: "hsl(var(--chart-1))" },
    appointmentToRepair: { label: "Appointment to Repair", color: "hsl(var(--chart-2))" },
    users: { label: "Users", color: "hsl(var(--chart-1))" },
    count: { label: "Count", color: "hsl(var(--chart-2))" },
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

export function CustomerExperienceView() {

    const sentiment = useSimulatedData(customerExperienceData.sentimentScore, s => Math.min(10, Math.max(0, s + (Math.random() - 0.5) * 0.1)));
    const declineRate = useSimulatedData(customerExperienceData.appointmentDeclineRate, r => Math.max(5, r + (Math.random() - 0.5) * 0.5));
    const voiceSuccess = useSimulatedData(customerExperienceData.voiceInteractionSuccess, s => Math.min(100, s + (Math.random() - 0.5) * 1));
    const feedbackRatio = useSimulatedData(customerExperienceData.feedbackToActionRatio, r => Math.min(100, r + (Math.random() - 0.5) * 1));
    const retentionProb = useSimulatedData(customerExperienceData.retentionProbability, p => Math.min(100, p + (Math.random() - 0.5) * 0.5));
    const networkUtil = useSimulatedData(customerExperienceData.networkUtilization, u => Math.min(100, u + (Math.random() - 0.5) * 0.5));
    
    const responseTime = useSimulatedData(customerExperienceData.responseTime, d => d.map(c => ({...c, predictionToAppointment: Math.max(1, c.predictionToAppointment + (Math.random() - 0.5) * 0.2), appointmentToRepair: Math.max(0.5, c.appointmentToRepair + (Math.random() - 0.5) * 0.1)})));
    const engagement = useSimulatedData(customerExperienceData.userEngagement, d => d.map(e => ({...e, value: Math.max(0.1, e.value + (Math.random() - 0.5) * 0.1)})));
    const topCenters = useSimulatedData(serviceCenters, d => d.map(c => ({...c, rating: Math.min(5, Math.max(4, c.rating + (Math.random() - 0.5) * 0.05)), avgCompletionTime: Math.max(2, c.avgCompletionTime + (Math.random() - 0.5) * 0.1)})).sort((a,b) => b.rating - a.rating));
    const complaintRecurrence = useSimulatedData(customerExperienceData.complaintRecurrence, d => d.map(c => ({...c, count: c.count + (Math.random() > 0.8 ? 1 : 0), users: c.users + (Math.random() > 0.9 ? 1 : 0) })));


  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Customer &amp; Service Experience Analytics</CardTitle>
                <CardDescription>Measure satisfaction, responsiveness, and system impact on real users.</CardDescription>
            </CardHeader>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2"><Star className="text-yellow-400"/> Sentiment</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">{sentiment.toFixed(1)}<span className="text-sm font-normal text-muted-foreground">/10</span></p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2"><TrendingDown /> Decline Rate</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">{declineRate.toFixed(1)}%</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2"><PhoneForwarded /> Voice AI</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">{voiceSuccess.toFixed(1)}%</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2"><CheckCheck /> Fdbk-Action</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">{feedbackRatio.toFixed(1)}%</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2"><UserCheck /> Retention</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">{retentionProb.toFixed(1)}%</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2"><Network /> Utilization</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">{networkUtil.toFixed(1)}%</p>
                </CardContent>
            </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <Card>
                <CardHeader>
                    <CardTitle>Service Response Time</CardTitle>
                    <CardDescription>Average time from AI prediction to appointment to repair.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-64">
                        <BarChart data={responseTime}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="city" tickLine={false} axisLine={false} tickMargin={10} />
                            <YAxis unit="d" />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Legend />
                            <Bar dataKey="predictionToAppointment" stackId="a" fill="var(--color-predictionToAppointment)" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="appointmentToRepair" stackId="a" fill="var(--color-appointmentToRepair)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Top Rated Service Centers</CardTitle>
                    <CardDescription>Leaderboard of centers by satisfaction and completion time.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Center</TableHead>
                                <TableHead className="text-right">Rating</TableHead>
                                <TableHead className="text-right">Avg Time (hrs)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {topCenters.slice(0, 4).map(center => (
                                <TableRow key={center.id}>
                                    <TableCell className="font-medium">{center.name}</TableCell>
                                    <TableCell className="text-right font-mono flex items-center justify-end gap-1">{center.rating.toFixed(1)} <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /></TableCell>
                                    <TableCell className="text-right font-mono">{center.avgCompletionTime.toFixed(1)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>User Engagement Analytics</CardTitle>
                    <CardDescription>Tracks key interactions per customer.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {engagement.map(item => (
                         <div key={item.metric}>
                            <p className="text-sm font-medium">{item.metric}</p>
                            <div className="flex items-center gap-2">
                                <Progress value={item.value * 10} className="h-2" />
                                <span className="text-sm font-bold font-mono">{item.value.toFixed(1)}</span>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Complaint Recurrence</CardTitle>
                    <CardDescription>Users who reported similar issues multiple times.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-56">
                        <BarChart data={complaintRecurrence} layout="vertical">
                            <CartesianGrid horizontal={false} />
                            <YAxis dataKey="issue" type="category" width={80} tickLine={false} axisLine={false} />
                            <XAxis type="number" />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Legend />
                            <Bar dataKey="users" stackId="a" fill="var(--color-users)" name="Unique Users" />
                            <Bar dataKey="count" stackId="a" fill="var(--color-count)" name="Total Reports" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Feedback-to-Action Funnel</CardTitle>
                    <CardDescription>From customer issue to CAPA improvement.</CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="flex flex-col items-center justify-center h-56 space-y-2">
                        <div className="flex items-center gap-2">
                            <MessageSquareQuote className="w-5 h-5 text-primary" />
                            <p className="font-medium">100 Issues Raised</p>
                        </div>
                        <div className="h-4 w-0.5 bg-border rotate-90" />
                        <div className="flex items-center gap-2">
                            <Gauge className="w-5 h-5 text-primary" />
                            <p className="font-medium">65 Analyzed by AI</p>
                        </div>
                        <div className="h-4 w-0.5 bg-border rotate-90" />
                        <div className="flex items-center gap-2">
                            <Factory className="w-5 h-5 text-primary" />
                            <p className="font-medium">45 CAPA Actions Created</p>
                        </div>
                         <div className="h-4 w-0.5 bg-border rotate-90" />
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-green-500" />
                            <p className="font-medium">30 Resolved</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

    </div>
  )
}