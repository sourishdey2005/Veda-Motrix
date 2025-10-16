"use client";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { VedaMotrixLogo } from "@/components/icons";

export default function DashboardRedirectPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        switch (user.role) {
          case 'manager':
            router.replace('/dashboard/manager');
            break;
          case 'service-center':
            router.replace('/dashboard/service-center');
            break;
          case 'user':
            router.replace('/dashboard/user');
            break;
        }
      } else {
        router.replace('/login/user');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <VedaMotrixLogo className="h-16 w-16 animate-pulse" />
    </div>
  );
}
