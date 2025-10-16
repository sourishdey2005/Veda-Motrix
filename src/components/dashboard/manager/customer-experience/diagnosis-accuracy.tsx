
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { customerExperienceData } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const issueTypes = ['Brakes', 'Engine', 'Electrical', 'Suspension'];

export function DiagnosisAccuracy() {
  const [accuracy, setAccuracy] = useState(customerExperienceData.diagnosisAccuracy);

  const memoizedUpdater = useCallback(() => {
    setAccuracy(prev => {
        const newMatrix = [...prev.matrix];
        const correctDiagnosis = newMatrix.find(d => d.aiPrediction === 'Brakes' && d.technicianDiagnosis === 'Brakes');
        if (correctDiagnosis) {
            correctDiagnosis.count += 1;
        }
        return {
            ...prev,
            overall: Math.min(95, prev.overall + (Math.random() - 0.4) * 0.1),
            matrix: newMatrix,
        };
    })
  }, []);

  useEffect(() => {
    const interval = setInterval(memoizedUpdater, 4000);
    return () => clearInterval(interval);
  }, [memoizedUpdater]);

  const matrixData = issueTypes.map(aiType => ({
    ai: aiType,
    human: issueTypes.map(humanType => {
      const entry = accuracy.matrix.find(
        d => d.aiPrediction === aiType && d.technicianDiagnosis === humanType
      );
      return entry ? entry.count : 0;
    }),
  }));

  const maxCount = Math.max(...accuracy.matrix.map(d => d.count));
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI vs. Human Diagnosis Accuracy</CardTitle>
        <CardDescription>
          Comparing AI predictions against final technician diagnoses. Accuracy is currently at <span className="font-bold text-primary">{accuracy.overall.toFixed(1)}%</span>.
        </CardDescription>
      </CardHeader>
      <CardContent>
         <TooltipProvider>
            <div className="flex gap-4">
                <div className="flex flex-col justify-between items-center text-xs text-muted-foreground font-medium -mt-4">
                    <Bot className="w-5 h-5 mb-2" />
                    <span className="-rotate-90">AI</span>
                </div>
                <div className="flex-1">
                    <div className="grid grid-cols-4 gap-1">
                        {matrixData.map(row => 
                            row.human.map((count, colIndex) => {
                                const isDiagonal = issueTypes[colIndex] === row.ai;
                                return (
                                <Tooltip key={`${row.ai}-${colIndex}`}>
                                    <TooltipTrigger asChild>
                                        <div 
                                            className={cn(
                                                "h-20 rounded-md border flex items-center justify-center",
                                                isDiagonal ? 'bg-green-500/20 border-green-500/30' : 'bg-red-500/10 border-red-500/20'
                                            )}
                                            style={{ opacity: count > 0 ? 0.3 + (count / maxCount) * 0.7 : 0.2 }}
                                        >
                                            <span className={cn(
                                                "font-bold text-lg",
                                                isDiagonal ? 'text-green-200' : 'text-red-200'
                                            )} style={{textShadow: '0 0 3px black'}}>
                                                {count}
                                            </span>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>AI: {row.ai}</p>
                                        <p>Tech: {issueTypes[colIndex]}</p>
                                        <p>Count: {count}</p>
                                    </TooltipContent>
                                </Tooltip>
                            )})
                        )}
                    </div>
                     <div className="grid grid-cols-4 gap-1 mt-1 text-center text-xs font-medium text-muted-foreground">
                        {issueTypes.map(type => <p key={type}>{type}</p>)}
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-2 text-xs text-muted-foreground font-medium">
                        <User className="w-5 h-5 mr-1" />
                        <span>Technician Diagnosis</span>
                    </div>
                </div>
            </div>
         </TooltipProvider>
      </CardContent>
    </Card>
  );
}
