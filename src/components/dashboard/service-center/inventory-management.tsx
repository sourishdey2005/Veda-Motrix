"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { inventoryData, partConsumptionTrends, type InventoryPart } from "@/lib/data";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, LabelList } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const chartConfig = {
  change: { label: "% Change", color: "hsl(var(--chart-2))" },
};

export function InventoryManagement() {
  const [parts, setParts] = useState<InventoryPart[]>(inventoryData);
  const [selectedPart, setSelectedPart] = useState<InventoryPart | null>(null);
  const [restockQuantity, setRestockQuantity] = useState<number>(50);
  const [isRequesting, setIsRequesting] = useState(false);
  const { toast } = useToast();

  const getStockStatus = (part: InventoryPart) => {
    if (part.inStock < part.reorderLevel) return "low";
    if (part.inStock < part.reorderLevel * 1.5) return "moderate";
    return "healthy";
  };

  const statusStyles = {
    low: "bg-red-500/10 text-red-400 border-red-500/20",
    moderate: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    healthy: "bg-green-500/10 text-green-400 border-green-500/20",
  };
  
  const handleOpenDialog = (part: InventoryPart) => {
    setSelectedPart(part);
    setRestockQuantity(Math.max(50, part.reorderLevel * 2 - part.inStock));
  }
  
  const handleRequestSubmit = () => {
    if (!selectedPart || !restockQuantity || restockQuantity <= 0) {
      toast({ title: "Invalid Quantity", description: "Please enter a valid quantity to restock.", variant: "destructive" });
      return;
    }
    
    setIsRequesting(true);
    // Simulate API call
    setTimeout(() => {
       setParts(prevParts => 
         prevParts.map(p => p.id === selectedPart.id ? { ...p, requestedAmount: restockQuantity } : p)
       );
       toast({
        title: "Restock Request Sent",
        description: `Request for ${restockQuantity} units of ${selectedPart.name} has been sent.`,
      });
      setIsRequesting(false);
      setSelectedPart(null); // This will close the dialog via the `open` prop
    }, 1000);
  }

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
                <TableHead>Requested</TableHead>
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
                    <TableCell className="font-mono">{part.requestedAmount || '—'}</TableCell>
                    <TableCell className="text-right">
                       <Button variant="outline" size="sm" onClick={() => handleOpenDialog(part)}>
                            Request Restock
                       </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog open={!!selectedPart} onOpenChange={(isOpen) => !isOpen && setSelectedPart(null)}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Request Restock for {selectedPart?.name}</DialogTitle>
                <DialogDescription>
                    Specify the quantity you want to order. Current stock: {selectedPart?.inStock}.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="quantity" className="text-right">
                        Quantity
                    </Label>
                    <Input
                        id="quantity"
                        type="number"
                        value={restockQuantity}
                        onChange={(e) => setRestockQuantity(Number(e.target.value))}
                        className="col-span-3"
                        min="1"
                    />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary" disabled={isRequesting}>
                        Cancel
                    </Button>
                </DialogClose>
                <Button onClick={handleRequestSubmit} disabled={isRequesting}>
                    {isRequesting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Submit Request
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
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
