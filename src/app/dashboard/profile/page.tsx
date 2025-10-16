"use client";

import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { VedaMotrixLogo } from "@/components/icons";

export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading || !user) {
    return (
      <div className="flex h-[calc(100vh-10rem)] w-full items-center justify-center">
        <VedaMotrixLogo className="h-16 w-16 animate-pulse" />
      </div>
    );
  }

  const userInitials = user.name.split(' ').map(n => n[0]).join('');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
          <CardDescription>View and manage your personal information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                    <AvatarImage src={user.avatarUrl} alt={`@${user.name}`} />
                    <AvatarFallback className="text-3xl">{userInitials}</AvatarFallback>
                </Avatar>
                <Button variant="outline">Change Avatar</Button>
            </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue={user.name} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={user.email} disabled />
            </div>
          </div>
           <Button disabled>Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
