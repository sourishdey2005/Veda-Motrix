"use client"

import { AppointmentsTable } from "./appointments-table"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ServiceCenterDashboard() {
  return (
    <div className="space-y-4">
    <Card>
      <CardHeader>
        <CardTitle>Service Center Dashboard</CardTitle>
        <CardDescription>
          Manage appointments and review customer feedback.
        </CardDescription>
      </CardHeader>
    </Card>
    <AppointmentsTable />
    </div>
  )
}
