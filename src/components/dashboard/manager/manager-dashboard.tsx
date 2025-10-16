"use client"

import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Activity, AlertTriangle, ArrowRight, Bot, CheckCircle, Cpu, ShieldCheck, Factory, Users, Wrench, BarChart, Car, HeartPulse } from "lucide-react"
import React from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"

const agents = [
  { name: 'Data Analysis Agent', icon: Activity, href: "/dashboard/analytics" },
  { name: 'Diagnosis Agent', icon: HeartPulse, href: "/dashboard/analytics" },
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
                Active AI Agents
            </CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Agents currently operational.</p>
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
