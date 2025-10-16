
"use client";

import { VedaMotrixLogo } from "@/components/icons";
import { useAuth } from "@/hooks/use-auth";
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { BarChart, Car, Factory, HeartPulse, LayoutDashboard, ShieldCheck, Users, Wrench, Bot, Briefcase, Smile, Settings, User as UserIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const managerNav = [
    { name: "Dashboard", href: "/dashboard/manager", icon: LayoutDashboard },
    { name: "Orchestration", href: "/dashboard/orchestration", icon: Bot },
    { name: "Service Analytics", href: "/dashboard/analytics", icon: BarChart },
    { name: "Executive Analytics", href: "/dashboard/executive", icon: Briefcase },
    { name: "Manufacturing", href: "/dashboard/manufacturing", icon: Factory },
    { name: "Customer Experience", href: "/dashboard/customer-experience", icon: Smile },
    { name: "UEBA Security", href: "/dashboard/ueba", icon: ShieldCheck },
];

const serviceCenterNav = [
    { name: "Dashboard", href: "/dashboard/service-center", icon: LayoutDashboard },
    { name: "Analytics", href: "/dashboard/service-center/analytics", icon: BarChart },
    { name: "Customer Feedback", href: "/dashboard/feedback", icon: Users },
];

const userNav = [
    { name: "My Vehicle", href: "/dashboard/user", icon: Car },
];

const commonNav = [
    { name: "Profile", href: "/dashboard/profile", icon: UserIcon },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
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
                    <Link href={item.href} className="w-full">
                      <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.name}>
                        <div className="flex items-center gap-2">
                          <item.icon />
                          <span>{item.name}</span>
                        </div>
                      </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
            ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator />
        <SidebarMenu>
           {commonNav.map((item) => (
                <SidebarMenuItem key={item.name}>
                    <Link href={item.href} className="w-full">
                      <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.name}>
                        <div className="flex items-center gap-2">
                          <item.icon />
                          <span>{item.name}</span>
                        </div>
                      </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
            ))}
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
