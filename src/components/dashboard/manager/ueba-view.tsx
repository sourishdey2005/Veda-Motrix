"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { uebaEvents } from "@/lib/data"
import { ShieldAlert, ShieldCheck } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export function UebaView() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>UEBA Security Monitoring</CardTitle>
        <CardDescription>
          Monitoring for unauthorized or abnormal agent behavior.
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
            {uebaEvents.map((event) => (
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
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
