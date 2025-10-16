"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { User } from '@/lib/types';

const credentials = {
  manager: {
    email: 'manager@vedamotrix.ai',
    password: 'VEDA@123',
  },
  'service-center': {
    email: 'service@vedamotrix.ai',
    password: 'SERVICE@123',
  },
  user: {
    email: 'rohan.joshi@email.com',
    password: 'password123',
  }
};

export function LoginForm({ userType }: { userType: User['role'] }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (credentials[userType]) {
      setEmail(credentials[userType].email);
      setPassword(credentials[userType].password);
    }
  }, [userType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await login(email, password);
    if (!success) {
      toast({
        title: 'Login Failed',
        description: 'Invalid email or password. Please try again.',
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };

  const isHardcoded = userType === 'manager' || userType === 'service-center';

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading || isHardcoded}
            readOnly={isHardcoded}
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input 
            id="password" 
            type="password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading || isHardcoded}
            readOnly={isHardcoded}
            placeholder='Your password'
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Login
        </Button>
      </div>
      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="underline">
          Sign up
        </Link>
      </div>
       <div className="mt-4 text-center text-sm space-x-2">
         <Link href="/login/user" className="underline">User Login</Link>
         <span>|</span>
         <Link href="/login/manager" className="underline">Manager Login</Link>
         <span>|</span>
         <Link href="/login/service-center" className="underline">Service Center Login</Link>
      </div>
    </form>
  );
}
