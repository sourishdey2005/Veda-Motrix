"use client"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MasterAgentView } from "./master-agent-view"


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
      <MasterAgentView />
    </div>
  )
}
