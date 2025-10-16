
"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart, Bar, XAxis, YAxis, LabelList,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart, Line, CartesianGrid, Legend
} from 'recharts';
import type { ChartConfig } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { technicians } from '@/lib/data';

const chartConfig: ChartConfig = {
    vehiclesServiced: { label: "Vehicles Serviced", color: "hsl(var(--chart-1))" },
    skill: { label: "Proficiency", color: "hsl(var(--chart-2))" },
    turnaround: { label: "Avg. Time (hrs)", color: "hsl(var(--chart-3))" },
};

export function TechnicianPerformance() {
  const [selectedTechId, setSelectedTechId] = useState(technicians[0].id);

  const selectedTech = technicians.find(t => t.id === selectedTechId) || technicians[0];

  const allTechsPerformance = technicians.map(tech => ({
    name: tech.name.split(' ')[0],
    vehiclesServiced: tech.performance.vehiclesServicedToday
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Vehicles Serviced Today</CardTitle>
          <CardDescription>Productivity across all technicians.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <BarChart
              data={allTechsPerformance}
              layout="vertical"
              margin={{ left: 10 }}
            >
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                axisLine={false}
              />
              <XAxis dataKey="vehiclesServiced" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="vehiclesServiced" fill="var(--color-vehiclesServiced)" radius={4}>
                 <LabelList
                    dataKey="vehiclesServiced"
                    position="right"
                    offset={8}
                    className="fill-foreground"
                    fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
                <CardTitle>Skill Proficiency</CardTitle>
                <CardDescription>Individual skill assessment.</CardDescription>
            </div>
            <Select value={selectedTechId} onValueChange={setSelectedTechId}>
                <SelectTrigger className="w-32">
                    <SelectValue placeholder="Select Tech" />
                </SelectTrigger>
                <SelectContent>
                    {technicians.map(t => (
                        <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <RadarChart data={selectedTech.performance.skillProficiency}>
                <ChartTooltip content={<ChartTooltipContent />} />
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                    name={`${selectedTech.name}'s Proficiency`}
                    dataKey="score"
                    stroke="var(--color-skill)"
                    fill="var(--color-skill)"
                    fillOpacity={0.6}
                />
            </RadarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>Avg. Turnaround Time</CardTitle>
            <CardDescription>{selectedTech.name}'s time per issue type.</CardDescription>
        </CardHeader>
        <CardContent>
             <ChartContainer config={chartConfig} className="h-64">
                <LineChart data={selectedTech.performance.avgTurnaround}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="issueType" tickLine={false} axisLine={false} tickMargin={8} fontSize={10} />
                    <YAxis dataKey="time" unit="hr" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                        type="monotone"
                        dataKey="time"
                        stroke="var(--color-turnaround)"
                        strokeWidth={2}
                        dot={true}
                    />
                </LineChart>
             </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
