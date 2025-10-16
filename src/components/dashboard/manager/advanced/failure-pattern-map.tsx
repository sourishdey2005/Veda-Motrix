
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { failurePatterns, FailurePattern } from '@/lib/data';
import { Map, AlertTriangle } from "lucide-react";
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Simplified coordinates for regions on a symbolic map
const regionPositions = {
  North: { top: '15%', left: '50%' },
  West: { top: '45%', left: '20%' },
  Central: { top: '50%', left: '50%' },
  East: { top: '45%', left: '80%' },
  South: { top: '80%', left: '50%' },
};

const severityClasses = {
    High: 'bg-red-500/20 border-red-500/50 text-red-300',
    Medium: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300',
    Low: 'bg-green-500/20 border-green-500/50 text-green-300',
};

export function FailurePatternMap() {
    const [patterns, setPatterns] = useState<FailurePattern[]>(failurePatterns);
    
    // Simulate new insights appearing
    useEffect(() => {
        const interval = setInterval(() => {
            setPatterns(prev => {
                const newPattern: FailurePattern = {
                    region: 'South',
                    issue: 'AC Compressor Failure',
                    insight: 'High humidity and heat in southern cities may be accelerating compressor wear.',
                    severity: 'Medium'
                };
                // Avoid adding duplicates
                if (prev.find(p => p.issue === newPattern.issue)) return prev;
                return [...prev, newPattern];
            });
        }, 10000);
        return () => clearInterval(interval);
    }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Map className="w-6 h-6 text-primary" />
            Failure Pattern Forecast Map
        </CardTitle>
        <CardDescription>
          AI-driven geographical analysis highlighting emerging issue clusters.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <TooltipProvider>
                    <div className="relative h-[60vh] w-full rounded-lg bg-muted border overflow-hidden">
                        {/* Background grid */}
                        <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
                        
                        {/* Symbolic Map Outline - simplified */}
                        <svg className="absolute inset-0 w-full h-full text-border" fill="none" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M50 5 L95 25 L85 80 L15 80 L5 25 Z" stroke="currentColor" strokeWidth="0.5" />
                        </svg>

                        {Object.entries(regionPositions).map(([region, pos]) => {
                             const regionPatterns = patterns.filter(p => p.region === region);
                             if (regionPatterns.length === 0) return null;

                             const highestSeverity = regionPatterns.reduce((max, p) => p.severity === 'High' ? 'High' : (p.severity === 'Medium' && max !== 'High' ? 'Medium' : max), 'Low');

                            return (
                                <Tooltip key={region}>
                                    <TooltipTrigger asChild>
                                        <div
                                            className={cn(
                                                "absolute flex items-center justify-center w-16 h-16 rounded-full transition-all duration-500",
                                                severityClasses[highestSeverity]
                                            )}
                                            style={{ top: pos.top, left: pos.left, transform: 'translate(-50%, -50%)' }}
                                        >
                                            <div className="absolute inset-0 rounded-full animate-ping" style={{ backgroundColor: `hsl(var(--${severityClasses[highestSeverity].split(' ')[2].split('-')[0]}))`, opacity: 0.3 }}></div>
                                            <div className="relative flex flex-col items-center justify-center">
                                                <p className="text-sm font-bold">{region}</p>
                                                <p className="text-xs">{regionPatterns.length} issue(s)</p>
                                            </div>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <div className="w-64 p-2">
                                            <p className="font-bold text-base mb-2">{region} Region Issues</p>
                                            <ul className="space-y-1 text-xs">
                                                {regionPatterns.map((p, i) => (
                                                    <li key={i} className="flex items-start gap-2">
                                                        <AlertTriangle className={cn("w-3.5 h-3.5 mt-0.5", severityClasses[p.severity].split(' ').pop())} />
                                                        <span><span className='font-semibold'>{p.issue}:</span> {p.insight}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            )
                        })}
                    </div>
                </TooltipProvider>
            </div>
            <div className="lg:col-span-1 space-y-4">
                 <h3 className="font-semibold">Live AI Insights</h3>
                {patterns.map((pattern, index) => (
                    <div key={index} className={cn("p-3 rounded-lg border", severityClasses[pattern.severity])}>
                        <p className="font-bold text-sm flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            {pattern.issue} ({pattern.region})
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{pattern.insight}</p>
                    </div>
                ))}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
