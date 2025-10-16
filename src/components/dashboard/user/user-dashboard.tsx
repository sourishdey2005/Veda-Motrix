
"use client"

import { useAuth } from "@/hooks/use-auth"
import { VehicleSummaryCard } from "./vehicle-summary-card"
import { MaintenanceAlerts } from "./maintenance-alerts"
import { VehicleHealthRadar } from "./vehicle-health-radar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ServiceScheduler } from "./service-scheduler"
import { AIChatbot } from "./ai-chatbot"
import { VehicleUsageAnalytics } from "./vehicle-usage-analytics"
import { PredictiveInsightCard } from "./predictive-insight-card"
import { EnvironmentalImpact } from "./environmental-impact"

export function UserDashboard() {
  const { user, vehicles } = useAuth();
  // In a real app, you'd filter vehicles by the logged-in user's ID
  const userVehicles = vehicles.slice(0, 2); // Taking first 2 for "Mr. Rao"

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
                Here are the latest insights for your vehicles.
            </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {primaryVehicle.predictiveInsights.map(insight => (
                <PredictiveInsightCard key={insight.id} insight={insight} />
            ))}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <VehicleHealthRadar vehicle={primaryVehicle} />
                <MaintenanceAlerts vehicle={primaryVehicle} />
             </div>
             <VehicleUsageAnalytics vehicle={primaryVehicle} />
             <EnvironmentalImpact vehicle={primaryVehicle} />
        </div>

        <div className="space-y-6">
            <ServiceScheduler />
            <VehicleSummaryCard vehicle={primaryVehicle} />
        </div>
      </div>

      <AIChatbot />
    </div>
  )
}
