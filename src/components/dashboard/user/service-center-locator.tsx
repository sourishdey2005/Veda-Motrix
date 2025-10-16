
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { serviceCenters } from "@/lib/data";
import { Star } from "lucide-react";
import Image from "next/image";

export function ServiceCenterLocator() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nearby Service Centers</CardTitle>
        <CardDescription>Find and review top-rated service centers in your area.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {serviceCenters.slice(0, 3).map(center => (
            <div key={center.id} className="p-3 bg-muted/50 rounded-lg flex justify-between items-center">
              <div>
                <p className="font-semibold text-sm">{center.name}</p>
                <p className="text-xs text-muted-foreground">{center.city}</p>
              </div>
              <div className="flex items-center gap-1 text-sm font-medium">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span>{center.rating.toFixed(1)}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

    