"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { VedaMotrixLogo } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const { user, loading, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const { toast } = useToast();

  if (loading || !user) {
    return (
      <div className="flex h-[calc(100vh-10rem)] w-full items-center justify-center">
        <VedaMotrixLogo className="h-16 w-16 animate-pulse" />
      </div>
    );
  }

  const userInitials = user.name.split(' ').map(n => n[0]).join('');

  const handleSave = () => {
    if (name && name !== user.name) {
      updateUser({ name });
      toast({
        title: "Profile Updated",
        description: "Your name has been successfully updated.",
      })
    }
  };

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
                <Button variant="outline" disabled>Change Avatar</Button>
            </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={user.email} disabled />
            </div>
          </div>
           <Button onClick={handleSave} disabled={name === user.name}>Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
