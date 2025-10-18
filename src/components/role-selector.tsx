
"use client";

import { useState } from 'react';
import type { User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Briefcase, Building, User as UserIcon, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

type Role = User['role'];

const roles: { role: Role; name: string; description: string; icon: React.ElementType }[] = [
  { role: 'manager', name: 'Manager', description: 'Oversee fleet health and business analytics.', icon: Briefcase },
  { role: 'service-center', name: 'Service Center', description: 'Manage appointments and workshop operations.', icon: Building },
  { role: 'user', name: 'Vehicle Owner', description: 'Monitor your personal vehicle health.', icon: UserIcon },
];

export function RoleSelector({ onRoleSelect, selectedRole }: { onRoleSelect: (role: Role) => void, selectedRole: Role | null }) {
  const [open, setOpen] = useState(!selectedRole);

  const handleSelect = (role: Role) => {
    onRoleSelect(role);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
            {selectedRole ? `Logged in as: ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}` : 'Select Your Role'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Your Role</DialogTitle>
          <DialogDescription>
            Choose the capacity in which you are logging in.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 pt-4">
            {roles.map(({ role, name, description, icon: Icon }) => (
                <button
                    key={role}
                    onClick={() => handleSelect(role)}
                    className={cn(
                        "w-full text-left p-4 rounded-lg border flex items-center gap-4 transition-all",
                        selectedRole === role 
                            ? "border-primary ring-2 ring-primary bg-primary/10" 
                            : "hover:bg-muted/50"
                    )}
                >
                    <Icon className={cn("w-8 h-8 flex-shrink-0", selectedRole === role ? "text-primary" : "text-muted-foreground")} />
                    <div className="flex-1">
                        <p className="font-semibold">{name}</p>
                        <p className="text-xs text-muted-foreground">{description}</p>
                    </div>
                    {selectedRole === role && <Check className="w-5 h-5 text-primary" />}
                </button>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
