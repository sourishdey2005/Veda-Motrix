"use client"

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { PredictiveInsight } from '@/lib/types';
import { AlertTriangle, Info, Wrench } from 'lucide-react';

const urgencyStyles = {
  High: 'border-red-500/50 bg-red-500/10 text-red-300',
  Medium: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-300',
  Low: 'border-blue-500/50 bg-blue-500/10 text-blue-300',
};

export function PredictiveInsightCard({ insight }: { insight: PredictiveInsight }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => setIsFlipped(!isFlipped);

  return (
    <div className="perspective-1000">
      <div
        className={cn(
          'relative h-56 w-full transform-style-3d transition-transform duration-700',
          isFlipped ? 'rotate-y-180' : ''
        )}
      >
        {/* Front of the card */}
        <div className="absolute backface-hidden h-full w-full">
          <Card className={cn("h-full flex flex-col justify-between", urgencyStyles[insight.urgency])}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{insight.title}</CardTitle>
                <AlertTriangle className="w-5 h-5" />
              </div>
              <CardDescription className="text-muted-foreground">{insight.shortDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" onClick={handleFlip}>
                <Info className="mr-2" />
                More Info
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Back of the card */}
        <div className="absolute backface-hidden h-full w-full rotate-y-180">
          <Card className={cn("h-full flex flex-col justify-between", urgencyStyles[insight.urgency])}>
            <CardHeader>
              <CardTitle className="text-lg">Details & Action</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow space-y-2">
              <p className="text-xs text-muted-foreground">{insight.detailedExplanation}</p>
              <div className="flex items-center gap-4">
                 <Button variant="secondary" className="w-full" onClick={handleFlip}>Back</Button>
                 <Button className="w-full">
                    <Wrench className="mr-2" />
                    {insight.recommendedAction}
                 </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
       <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
      `}</style>
    </div>
  );
}
