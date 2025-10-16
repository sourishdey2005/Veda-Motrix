
"use client";

import { useAuth } from "@/hooks/use-auth";
import { VehicleDetailsCard } from "@/components/dashboard/user/vehicle-details-card";
import { MaintenanceTimeline } from "@/components/dashboard/user/maintenance-timeline";
import { ComponentHealthTrends } from "@/components/dashboard/user/component-health-trends";
import { PredictiveCostEstimator } from "@/components/dashboard/user/predictive-cost-estimator";
import { ServiceCenterLocator } from "@/components/dashboard/user/service-center-locator";
import { VedaMotrixLogo } from "@/components/icons";
import { useParams } from "next/navigation";

export default function VehicleDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const { vehicles, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex h-[calc(100vh-10rem)] w-full items-center justify-center">
        <VedaMotrixLogo className="h-16 w-16 animate-pulse" />
      </div>
    );
  }

  const vehicle = vehicles.find(v => v.id === id);

  if (!vehicle) {
    return <p>Vehicle not found.</p>;
  }

  return (
    <div className="space-y-6">
        <VehicleDetailsCard vehicle={vehicle} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <ComponentHealthTrends vehicle={vehicle} />
                <MaintenanceTimeline vehicle={vehicle} />
            </div>
            <div className="space-y-6">
                <PredictiveCostEstimator vehicle={vehicle} />
                <ServiceCenterLocator />
            </div>
        </div>
    </div>
  )
}
