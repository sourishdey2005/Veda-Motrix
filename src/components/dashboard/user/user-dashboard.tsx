"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/use-auth"
import { vehicles } from "@/lib/data"
import { VehicleHealthCard } from "./vehicle-health-card"
import { ServiceScheduler } from "./service-scheduler"
import { MaintenanceTimeline } from "./maintenance-timeline"
import { AIChat } from "./ai-chat"

export function UserDashboard() {
  const { user } = useAuth();
  const userVehicles = vehicles.filter(v => v.ownerId === user?.id);

  if (!user || userVehicles.length === 0) {
    return <p>No vehicles found for this user.</p>;
  }

  // For this prototype, we'll focus on the first vehicle.
  const vehicle = userVehicles[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <VehicleHealthCard vehicle={vehicle} />
        <MaintenanceTimeline vehicle={vehicle} />
      </div>
      <div className="lg:col-span-1 space-y-6">
        <ServiceScheduler />
        <AIChat />
      </div>
    </div>
  )
}
