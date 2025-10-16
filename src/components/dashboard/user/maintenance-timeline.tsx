
"use client";

import * as React from "react";
import type { Vehicle } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, Star as StarIcon, IndianRupee } from "lucide-react";
import { format } from "date-fns";
import { serviceCenters } from "@/lib/data";
import { cn } from "@/lib/utils";

function StarRating({
  rating,
  onRate,
}: {
  rating: number;
  onRate: (rating: number) => void;
}) {
  const [hoverRating, setHoverRating] = React.useState(0);
  const safeRating = rating || 0;

  return (
    <div
      className="flex items-center"
      onMouseLeave={() => setHoverRating(0)}
    >
      {[...Array(5)].map((_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= (hoverRating || safeRating);

        return (
          <StarIcon
            key={i}
            className={cn(
              "w-4 h-4 cursor-pointer",
              isFilled
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            )}
            onMouseEnter={() => setHoverRating(starValue)}
            onClick={() => onRate(starValue)}
          />
        );
      })}
    </div>
  );
}


export function MaintenanceTimeline({ vehicle }: { vehicle: Vehicle }) {
  const [maintenanceHistory, setMaintenanceHistory] = React.useState(vehicle.maintenanceHistory);
  
  const getServiceCenterName = (id: string) => {
    return serviceCenters.find(sc => sc.id === id)?.name || 'Unknown Center';
  }
  
  const handleRate = (itemId: string, newRating: number) => {
    setMaintenanceHistory(prevHistory => 
      prevHistory.map(item => 
        item.id === itemId ? { ...item, rating: newRating } : item
      )
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Past Service History</CardTitle>
        <CardDescription>An interactive log of all service and maintenance for this vehicle.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Service Center</TableHead>
              <TableHead className="text-right">Cost</TableHead>
              <TableHead className="text-right">Rating</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {maintenanceHistory.map((item) => (
              <Collapsible key={item.id} asChild>
                <>
                  <TableRow>
                    <TableCell>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="w-9 p-0 data-[state=open]:rotate-180">
                           <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                           <span className="sr-only">Toggle details</span>
                        </Button>
                      </CollapsibleTrigger>
                    </TableCell>
                    <TableCell className="font-medium">{format(new Date(item.date), "dd MMM yyyy")}</TableCell>
                    <TableCell>{item.service}</TableCell>
                    <TableCell>{getServiceCenterName(item.serviceCenterId)}</TableCell>
                    <TableCell className="text-right font-mono flex items-center justify-end gap-1"><IndianRupee size={12}/>{(item.cost || 0).toLocaleString('en-IN')}</TableCell>
                    <TableCell className="text-right">
                        <StarRating rating={item.rating || 0} onRate={(newRating) => handleRate(item.id, newRating)} />
                    </TableCell>
                  </TableRow>
                  <CollapsibleContent asChild>
                      <TableRow>
                          <TableCell colSpan={6} className="p-0">
                              <div className="p-4 bg-muted/20">
                                 <p className="font-semibold">Service Notes:</p>
                                 <p className="text-sm text-muted-foreground">{item.notes}</p>
                                 <p className="text-xs text-muted-foreground mt-2">Mileage: {item.mileage.toLocaleString('en-IN')} km</p>
                                 <Button variant="outline" size="sm" className="mt-2">Rebook Similar Service</Button>
                              </div>
                          </TableCell>
                      </TableRow>
                  </CollapsibleContent>
                </>
              </Collapsible>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
