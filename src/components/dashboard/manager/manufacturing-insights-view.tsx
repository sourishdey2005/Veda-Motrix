"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, ThumbsDown, ThumbsUp, Wand2 } from "lucide-react"
import { useState } from "react"
import { capaRcaEntries as initialEntries } from "@/lib/data"
import { Textarea } from "@/components/ui/textarea"

type CapaRcaEntry = {
  id: string;
  component: string;
  issuePattern: string;
  suggestion: string;
  status: 'Pending' | 'Approved' | 'Rejected';
};

export function ManufacturingInsightsView() {
  const [entries, setEntries] = useState<CapaRcaEntry[]>(initialEntries);
  const [loading, setLoading] = useState(false);
  const [serviceData, setServiceData] = useState(
    'Recent service reports indicate a trend of premature wear on transmission gaskets for M3 models, leading to leaks. Also, multiple reports of fuel injector clogging in Model Y under 20k miles.'
  );

  const handleGenerate = async () => {
    setLoading(true);
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newEntry: CapaRcaEntry = {
      id: `C${entries.length + 1}`,
      component: "AI Generated",
      issuePattern: "Based on provided service data.",
      suggestion: "Consider using a more durable gasket material for high-torque applications and investigate fuel additives to reduce injector deposits.",
      status: 'Pending'
    };
    setEntries(prev => [newEntry, ...prev]);
    setLoading(false);
  }

  const handleStatusChange = (id: string, status: 'Approved' | 'Rejected') => {
    setEntries(entries.map(entry => entry.id === id ? { ...entry, status } : entry));
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>RCA/CAPA Manufacturing Insights</CardTitle>
        <CardDescription>
          Generate and review improvement suggestions from service data.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Textarea
            value={serviceData}
            onChange={(e) => setServiceData(e.target.value)}
            placeholder="Enter service data here..."
            rows={4}
            className="mb-2"
          />
          <Button onClick={handleGenerate} disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Generate Suggestions
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Component</TableHead>
              <TableHead>Issue Pattern</TableHead>
              <TableHead>Suggestion</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="font-medium">{entry.component}</TableCell>
                <TableCell>{entry.issuePattern}</TableCell>
                <TableCell>{entry.suggestion}</TableCell>
                <TableCell>
                  <Badge variant={
                    entry.status === 'Approved' ? 'default' : entry.status === 'Rejected' ? 'destructive' : 'secondary'
                  } className={entry.status === 'Approved' ? 'bg-green-600' : ''}>
                    {entry.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                    {entry.status === 'Pending' && (
                        <div className="flex gap-2 justify-end">
                            <Button variant="outline" size="icon" className="h-8 w-8 text-green-500 hover:text-green-500" onClick={() => handleStatusChange(entry.id, 'Approved')}>
                                <ThumbsUp className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-8 w-8 text-red-500 hover:text-red-500" onClick={() => handleStatusChange(entry.id, 'Rejected')}>
                                <ThumbsDown className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
