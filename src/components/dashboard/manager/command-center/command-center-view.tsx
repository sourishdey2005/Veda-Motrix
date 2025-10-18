
"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { serviceCenters as initialServiceCenters } from '@/lib/data';
import type { ServiceCenter } from '@/lib/types';
import { Globe, Users, Clock, Star, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Helper to get a random position on the map
const getRandomPosition = () => ({
  top: `${10 + Math.random() * 80}%`,
  left: `${10 + Math.random() * 80}%`,
});

export function CommandCenterView() {
  const [serviceCenters, setServiceCenters] = useState<ServiceCenter[]>(() => 
    initialServiceCenters.map(sc => ({ ...sc, position: getRandomPosition() }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setServiceCenters(prevCenters =>
        prevCenters.map(center => ({
          ...center,
          workload: Math.min(100, Math.max(20, (center.workload || 50) + (Math.random() - 0.5) * 10)),
          rating: Math.min(5, Math.max(3.5, center.rating + (Math.random() - 0.5) * 0.2)),
          delayIndex: Math.min(2, Math.max(0.8, (center.delayIndex || 1) + (Math.random() - 0.5) * 0.1)),
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (workload: number, delayIndex: number) => {
    if (workload > 90 || delayIndex > 1.5) return 'hsl(var(--destructive))';
    if (workload > 75 || delayIndex > 1.2) return 'hsl(var(--chart-4))';
    return 'hsl(var(--chart-2))';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
            <Globe className="w-6 h-6 text-primary" />
            Intelligent Multi-Center Command Console
        </CardTitle>
        <CardDescription>
          Centralized, real-time map of all service centers. Click a node to drill down into its live dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="relative h-[60vh] w-full rounded-lg bg-muted border overflow-hidden">
            {/* Background grid */}
            <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>

            {serviceCenters.map((center, i) =>
              serviceCenters.slice(i + 1).map(otherCenter => (
                <svg key={`${center.id}-${otherCenter.id}`} className="absolute inset-0 w-full h-full pointer-events-none">
                  <line
                    x1={center.position?.left}
                    y1={center.position?.top}
                    x2={otherCenter.position?.left}
                    y2={otherCenter.position?.top}
                    className="stroke-border"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                </svg>
              ))
            )}

            {serviceCenters.map(center => {
              const workload = center.workload || 0;
              const delayIndex = center.delayIndex || 1;
              const color = getStatusColor(workload, delayIndex);

              return (
                <Tooltip key={center.id}>
                  <TooltipTrigger asChild>
                    <Link
                        href="/dashboard/service-center/analytics"
                        className="absolute flex items-center justify-center w-24 h-24 rounded-full transition-all duration-500 hover:scale-110 focus:scale-110 focus:outline-none focus:ring-2 focus:ring-primary"
                        style={{ top: center.position?.top, left: center.position?.left, transform: 'translate(-50%, -50%)' }}
                        >
                        <div className="absolute inset-0 rounded-full animate-ping" style={{ backgroundColor: color, opacity: 0.2 }}></div>
                        <div className="relative flex flex-col items-center justify-center w-full h-full bg-background border-2 rounded-full" style={{ borderColor: color }}>
                            <p className="text-xs font-bold truncate px-2">{center.name}</p>
                            <p className="text-[10px] text-muted-foreground">{center.city}</p>
                        </div>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="w-48 p-2">
                      <p className="font-bold text-base mb-2">{center.name}</p>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-1 text-muted-foreground"><Users className="w-3 h-3" /> Workload:</span>
                          <span className={cn("font-semibold", workload > 85 ? "text-destructive" : "text-foreground")}>{workload.toFixed(0)}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-1 text-muted-foreground"><Clock className="w-3 h-3" /> Delay Index:</span>
                          <span className={cn("font-semibold", delayIndex > 1.3 ? "text-destructive" : "text-foreground")}>{delayIndex.toFixed(1)}x</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-1 text-muted-foreground"><Star className="w-3 h-3" /> Rating:</span>
                          <span className="font-semibold">{center.rating.toFixed(1)}/5.0</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-end text-xs text-primary mt-2">
                        Click to drill down <ArrowRight className="w-3 h-3 ml-1" />
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}

// Add this to your globals.css or a style tag if needed
const bgGridPattern = `
.bg-grid-pattern {
    background-image:
        linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
        linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px);
    background-size: 2rem 2rem;
}
`;
// Note: You might need to inject this CSS. For this example, I'm assuming it can be added to globals.css
// or handled by a pre-existing setup. For this response, I'll add a style tag.
const StyleInjector = () => <style>{bgGridPattern}</style>;
CommandCenterView.StyleInjector = StyleInjector;
