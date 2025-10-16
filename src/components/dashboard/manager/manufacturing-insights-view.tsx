"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { capaRcaEntries } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Check, ThumbsDown, ThumbsUp, X } from "lucide-react"

export function ManufacturingInsightsView() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>RCA/CAPA Manufacturing Insights</CardTitle>
        <CardDescription>
          Improvement suggestions generated from service data analysis.
        </CardDescription>
      </CardHeader>
      <CardContent>
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
            {capaRcaEntries.map((entry) => (
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
                            <Button variant="outline" size="icon" className="h-8 w-8 text-green-500 hover:text-green-500">
                                <ThumbsUp className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-8 w-8 text-red-500 hover:text-red-500">
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
