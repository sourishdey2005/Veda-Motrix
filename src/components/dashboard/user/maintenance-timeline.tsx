"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Vehicle } from "@/lib/types"

export function MaintenanceTimeline({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Maintenance History</CardTitle>
        <CardDescription>A timeline of all service records for your vehicle.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative pl-6">
            <div className="absolute left-[30px] top-0 h-full w-0.5 bg-border -translate-x-1/2"></div>
            {vehicle.maintenanceHistory.map((log, index) => (
                <div key={log.id} className="relative mb-8 flex items-start">
                    <div className="absolute left-[30px] top-1/2 h-3 w-3 rounded-full bg-primary ring-4 ring-background -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="w-20 text-sm text-muted-foreground pt-1">{log.date}</div>
                    <div className="ml-8 flex-1">
                        <h4 className="font-semibold">{log.service}</h4>
                        <p className="text-sm text-muted-foreground">Mileage: {log.mileage.toLocaleString()}</p>
                        <p className="text-sm mt-1">{log.notes}</p>
                    </div>
                </div>
            ))}
        </div>
      </CardContent>
    </Card>
  )
}
