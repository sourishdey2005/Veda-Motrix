"use client";

import { useAuth } from "@/hooks/use-auth";
import { ManagerDashboard } from "@/components/dashboard/manager/manager-dashboard";
import { ServiceCenterDashboard } from "@/components/dashboard/service-center/service-center-dashboard";
import { UserDashboard } from "@/components/dashboard/user/user-dashboard";
import { VedaMotrixLogo } from "../icons";

export function DashboardClient() {
  const { user, loading } = useAuth();

  if (loading || !user) {
    return (
      <div className="flex h-[calc(100vh-10rem)] w-full items-center justify-center">
        <VedaMotrixLogo className="h-16 w-16 animate-pulse" />
      </div>
    );
  }

  switch (user.role) {
    case 'manager':
      return <ManagerDashboard />;
    case 'service-center':
      return <ServiceCenterDashboard />;
    case 'user':
      return <UserDashboard />;
    default:
      return <div>Invalid user role.</div>;
  }
}
