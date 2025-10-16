
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { partReliabilityData, PartReliabilityData } from '@/lib/data';
import { cn } from '@/lib/utils';
import { TrendingDown, TrendingUp } from 'lucide-react';

export function PartReliabilityIndex() {
  const [data, setData] = useState<PartReliabilityData[]>(partReliabilityData);

  const memoizedUpdater = useCallback(() => {
    setData(prevData => {
      const newData = prevData.map(item => ({
        ...item,
        score: Math.min(100, Math.max(0, item.score + (Math.random() - 0.5) * 3)),
      }));
      return newData.sort((a,b) => a.score - b.score);
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(memoizedUpdater, 3500);
    return () => clearInterval(interval);
  }, [memoizedUpdater]);

  const getScoreColor = (score: number) => {
    if (score > 85) return "bg-green-500/20 text-green-300";
    if (score > 60) return "bg-yellow-500/20 text-yellow-300";
    return "bg-red-500/20 text-red-300";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Part Reliability Index (PRI)</CardTitle>
        <CardDescription>Weighted score of failure rate, cost, and impact. Lower is worse.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Part Name</TableHead>
              <TableHead className="text-right">Score</TableHead>
              <TableHead className="text-right">Failure Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map(item => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.partName}</TableCell>
                <TableCell className="text-right">
                    <Badge variant="outline" className={cn("font-mono", getScoreColor(item.score))}>
                        {item.score.toFixed(0)}
                    </Badge>
                </TableCell>
                <TableCell className="text-right font-mono flex items-center justify-end gap-1">
                    {item.failureRate.toFixed(1)}%
                    {item.failureRate > 2.0 ? <TrendingUp className="w-4 h-4 text-red-400" /> : <TrendingDown className="w-4 h-4 text-green-400" />}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
         <p className="text-xs text-muted-foreground mt-4">
            <span className="font-semibold">Insight:</span> The water pump has the lowest reliability score, making it a key area for quality investigation.
        </p>
      </CardContent>
    </Card>
  );
}
