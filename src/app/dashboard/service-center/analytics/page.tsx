
"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LiveVehicleQueue } from "@/components/dashboard/service-center/live-vehicle-queue";
import { TechnicianPerformance } from "@/components/dashboard/service-center/technician-performance";
import { RootCauseHeatmap } from "@/components/dashboard/service-center/root-cause-heatmap";
import { TechnicianCorrelationMatrix } from "@/components/dashboard/service-center/technician-correlation-matrix";
import { ServiceDurationAnalysis } from "@/components/dashboard/service-center/analytics/service-duration-analysis";
import { RepairCostAnalysis } from "@/components/dashboard/service-center/analytics/repair-cost-analysis";
import { PartFailureLifecycle } from "@/components/dashboard/service-center/analytics/part-failure-lifecycle";
import { AnomalyTimeline } from "@/components/dashboard/manager/advanced/anomaly-timeline";

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
            <Card>
                <CardHeader>
                    <CardTitle>Operational Efficiency Analytics</CardTitle>
                    <CardDescription>
                        Deeper insights into service duration, cost, and part lifecycle.
                    </CardDescription>
                </CardHeader>
            </Card>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ServiceDurationAnalysis />
                <RepairCostAnalysis />
            </div>
             <div className="grid grid-cols-1 gap-6">
                <PartFailureLifecycle />
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Advanced Analytics</CardTitle>
                    <CardDescription>
                        Insights into system anomalies.
                    </CardDescription>
                </CardHeader>
            </Card>
            <div className="space-y-6">
                <AnomalyTimeline />
            </div>
        </div>
    )
}
