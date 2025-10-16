"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, AlertTriangle, ArrowRight, Bot, CheckCircle, Cpu, ShieldCheck } from "lucide-react"
import React, { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

const agents = [
  { name: 'Data Analysis Agent', icon: Activity },
  { name: 'Diagnosis Agent', icon: Bot },
  { name: 'Customer Engagement Agent', icon: Bot },
  { name: 'Scheduling Agent', icon: Bot },
  { name: 'Feedback Agent', icon: Bot },
  { name: 'Manufacturing Insights Agent', icon: Bot },
  { name: 'UEBA Security Agent', icon: ShieldCheck },
]

export function MasterAgentView() {
  const [activeAgent, setActiveAgent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAgent((prev) => (prev + 1) % (agents.length + 1));
    }, 2000);
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
          <div className="relative flex flex-wrap items-center justify-center gap-4 p-4 rounded-lg bg-muted/50">
            {agents.map((agent, index) => (
              <React.Fragment key={agent.name}>
                <div className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-lg border bg-background transition-all duration-500",
                  activeAgent === index ? "shadow-lg scale-105 border-primary" : "opacity-70"
                )}>
                  <agent.icon className={cn("w-8 h-8", activeAgent === index ? "text-primary" : "text-muted-foreground")} />
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
          <CardTitle className="text-sm font-medium">Maintenance Insights</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">5</div>
          <p className="text-xs text-muted-foreground">New suggestions generated this week.</p>
        </CardContent>
      </Card>
    </div>
  )
}
