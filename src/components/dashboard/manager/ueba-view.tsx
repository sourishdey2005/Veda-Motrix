"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShieldAlert, ShieldCheck, Activity, Bot, Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useEffect, useState } from "react"
import { uebaEvents as mockUebaEvents } from "@/lib/data";
import type { UebaEvent } from "@/lib/types";

export function UebaView() {
  const [uebaEvents, setUebaEvents] = useState<UebaEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const loadEvents = () => {
      setLoading(true);
      const sortedEvents = [...mockUebaEvents].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setUebaEvents(sortedEvents);
      setLoading(false);
    };

    loadEvents();
  }, []);

  const handleAnalyzeAction = async () => {
    setIsAnalyzing(true);
    // This is a mock analysis since we are using dummy data
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newEvent: UebaEvent = {
        id: `UEBA${uebaEvents.length + 1}`,
        agentId: 'Scheduling Agent',
        action: 'Attempted to access billing info',
        timestamp: new Date().toISOString(),
        anomalyScore: 0.85,
        isAnomalous: true,
        explanation: 'Unauthorized attempt to access sensitive financial data outside of typical agent behavior.',
      };

    setUebaEvents(prev => [newEvent, ...prev]);
    setIsAnalyzing(false);
  }

  const anomaliesCount = uebaEvents.filter(e => e.isAnomalous).length;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events Scanned</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uebaEvents.length}</div>
            <p className="text-xs text-muted-foreground">Total events analyzed by the agent.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Anomalies Detected</CardTitle>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{anomaliesCount}</div>
            <p className="text-xs text-muted-foreground">Potentially malicious activities flagged.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Live Analysis</CardTitle>
          </CardHeader>
          <CardContent>
             <Button onClick={handleAnalyzeAction} disabled={isAnalyzing} className="w-full">
              {isAnalyzing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Bot className="mr-2 h-4 w-4" />
              )}
              Analyze Test Action
            </Button>
            <p className="text-xs text-muted-foreground mt-2">Trigger a random agent action for analysis.</p>
          </CardContent>
        </Card>
      </div>

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
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead>Agent ID</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Explanation</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead className="text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                  <TableRow>
                      <TableCell colSpan={6} className="text-center p-4">
                        <div className="flex items-center justify-center">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading events...
                        </div>
                      </TableCell>
                  </TableRow>
              ) : (
                  uebaEvents.map((event) => (
                  <TableRow key={event.id} className={event.isAnomalous ? "bg-destructive/10 hover:bg-destructive/20" : ""}>
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
                      <TableCell className="text-muted-foreground text-xs max-w-sm">{event.explanation || 'N/A'}</TableCell>
                      <TableCell>{event.anomalyScore && formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}</TableCell>
                      <TableCell className="text-right font-mono">{event.anomalyScore?.toFixed(2)}</TableCell>
                  </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
