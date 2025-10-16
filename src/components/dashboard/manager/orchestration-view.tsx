"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, AlertTriangle, ArrowRight, Bot, ShieldCheck, Factory, Users, Wrench, Siren, Loader2, CheckCircle } from "lucide-react"
import React, { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"

const initialAgents = [
  { name: 'Data Analysis Agent', icon: Activity, href: "/dashboard/analytics", status: 'ok' },
  { name: 'Diagnosis Agent', icon: Bot, href: "/dashboard/analytics", status: 'ok' },
  { name: 'Failure Prediction Agent', icon: AlertTriangle, href: "/dashboard/analytics", status: 'ok' },
  { name: 'Customer Engagement Agent', icon: Users, href: "#", status: 'ok' },
  { name: 'Scheduling Agent', icon: Wrench, href: "#", status: 'ok' },
  { name: 'Feedback Agent', icon: Bot, href: "#", status: 'ok' },
  { name: 'Manufacturing Insights Agent', icon: Factory, href: "/dashboard/manufacturing", status: 'ok' },
  { name: 'UEBA Security Agent', icon: ShieldCheck, href: "/dashboard/ueba", status: 'ok' },
]

export function OrchestrationView() {
  const [agents, setAgents] = useState(initialAgents);
  const [activeAgent, setActiveAgent] = useState(-1);
  const [failedAgentIndex, setFailedAgentIndex] = useState<number | null>(null);

  // Agent progression animation
  useEffect(() => {
    const progressionInterval = setInterval(() => {
      setActiveAgent((prev) => (prev + 1) % (agents.length + 2)); // Add extra steps for pauses
    }, 1500);
    return () => clearInterval(progressionInterval);
  }, [agents.length]);

  // Self-healing simulation
  useEffect(() => {
    const healingInterval = setInterval(() => {
      // Don't trigger a new failure if one is already in progress
      if (failedAgentIndex !== null) return;

      const agentToFail = Math.floor(Math.random() * agents.length);
      setFailedAgentIndex(agentToFail);

      // Mark agent as failed
      setAgents(currentAgents =>
        currentAgents.map((agent, index) =>
          index === agentToFail ? { ...agent, status: 'failed' } : agent
        )
      );

      // After 3 seconds, mark as restarting
      setTimeout(() => {
        setAgents(currentAgents =>
          currentAgents.map((agent, index) =>
            index === agentToFail ? { ...agent, status: 'restarting' } : agent
          )
        );
      }, 3000);

      // After 5 seconds, resolve the failure
      setTimeout(() => {
        setAgents(currentAgents =>
          currentAgents.map((agent, index) =>
            index === agentToFail ? { ...agent, status: 'ok' } : agent
          )
        );
        setFailedAgentIndex(null);
      }, 5000);

    }, 15000); // Trigger a failure every 15 seconds

    return () => clearInterval(healingInterval);
  }, [failedAgentIndex, agents.length]);

  const failedAgent = failedAgentIndex !== null ? agents[failedAgentIndex] : null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Master Agent Orchestration</CardTitle>
          <CardDescription>Visualizing the AI worker agent collaboration flow and self-healing capabilities.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative flex flex-wrap items-center justify-center gap-4 p-4 rounded-lg bg-muted/50 min-h-[120px]">
            {agents.map((agent, index) => (
              <React.Fragment key={agent.name}>
                 <Link href={agent.href}>
                    <div className={cn(
                      "flex flex-col items-center gap-2 p-3 rounded-lg border bg-background transition-all duration-500 w-28 h-28 justify-center",
                      activeAgent >= index ? "shadow-lg scale-105" : "opacity-50",
                      agent.status === 'ok' && activeAgent >= index && "border-primary",
                      agent.status === 'failed' && "border-destructive bg-destructive/10 shadow-red-500/50 animate-pulse",
                      agent.status === 'restarting' && "border-yellow-500 bg-yellow-500/10"
                    )}>
                      <agent.icon className={cn(
                        "w-8 h-8 transition-colors", 
                        agent.status === 'ok' && activeAgent >= index ? "text-primary" : "text-muted-foreground",
                        agent.status === 'failed' && "text-destructive",
                        agent.status === 'restarting' && "text-yellow-500",
                      )} />
                      <span className="text-xs text-center font-medium">{agent.name}</span>
                    </div>
                </Link>
                {index < agents.length -1 && <ArrowRight className={cn("h-6 w-6 text-muted-foreground transition-all duration-500", activeAgent > index ? "text-primary" : "opacity-50")} />}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>

      {failedAgent && (
         <Card className={cn(
            "transition-all duration-500",
            failedAgent.status === 'failed' && "border-destructive bg-destructive/5",
            failedAgent.status === 'restarting' && "border-yellow-500 bg-yellow-500/5",
         )}>
            <CardHeader>
                <div className="flex items-center gap-4">
                     {failedAgent.status === 'failed' && <Siren className="w-8 h-8 text-destructive" />}
                     {failedAgent.status === 'restarting' && <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />}
                     {failedAgent.status === 'ok' && <CheckCircle className="w-8 h-8 text-green-500" />}
                    <div>
                        <CardTitle>Self-Healing Agent Monitor</CardTitle>
                        <CardDescription>
                            {failedAgent.status === 'failed' && `Anomaly detected in ${failedAgent.name}. Behavior is outside normal parameters.`}
                            {failedAgent.status === 'restarting' && `Restarting ${failedAgent.name} to restore normal function...`}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
         </Card>
      )}

    </div>
  )
}
