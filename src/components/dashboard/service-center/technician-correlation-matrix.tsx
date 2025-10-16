
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { technicianCorrelationMatrix } from "@/lib/data";
import { cn } from "@/lib/utils";

export function TechnicianCorrelationMatrix() {
  
  const getColor = (value: number) => {
    if (value === 1) return 'bg-muted';
    const intensity = Math.abs(value) * 100;
    if (value > 0) return `bg-blue-900/10 border-blue-500/20 text-blue-300`;
    return `bg-red-900/10 border-red-500/20 text-red-300`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Technician Efficiency Correlation Matrix</CardTitle>
        <CardDescription>
          Correlates skill, experience, and performance metrics.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Metric</TableHead>
              {technicianCorrelationMatrix.map(row => <TableHead key={row.metric} className="text-center">{row.metric}</TableHead>)}
            </TableRow>
          </TableHeader>
          <TableBody>
            {technicianCorrelationMatrix.map((row) => (
              <TableRow key={row.metric}>
                <TableCell className="font-medium">{row.metric}</TableCell>
                {Object.keys(row).filter(key => key !== 'metric').map(key => (
                  <TableCell key={key} className="text-center">
                    <div className={cn("p-2 rounded-md font-mono text-xs", getColor(row[key as keyof typeof row] as number))}>
                      {(row[key as keyof typeof row] as number).toFixed(2)}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <p className="text-xs text-muted-foreground mt-4">
          <span className="font-semibold">Insight:</span> Higher skill correlates strongly with shorter repair time (r=-0.82).
        </p>
      </CardContent>
    </Card>
  );
}
