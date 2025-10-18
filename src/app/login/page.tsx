
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { LoginForm } from '@/components/login-form';
import { VedaMotrixLogo } from '@/components/icons';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { DemoCredentialCard } from '@/components/credential-card';
import type { User } from '@/lib/types';
import { RoleSelector } from '@/components/role-selector';

export default function UnifiedLoginPage() {
  const loginBg = PlaceHolderImages.find(img => img.id === 'login-bg');
  const [selectedRole, setSelectedRole] = useState<User['role'] | null>(null);

  const handleRoleSelect = (role: User['role']) => {
    setSelectedRole(role);
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-full max-w-[400px] gap-6 px-4">
          <div className="grid gap-2 text-center">
            <VedaMotrixLogo className="h-12 w-12 mx-auto text-primary" />
            <h1 className="text-3xl font-bold">VEDA-MOTRIX AI</h1>
            <p className="text-balance text-muted-foreground">
              {selectedRole 
                ? `Knowledge in Motion - ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1).replace('-', ' ')} Login`
                : 'Knowledge in Motion'}
            </p>
          </div>
          
          <RoleSelector onRoleSelect={handleRoleSelect} selectedRole={selectedRole} />
          
          {selectedRole && <LoginForm userType={selectedRole} />}

        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        {loginBg && (
          <Image
            src={loginBg.imageUrl}
            alt="Abstract AI background"
            width="1920"
            height="1080"
            data-ai-hint={loginBg.imageHint}
            className="h-full w-full object-cover opacity-10"
          />
        )}
      </div>
      <div className="fixed top-6 right-6 z-10 hidden lg:block">
          <DemoCredentialCard />
      </div>
    </div>
  );
}
