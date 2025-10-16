
"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LiveVehicleQueue } from "@/components/dashboard/service-center/live-vehicle-queue";
import { TechnicianPerformance } from "@/components/dashboard/service-center/technician-performance";

export default function ServiceCenterAnalyticsPage() {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Technician & Queue Analytics</CardTitle>
                    <CardDescription>
                        Real-time service queue and technician performance metrics.
                    </CardDescription>
                </CardHeader>
            </Card>
            <LiveVehicleQueue />
            <TechnicianPerformance />
        </div>
    )
}
