
"use client"

import { useState, useEffect } from "react";
import type { Vehicle, PredictedAlert } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IndianRupee, Wrench, Package, PlusCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export function PredictiveCostEstimator({ vehicle }: { vehicle: Vehicle }) {
  const vehicleAlerts = vehicle.predictedAlerts || [];
  const [selectedAlertId, setSelectedAlertId] = useState<string | undefined>(vehicleAlerts[0]?.id);
  const [includeOptional, setIncludeOptional] = useState(true);

  // This effect ensures a default alert is selected when the component mounts or the vehicle changes.
  useEffect(() => {
    if (!selectedAlertId && vehicleAlerts.length > 0) {
      setSelectedAlertId(vehicleAlerts[0].id);
    } else if (vehicleAlerts.length > 0 && !vehicleAlerts.find(a => a.id === selectedAlertId)) {
      // If the currently selected alert is not in the new list, select the first one.
      setSelectedAlertId(vehicleAlerts[0].id);
    } else if (vehicleAlerts.length === 0) {
      setSelectedAlertId(undefined);
    }
  }, [vehicleAlerts, selectedAlertId]);


  const selectedAlert = vehicleAlerts.find(a => a.id === selectedAlertId);

  const chartData = selectedAlert ? [
    { name: 'Labor', cost: selectedAlert.laborCost },
    { name: 'Parts', cost: selectedAlert.parts.reduce((sum, part) => sum + part.cost, 0) },
    ...(includeOptional ? [{ name: 'Optional Checks', cost: 1500 }] : [])
  ] : [];

  const totalCost = chartData.reduce((sum, item) => sum + item.cost, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Predictive Cost Estimator</CardTitle>
        <CardDescription>Estimated cost for upcoming maintenance.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={selectedAlertId} onValueChange={setSelectedAlertId} disabled={vehicleAlerts.length === 0}>
          <SelectTrigger>
            <SelectValue placeholder="Select a predicted service" />
          </SelectTrigger>
          <SelectContent>
            {vehicleAlerts.map(alert => (
              <SelectItem key={alert.id} value={alert.id}>{alert.issue}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedAlert ? (
          <div className="space-y-4">
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 30 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={80} />
                  <Tooltip
                    cursor={{ fill: 'hsl(var(--muted))' }}
                    content={({ payload }) => {
                        if (payload && payload.length > 0) {
                            return (
                                <div className="bg-background p-2 border rounded-lg shadow-sm">
                                    <p className="text-sm">{`${payload[0].payload.name}: ₹${payload[0].value?.toLocaleString('en-IN')}`}</p>
                                </div>
                            )
                        }
                        return null;
                    }}
                  />
                  <Bar dataKey="cost" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2"><Wrench /> Labor</span>
                <span>₹{selectedAlert.laborCost.toLocaleString('en-IN')}</span>
              </div>
              {selectedAlert.parts.map(part => (
                 <div key={part.name} className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-2 pl-4"><Package size={16} /> {part.name}</span>
                    <span>₹{part.cost.toLocaleString('en-IN')}</span>
                 </div>
              ))}
               <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Checkbox 
                            id="optional-checks" 
                            checked={includeOptional}
                            onCheckedChange={(checked) => setIncludeOptional(Boolean(checked))}
                        />
                        <label htmlFor="optional-checks" className="text-muted-foreground flex items-center gap-2">
                           <PlusCircle /> Optional Checks
                        </label>
                    </div>
                    <span>{includeOptional ? `₹1,500` : `₹0`}</span>
                </div>
            </div>

            <div className="flex items-center justify-between font-bold text-lg border-t pt-2">
              <span>Total Estimated Cost</span>
              <span className="flex items-center"><IndianRupee size={18} className="mr-1"/>{totalCost.toLocaleString('en-IN')}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
            No service estimates available for this vehicle.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
