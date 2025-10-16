
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { rootCauseData } from "@/lib/data";
import { cn } from "@/lib/utils";

export function RootCauseHeatmap() {
    
    const maxScore = Math.max(...rootCauseData.map(d => d.frequency * d.recurrence));

    return (
        <Card>
            <CardHeader>
                <CardTitle>Root Cause Frequency vs. Recurrence Heatmap</CardTitle>
                <CardDescription>
                    Identifies fault types that are both common and likely to recur.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-4 gap-2 text-center">
                    {rootCauseData.map(item => {
                        const score = item.frequency * item.recurrence;
                        const opacity = score / maxScore;
                        return (
                            <div key={item.faultType} className="p-4 rounded-lg border flex flex-col justify-center" style={{ backgroundColor: `hsl(var(--primary) / ${opacity})`}}>
                                <p className="font-bold text-sm text-primary-foreground" style={{ textShadow: '0 0 5px hsla(var(--background), 0.7)' }}>{item.faultType}</p>
                                <p className="text-xs text-primary-foreground/80" style={{ textShadow: '0 0 5px hsla(var(--background), 0.7)' }}>Score: {score.toFixed(1)}</p>
                            </div>
                        )
                    })}
                </div>
                 <p className="text-xs text-muted-foreground mt-4">
                    <span className="font-semibold">Insight:</span> Brake system faults recur more often than other issues — possible design defect.
                 </p>
            </CardContent>
        </Card>
    )
}
