"use client"

import { useAuth } from "@/hooks/use-auth"
import { VehicleSummaryCard } from "./vehicle-summary-card"
import { MaintenanceAlerts } from "./maintenance-alerts"
import { VehicleHealthRadar } from "./vehicle-health-radar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ServiceScheduler } from "./service-scheduler"
import { AIChat } from "./ai-chat"

export function UserDashboard() {
  const { user, vehicles } = useAuth();
  const userVehicles = vehicles.filter(v => v.ownerId === user?.id);

  if (!user || userVehicles.length === 0) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Welcome, {user?.name || 'User'}!</CardTitle>
                <CardDescription>You have no vehicles being monitored.</CardDescription>
            </CardHeader>
        </Card>
    );
  }

  // For this prototype, we'll focus on the first vehicle for the radar chart.
  const primaryVehicle = userVehicles[0];

  return (
    <div className="space-y-6">
       <Card>
        <CardHeader>
            <CardTitle>Hello, {user.name.split(' ')[0]} 👋</CardTitle>
            <CardDescription>
                You have {userVehicles.length} vehicle{userVehicles.length > 1 ? 's' : ''} in your fleet.
            </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {userVehicles.map(vehicle => (
                <VehicleSummaryCard key={vehicle.id} vehicle={vehicle} />
             ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <VehicleHealthRadar vehicle={primaryVehicle} />
            <MaintenanceAlerts vehicle={primaryVehicle} />
        </div>

        <div className="lg:col-span-1 grid grid-cols-1 gap-6">
            <ServiceScheduler />
            <AIChat />
        </div>
      </div>
    </div>
  )
}
