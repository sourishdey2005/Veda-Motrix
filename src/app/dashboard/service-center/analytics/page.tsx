
"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LiveVehicleQueue } from "@/components/dashboard/service-center/live-vehicle-queue";
import { TechnicianPerformance } from "@/components/dashboard/service-center/technician-performance";
import { RootCauseHeatmap } from "@/components/dashboard/service-center/root-cause-heatmap";
import { TechnicianCorrelationMatrix } from "@/components/dashboard/service-center/technician-correlation-matrix";

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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <LiveVehicleQueue />
                    <RootCauseHeatmap />
                </div>
                <div className="lg:col-span-1 space-y-6">
                    <TechnicianPerformance />
                    <TechnicianCorrelationMatrix />
                </div>
            </div>
        </div>
    )
}
