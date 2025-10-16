"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell } from "recharts"
import type { ChartConfig } from "@/components/ui/chart"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

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
    { name: 'Clutch Assembly', value: 400 },
    { name: 'AC Compressor', value: 300 },
    { name: 'Suspension Bushing', value: 300 },
    { name: 'Turbocharger', value: 200 },
    { name: 'Battery', value: 278 },
    { name: 'Injector', value: 189 },
];
const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

const mockPredictions = [
    {
      component: 'Brake Pads',
      failureType: 'Excessive Wear',
      priority: 'HIGH' as const,
      confidence: 0.92,
      suggestedActions: 'Replace brake pads and inspect rotors for wear.',
    },
    {
      component: 'Battery',
      failureType: 'Low Voltage',
      priority: 'MEDIUM' as const,
      confidence: 0.78,
      suggestedActions: 'Perform battery health check and consider replacement.',
    }
]

export function ServiceAnalyticsView() {
  const [predictions, setPredictions] = useState<typeof mockPredictions>([]);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    setLoading(true);
    setPredictions([]);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setPredictions(mockPredictions);
    setLoading(false);
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Predictive Maintenance</CardTitle>
          <CardDescription>Use AI to predict potential vehicle failures based on current data.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handlePredict} disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <AlertTriangle className="mr-2 h-4 w-4" />
            )}
            Run Failure Prediction on a Critical Vehicle
          </Button>
          {predictions.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="font-semibold">Prediction Results:</h4>
              {predictions.map((p, i) => (
                <div key={i} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <p className="font-medium">{p.component}: {p.failureType}</p>
                    <Badge variant={p.priority === 'HIGH' ? 'destructive' : p.priority === 'MEDIUM' ? 'default' : 'secondary'}>{p.priority}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{p.suggestedActions}</p>
                  <p className="text-xs font-mono text-right">Confidence: {(p.confidence * 100).toFixed(0)}%</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
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
