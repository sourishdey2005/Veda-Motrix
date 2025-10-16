
"use client";

import type { Vehicle } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Feather, Leaf, Shield, TrendingUp } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList } from "recharts";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const chartConfig = {
  efficiency: { label: "Efficiency (km/L)", color: "hsl(var(--chart-2))" },
};

const badgeIcons: { [key: string]: React.ElementType } = {
  leaf: Leaf,
  feather: Feather,
  award: Award,
  shield: Shield,
};

export function EnvironmentalImpact({ vehicle }: { vehicle: Vehicle }) {
  const { environmentalData } = vehicle;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Environmental & Usage Impact</CardTitle>
        <CardDescription>How your driving habits and our maintenance affect your footprint.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold mb-2">Fuel Efficiency Trend (km/L)</h4>
          <ChartContainer config={chartConfig} className="h-64">
            <BarChart data={environmentalData.fuelEfficiencyTrend}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="efficiency" fill="var(--color-efficiency)" radius={4}>
                 <LabelList position="top" offset={5} className="fill-foreground text-xs" />
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
        <div className="space-y-4">
            <div>
                <h4 className="font-semibold">Carbon Footprint</h4>
                <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-3xl font-bold">{environmentalData.carbonFootprint.current.toFixed(0)}</p>
                    <p className="text-sm text-muted-foreground">g CO₂/km</p>
                </div>
                <p className="text-sm text-green-500 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    {environmentalData.carbonFootprint.reduction.toFixed(0)} g/km reduction via proactive maintenance
                </p>
            </div>
            <div>
                 <h4 className="font-semibold">Eco-Driving Badges</h4>
                 <TooltipProvider>
                    <div className="flex gap-3 mt-2">
                        {environmentalData.ecoBadges.map(badge => {
                            const Icon = badgeIcons[badge.icon];
                            return (
                                <Tooltip key={badge.id}>
                                    <TooltipTrigger asChild>
                                        <div className={cn(
                                            "flex flex-col items-center gap-1 p-3 rounded-lg border w-24 h-24 justify-center transition-all",
                                            badge.earned ? 'bg-green-500/10 border-green-500/50 text-green-300' : 'bg-muted/50 text-muted-foreground opacity-60'
                                        )}>
                                            {Icon && <Icon className="w-8 h-8" />}
                                            <p className="text-xs text-center font-medium">{badge.name}</p>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{badge.description}</p>
                                    </TooltipContent>
                                </Tooltip>
                            )
                        })}
                    </div>
                 </TooltipProvider>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
