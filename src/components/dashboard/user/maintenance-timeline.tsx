"use client";

import type { Vehicle } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Wrench } from "lucide-react";
import { format } from "date-fns";

export function MaintenanceTimeline({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Maintenance History</CardTitle>
        <CardDescription>A log of all service and maintenance performed on this vehicle.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative pl-6">
          <div className="absolute left-0 top-0 h-full w-0.5 bg-border -translate-x-1/2 ml-3"></div>
          {vehicle.maintenanceHistory.map((item, index) => (
            <div key={item.id} className="relative mb-8">
              <div className="absolute -left-0.5 top-1 h-3 w-3 rounded-full bg-primary ring-4 ring-background -translate-x-1/2 ml-0.5"></div>
              <p className="font-semibold">{item.service}</p>
              <p className="text-sm text-muted-foreground">{format(new Date(item.date), "dd MMM yyyy")} at {item.mileage.toLocaleString('en-IN')} km</p>
              <p className="text-sm mt-1">{item.notes}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
