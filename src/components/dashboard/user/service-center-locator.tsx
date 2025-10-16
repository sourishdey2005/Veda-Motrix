
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { serviceCenters } from "@/lib/data";
import { Star } from "lucide-react";
import Image from "next/image";

export function ServiceCenterLocator() {
  // This is a static placeholder for a map component.
  // In a real app, you would integrate a library like Leaflet or Google Maps.
  const mapPlaceholder = "https://picsum.photos/seed/citymap/800/600";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Center Locator</CardTitle>
        <CardDescription>Find and review nearby service centers.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative h-64 w-full rounded-lg overflow-hidden border">
           <Image
                src={mapPlaceholder}
                alt="Map of service centers"
                fill
                className="object-cover"
                data-ai-hint="city map"
           />
           {serviceCenters.map((center, index) => (
               <div
                    key={center.id}
                    className="absolute p-1 bg-background rounded-full shadow-lg"
                    style={{ 
                        top: `${20 + index * 15}%`, 
                        left: `${15 + index * 18}%`
                    }}
                >
                    <div className="w-5 h-5 bg-primary rounded-full border-2 border-background"></div>
                </div>
           ))}
        </div>
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
