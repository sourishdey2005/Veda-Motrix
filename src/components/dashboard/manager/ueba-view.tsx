"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ShieldAlert, ShieldCheck } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useEffect, useState } from "react"
import { uebaEvents as mockUebaEvents } from "@/lib/data";
import type { UebaEvent } from "@/lib/types";


export function UebaView() {
  const [uebaEvents, setUebaEvents] = useState<UebaEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = () => {
      setLoading(true);
      // Sort mock events by timestamp
      const sortedEvents = [...mockUebaEvents].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setUebaEvents(sortedEvents);
      setLoading(false);
    };

    loadEvents();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>UEBA Security Monitoring</CardTitle>
        <CardDescription>
          Live monitoring for unauthorized or abnormal agent behavior.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Agent ID</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead className="text-right">Anomaly Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
                <TableRow>
                    <TableCell colSpan={5} className="text-center p-4">Loading events...</TableCell>
                </TableRow>
            ) : (
                uebaEvents.map((event) => (
                <TableRow key={event.id} className={event.isAnomalous ? "bg-destructive/10" : ""}>
                    <TableCell>
                    {event.isAnomalous ? (
                        <Badge variant="destructive" className="gap-1 items-center">
                        <ShieldAlert className="h-3 w-3" /> Anomaly
                        </Badge>
                    ) : (
                        <Badge variant="secondary" className="text-muted-foreground gap-1 items-center">
                        <ShieldCheck className="h-3 w-3 text-green-500" /> Normal
                        </Badge>
                    )}
                    </TableCell>
                    <TableCell className="font-medium">{event.agentId}</TableCell>
                    <TableCell>{event.action}</TableCell>
                    <TableCell>{formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}</TableCell>
                    <TableCell className="text-right font-mono">{event.anomalyScore.toFixed(2)}</TableCell>
                </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
