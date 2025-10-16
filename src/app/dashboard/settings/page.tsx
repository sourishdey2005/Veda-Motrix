"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Manage your account and application preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Appearance</h3>
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <Label htmlFor="dark-mode" className="text-base">Dark Mode</Label>
                        <p className="text-sm text-muted-foreground">
                            Enable or disable the dark theme for the application.
                        </p>
                    </div>
                    <Switch id="dark-mode" disabled />
                </div>
            </div>

            <Separator />

            <div className="space-y-4">
                 <h3 className="text-lg font-medium">Account</h3>
                <div className="space-y-2">
                    <Label htmlFor="new-password">Change Password</Label>
                    <div className="flex gap-2">
                       <p className="text-sm text-muted-foreground flex-grow">Password can be changed here.</p>
                       <Button variant="outline" disabled>Change Password</Button>
                    </div>
                </div>
            </div>

        </CardContent>
      </Card>
    </div>
  );
}
