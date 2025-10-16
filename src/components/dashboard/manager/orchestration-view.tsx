"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, AlertTriangle, ArrowRight, Bot, ShieldCheck, Factory, Users, Wrench } from "lucide-react"
import React, { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"

const agents = [
  { name: 'Data Analysis Agent', icon: Activity, href: "/dashboard/analytics" },
  { name: 'Diagnosis Agent', icon: Bot, href: "/dashboard/analytics" },
  { name: 'Failure Prediction Agent', icon: AlertTriangle, href: "/dashboard/analytics" },
  { name: 'Customer Engagement Agent', icon: Users, href: "#" },
  { name: 'Scheduling Agent', icon: Wrench, href: "#" },
  { name: 'Feedback Agent', icon: Bot, href: "#" },
  { name: 'Manufacturing Insights Agent', icon: Factory, href: "/dashboard/manufacturing" },
  { name: 'UEBA Security Agent', icon: ShieldCheck, href: "/dashboard/ueba" },
]

export function OrchestrationView() {
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
      <Card>
        <CardHeader>
          <CardTitle>Master Agent Orchestration</CardTitle>
          <CardDescription>Visualizing the AI worker agent collaboration flow.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative flex flex-wrap items-center justify-center gap-4 p-4 rounded-lg bg-muted/50 min-h-[120px]">
            {agents.map((agent, index) => (
              <React.Fragment key={agent.name}>
                 <Link href={agent.href}>
                    <div className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-lg border bg-background transition-all duration-500",
                    activeAgent >= index ? "shadow-lg scale-105 border-primary" : "opacity-50",
                    activeAgent === index && "animate-pulse"
                    )}>
                    <agent.icon className={cn("w-8 h-8", activeAgent >= index ? "text-primary" : "text-muted-foreground")} />
                    <span className="text-xs text-center font-medium w-24">{agent.name}</span>
                    </div>
                </Link>
                {index < agents.length -1 && <ArrowRight className={cn("h-6 w-6 text-muted-foreground transition-all duration-500", activeAgent > index ? "text-primary" : "opacity-50")} />}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>
  )
}
