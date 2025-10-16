
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { AddVehicleForm } from "@/components/dashboard/manager/add-vehicle-form"
import React from "react"

export function UserDashboard() {
  const { user, vehicles } = useAuth();
  const [open, setOpen] = React.useState(false);
  // In a real app, you'd filter vehicles by the logged-in user's ID
  const userVehicles = vehicles.slice(0, 2); // Taking first 2 for "Mr. Rao"

  if (!user) {
    return null;
  }
  
  // For this prototype, we'll focus on the first vehicle for the radar chart.
  const primaryVehicle = userVehicles[0];

  return (
    <div className="space-y-6">
       <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Hello, {user.name.split(' ')[0]} 👋</CardTitle>
                <CardDescription>
                    Here are the latest insights for your vehicles.
                </CardDescription>
            </div>
             <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Vehicle
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Vehicle</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new vehicle to monitor.
                  </DialogDescription>
                </DialogHeader>
                <AddVehicleForm onVehicleAdded={() => setOpen(false)} />
              </DialogContent>
            </Dialog>
        </CardHeader>
        {primaryVehicle && primaryVehicle.predictiveInsights && (
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {primaryVehicle.predictiveInsights.map(insight => (
                  <PredictiveInsightCard key={insight.id} insight={insight} />
              ))}
          </CardContent>
        )}
      </Card>
      
      {userVehicles.length > 0 && primaryVehicle ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <VehicleHealthRadar vehicle={primaryVehicle} />
                  <MaintenanceAlerts vehicle={primaryVehicle} />
              </div>
              <ServiceScheduler />
              <VehicleUsageAnalytics vehicle={primaryVehicle} />
              <EnvironmentalImpact vehicle={primaryVehicle} />
          </div>

          <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>My Vehicles</CardTitle>
                  <CardDescription>Quick overview of your monitored fleet.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userVehicles.map(vehicle => (
                      <VehicleSummaryCard key={vehicle.id} vehicle={vehicle} />
                  ))}
                </CardContent>
              </Card>
          </div>
        </div>
      ) : (
         <Card>
            <CardHeader>
                <CardTitle>Welcome!</CardTitle>
                <CardDescription>You have no vehicles being monitored. Click "Add New Vehicle" to get started.</CardDescription>
            </CardHeader>
        </Card>
      )}

      <AIChatbot />
    </div>
  )
}
