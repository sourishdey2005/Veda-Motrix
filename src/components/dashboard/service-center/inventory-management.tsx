"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { inventoryData, partConsumptionTrends } from "@/lib/data";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, LabelList } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig = {
  change: { label: "% Change", color: "hsl(var(--chart-2))" },
};

export function InventoryManagement() {
  const [parts, setParts] = useState(inventoryData);
  const [selectedPart, setSelectedPart] = useState<typeof parts[0] | null>(null);

  const getStockStatus = (part: typeof parts[0]) => {
    if (part.inStock < part.reorderLevel) return "low";
    if (part.inStock < part.reorderLevel * 1.5) return "moderate";
    return "healthy";
  };

  const statusStyles = {
    low: "bg-red-500/10 text-red-400 border-red-500/20",
    moderate: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    healthy: "bg-green-500/10 text-green-400 border-green-500/20",
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Parts & Inventory Management</CardTitle>
          <CardDescription>Track spare-part usage and predicted stock levels.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Part Name</TableHead>
                <TableHead>In Stock</TableHead>
                <TableHead>Avg Use/Wk</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parts.map((part) => {
                const status = getStockStatus(part);
                return (
                  <TableRow key={part.id}>
                    <TableCell className="font-medium">{part.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("font-mono", statusStyles[status])}>
                        {part.inStock}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono">{part.avgUsePerWeek}</TableCell>
                    <TableCell className="text-right">
                       <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedPart(part)}>
                                    Request Restock
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Restock Request Sent</DialogTitle>
                                    <DialogDescription>
                                        A restock request for {selectedPart?.name} has been sent to procurement.
                                    </DialogDescription>
                                </DialogHeader>
                                 <DialogClose asChild>
                                    <Button type="button" variant="secondary">
                                      Close
                                    </Button>
                                  </DialogClose>
                            </DialogContent>
                        </Dialog>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
            <CardTitle>Part Consumption Trends</CardTitle>
            <CardDescription>Weekly change in usage for key parts.</CardDescription>
        </CardHeader>
        <CardContent>
             <ChartContainer config={chartConfig} className="h-48">
                <BarChart data={partConsumptionTrends} layout="vertical" margin={{left: 30}}>
                    <YAxis dataKey="part" type="category" tickLine={false} axisLine={false} tickMargin={5} width={80} />
                    <XAxis type="number" hide />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="change" radius={4}>
                         <LabelList
                            dataKey="change"
                            position="right"
                            offset={8}
                            className="fill-foreground text-sm"
                            formatter={(value: number) => `${value > 0 ? '+' : ''}${value}%`}
                        />
                    </Bar>
                </BarChart>
             </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
