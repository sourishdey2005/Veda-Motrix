"use client";

import { useAuth } from "@/hooks/use-auth";
import { VehicleHealthCard } from "@/components/dashboard/user/vehicle-health-card";
import { MaintenanceTimeline } from "@/components/dashboard/user/maintenance-timeline";
import { VedaMotrixLogo } from "@/components/icons";

export default function VehicleDetailsPage({ params: { id } }: { params: { id: string } }) {
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
        <VehicleHealthCard vehicle={vehicle} />
        <MaintenanceTimeline vehicle={vehicle} />
    </div>
  )
}
