"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ShieldAlert, ShieldCheck } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useEffect, useState } from "react"
import { detectAgentAnomalies, DetectAgentAnomaliesOutput } from "@/ai/flows/detect-agent-anomalies"

// Sample agent actions to simulate activity
const agentActionsLog = [
    { agentId: 'Data Analysis Agent', action: 'Accessed V1005 sensor data', anomalyThreshold: 0.8 },
    { agentId: 'Diagnosis Agent', action: 'Predicted failure for V1005', anomalyThreshold: 0.8 },
    { agentId: 'Scheduling Agent', action: 'Accessed all user calendars', anomalyThreshold: 0.8 },
    { agentId: 'Customer Engagement Agent', action: 'Initiated contact with owner of V1005', anomalyThreshold: 0.8 },
    { agentId: 'UEBA Security Agent', action: 'Flagged anomalous behavior from Scheduling Agent', anomalyThreshold: 0.8 },
    { agentId: 'Manufacturing Insights Agent', action: 'Queried service data from last 90 days', anomalyThreshold: 0.8 },
    { agentId: 'Data Analysis Agent', action: 'Bulk export of all vehicle data', anomalyThreshold: 0.8 },
    { agentId: 'Feedback Agent', action: 'Analyzed 500 new feedback entries', anomalyThreshold: 0.8 },
    { agentId: 'Scheduling Agent', action: 'Accessed V1002 calendar', anomalyThreshold: 0.8 },
];

type UebaEvent = DetectAgentAnomaliesOutput & {
  id: string;
  agentId: string;
  action: string;
  timestamp: string;
};

export function UebaView() {
  const [uebaEvents, setUebaEvents] = useState<UebaEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const analyzeActions = async () => {
      setLoading(true);
      const analyzedEvents: UebaEvent[] = [];
      for (const [index, log] of agentActionsLog.entries()) {
        try {
          const result = await detectAgentAnomalies({
            agentId: log.agentId,
            agentActions: [log.action],
            anomalyThreshold: log.anomalyThreshold
          });
          analyzedEvents.push({
            ...result,
            id: `UEBA${index + 1}`,
            agentId: log.agentId,
            action: log.action,
            timestamp: new Date(Date.now() - 1000 * 60 * (agentActionsLog.length - index)).toISOString()
          });
        } catch (error) {
          console.error("Failed to analyze agent action:", error);
        }
      }
      setUebaEvents(analyzedEvents.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
      setLoading(false);
    };

    analyzeActions();

    const interval = setInterval(analyzeActions, 30000); // Re-analyze every 30 seconds
    return () => clearInterval(interval);
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
                Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell colSpan={5} className="text-center p-4">Loading events...</TableCell>
                    </TableRow>
                ))
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
