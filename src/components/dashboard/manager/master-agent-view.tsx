"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, AlertTriangle, ArrowRight, Bot, CheckCircle, Cpu, ShieldCheck, Factory, Users, Wrench, BarChart, Car, HeartPulse } from "lucide-react"
import React, { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

const agents = [
  { name: 'Data Analysis Agent', icon: Activity },
  { name: 'Diagnosis Agent', icon: HeartPulse },
  { name: 'Failure Prediction Agent', icon: AlertTriangle },
  { name: 'Customer Engagement Agent', icon: Users },
  { name: 'Scheduling Agent', icon: Wrench },
  { name: 'Feedback Agent', icon: Bot },
  { name: 'Manufacturing Insights Agent', icon: Factory },
  { name: 'UEBA Security Agent', icon: ShieldCheck },
]

export function MasterAgentView() {
  const [activeAgent, setActiveAgent] = useState(-1);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAgent((prev) => {
        const next = prev + 1;
        if (next >= agents.length) {
          // After the last agent, wait a bit then reset
          setTimeout(() => setActiveAgent(-1), 2000);
          return next;
        }
        return next;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="lg:col-span-4">
        <CardHeader>
          <CardTitle>Manager Dashboard: Master Agent Orchestration</CardTitle>
          <CardDescription>Visualizing the AI worker agent collaboration flow.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative flex flex-wrap items-center justify-center gap-4 p-4 rounded-lg bg-muted/50 min-h-[120px]">
            {agents.map((agent, index) => (
              <React.Fragment key={agent.name}>
                <div className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-lg border bg-background transition-all duration-500",
                  activeAgent >= index ? "shadow-lg scale-105 border-primary" : "opacity-50",
                  activeAgent === index && "animate-pulse"
                )}>
                  <agent.icon className={cn("w-8 h-8", activeAgent >= index ? "text-primary" : "text-muted-foreground")} />
                  <span className="text-xs text-center font-medium w-24">{agent.name}</span>
                </div>
                {index < agents.length -1 && <ArrowRight className={cn("h-6 w-6 text-muted-foreground transition-all duration-500", activeAgent > index ? "text-primary" : "opacity-50")} />}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">System Health</CardTitle>
          <Cpu className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">Optimal</div>
          <p className="text-xs text-muted-foreground">All systems are running smoothly.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">3</div>
          <p className="text-xs text-muted-foreground">2 Warnings, 1 Critical</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Manufacturing Insights</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">5</div>
          <p className="text-xs text-muted-foreground">New suggestions generated this week.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Vehicles Monitored</CardTitle>
          <Car className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">10</div>
          <p className="text-xs text-muted-foreground">Across 10 different models.</p>
        </CardContent>
      </Card>
    </div>
  )
}
