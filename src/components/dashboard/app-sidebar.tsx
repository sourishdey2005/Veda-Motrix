"use client";

import { VedaMotrixLogo } from "@/components/icons";
import { useAuth } from "@/hooks/use-auth";
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { BarChart, Car, Factory, HeartPulse, LayoutDashboard, ShieldCheck, Users, Wrench, Bot } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const managerNav = [
    { name: "Dashboard", href: "/dashboard/manager", icon: LayoutDashboard },
    { name: "Orchestration", href: "/dashboard/orchestration", icon: Bot },
    { name: "Service Analytics", href: "/dashboard/analytics", icon: BarChart },
    { name: "Manufacturing", href: "/dashboard/manufacturing", icon: Factory },
    { name: "UEBA Security", href: "/dashboard/ueba", icon: ShieldCheck },
];

const serviceCenterNav = [
    { name: "Dashboard", href: "/dashboard/service-center", icon: LayoutDashboard },
    { name: "Customer Feedback", href: "/dashboard/feedback", icon: Users },
];

const userNav = [
    { name: "My Vehicle", href: "/dashboard/user", icon: Car },
    { name: "Vehicle Health", href: "/dashboard/health", icon: HeartPulse },
    { name: "Schedule Service", href: "/dashboard/schedule", icon: Wrench },
];


export function AppSidebar() {
  const { user } = useAuth();
  const pathname = usePathname();

  let navItems = userNav;
  if (user?.role === 'manager') navItems = managerNav;
  if (user?.role === 'service-center') navItems = serviceCenterNav;

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
            <VedaMotrixLogo className="w-8 h-8 text-primary" />
            <span className="text-lg font-semibold font-headline">VEDA-MOTRIX</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
            {navItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                    <Link href={item.href} legacyBehavior passHref>
                      <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.name}>
                        <a>
                          <item.icon />
                          <span>{item.name}</span>
                        </a>
                      </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
            ))}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}
