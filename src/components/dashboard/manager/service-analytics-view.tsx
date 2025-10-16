"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell } from "recharts"
import type { ChartConfig } from "@/components/ui/chart"

const defectFrequencyData = [
  { month: "January", defects: 186 },
  { month: "February", defects: 305 },
  { month: "March", defects: 237 },
  { month: "April", defects: 173 },
  { month: "May", defects: 209 },
  { month: "June", defects: 214 },
]

const chartConfig: ChartConfig = {
  defects: {
    label: "Defects",
    color: "hsl(var(--primary))",
  },
}

const failureComponentsData = [
    { name: 'Fuel Injector', value: 400 },
    { name: 'Transmission Gasket', value: 300 },
    { name: 'Brake Caliper', value: 300 },
    { name: 'O2 Sensor', value: 200 },
    { name: 'Battery', value: 278 },
    { name: 'Alternator', value: 189 },
];
const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];


export function ServiceAnalyticsView() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
        <Card>
            <CardHeader>
            <CardTitle>Defect Frequency</CardTitle>
            <CardDescription>Monthly reported defects across all models.</CardDescription>
            </CardHeader>
            <CardContent>
            <ChartContainer config={chartConfig} className="h-64">
                <BarChart data={defectFrequencyData}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="defects" fill="var(--color-defects)" radius={4} />
                </BarChart>
            </ChartContainer>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
            <CardTitle>Recurring Failure Components</CardTitle>
            <CardDescription>Most commonly replaced components.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
             <ChartContainer config={{}} className="h-64 aspect-square">
                <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                <Pie data={failureComponentsData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                     {failureComponentsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                </PieChart>
            </ChartContainer>
            </CardContent>
        </Card>
    </div>
  )
}
