"use client"

import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Activity, AlertTriangle, ArrowRight, Bot, CheckCircle, Cpu, ShieldCheck, Factory, Users, Wrench, BarChart, Car, HeartPulse } from "lucide-react"
import React from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"

const agents = [
  { name: 'Data Analysis Agent', icon: Activity, href: "/dashboard/analytics" },
  { name: 'Diagnosis Agent', icon: HeartPulse, href: "/dashboard/analytics" },
  { name: 'Failure Prediction Agent', icon: AlertTriangle, href: "/dashboard/analytics" },
  { name: 'Customer Engagement Agent', icon: Users, href: "#" },
  { name: 'Scheduling Agent', icon: Wrench, href: "#" },
  { name: 'Feedback Agent', icon: Bot, href: "#" },
  { name: 'Manufacturing Insights Agent', icon: Factory, href: "/dashboard/manufacturing" },
  { name: 'UEBA Security Agent', icon: ShieldCheck, href: "/dashboard/ueba" },
]


export function ManagerDashboard() {

  return (
    <div className="space-y-4">
       <Card>
        <CardHeader>
          <CardTitle>Manager Dashboard</CardTitle>
          <CardDescription>
            Welcome, Manager. Get a high-level overview of the VEDA-MOTRIX AI system.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="col-span-1 lg:col-span-4">
            <CardHeader>
                <CardTitle>
                  <Link href="/dashboard/master" className="hover:underline">
                    Master Agent Orchestration
                  </Link>
                </CardTitle>
                <CardDescription>An overview of the AI worker agent collaboration flow. Click to see the full view.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="relative flex flex-wrap items-center justify-center gap-4 p-4 rounded-lg bg-muted/50 min-h-[120px]">
                    {agents.map((agent, index) => (
                    <React.Fragment key={agent.name}>
                        <Link href={agent.href}>
                            <div className={cn(
                            "flex flex-col items-center gap-2 p-3 rounded-lg border bg-background transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-primary"
                            )}>
                            <agent.icon className="w-8 h-8 text-primary" />
                            <span className="text-xs text-center font-medium w-24">{agent.name}</span>
                            </div>
                        </Link>
                        {index < agents.length -1 && <ArrowRight className="h-6 w-6 text-muted-foreground hidden sm:block" />}
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
            <CardTitle className="text-sm font-medium">
              <Link href="/dashboard/manufacturing" className="hover:underline">
                Manufacturing Insights
              </Link>
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">New suggestions for RCA/CAPA.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <Link href="/dashboard/analytics" className="hover:underline">
                Service Analytics
              </Link>
            </CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10</div>
            <p className="text-xs text-muted-foreground">Vehicle models being monitored.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
