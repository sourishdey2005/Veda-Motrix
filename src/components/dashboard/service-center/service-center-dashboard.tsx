
"use client"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { KpiCards } from "./kpi-cards"
import { AppointmentKanbanBoard } from "./appointment-kanban-board"
import { useAuth } from "@/hooks/use-auth"
import { serviceCenters } from "@/lib/data"
import { VedaMotrixLogo } from "@/components/icons"

export function ServiceCenterDashboard() {
  const { user } = useAuth();
  
  // In a real app, the service center would be associated with the user.
  // For this prototype, we'll just pick the first one.
  const currentServiceCenter = serviceCenters[0];

  return (
    <div className="space-y-6">
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
         <VedaMotrixLogo className="w-10 h-10 text-primary hidden sm:block" />
        <div>
            <CardTitle>{currentServiceCenter.name}</CardTitle>
            <CardDescription>
            {currentServiceCenter.city} — Service Operations & Scheduling
            </CardDescription>
        </div>
      </CardHeader>
    </Card>
    <KpiCards />
    <AppointmentKanbanBoard />
    </div>
  )
}
