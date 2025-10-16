
"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { customerFeedbackData } from "@/lib/data"
import { Star, StarHalf, Bot } from "lucide-react"
import { analyzeCustomerFeedback, AnalyzeCustomerFeedbackOutput } from '@/ai/flows/analyze-customer-feedback';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

type AnalyzedFeedback = AnalyzeCustomerFeedbackOutput & { id: string };

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  return (
    <div className="flex text-yellow-400">
      {[...Array(fullStars)].map((_, i) => <Star key={`full-${i}`} fill="currentColor" className="w-4 h-4" />)}
      {halfStar && <StarHalf fill="currentColor" className="w-4 h-4" />}
      {[...Array(emptyStars)].map((_, i) => <Star key={`empty-${i}`} className="w-4 h-4" />)}
    </div>
  )
}

export function CustomerFeedbackView() {
  const [analyzedData, setAnalyzedData] = useState<AnalyzedFeedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function analyzeAllFeedback() {
      setLoading(true);
      const results = await Promise.all(
        customerFeedbackData.map(async (feedback) => {
          const analysis = await analyzeCustomerFeedback({ feedbackText: feedback.comment });
          return { ...analysis, id: feedback.id };
        })
      );
      setAnalyzedData(results);
      setLoading(false);
    }
    analyzeAllFeedback();
  }, []);

  return (
    <div className="grid gap-4">
      {loading ? (
        Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3 mt-2" />
            </CardContent>
          </Card>
        ))
      ) : (
        customerFeedbackData.map((feedback) => {
          const analysis = analyzedData.find(a => a.id === feedback.id);
          return (
            <Card key={feedback.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <StarRating rating={feedback.rating} />
                      <CardTitle className="text-lg">Feedback from User #{feedback.userId}</CardTitle>
                    </div>
                    <CardDescription>Vehicle: {feedback.vehicleId} on {new Date(feedback.date).toLocaleDateString('en-IN')}</CardDescription>
                  </div>
                  {analysis && <Badge variant={analysis.sentiment.toLowerCase().includes('positive') ? 'default' : analysis.sentiment.toLowerCase().includes('negative') ? 'destructive' : 'secondary'} className={analysis.sentiment.toLowerCase().includes('positive') ? 'bg-green-600': ''}>{analysis.sentiment}</Badge>}
                </div>
              </CardHeader>
              <CardContent>
                <p className="italic">"{feedback.comment}"</p>
                {analysis && (
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold flex items-center gap-2"><Bot className="w-4 h-4 text-primary" /> AI Analysis</h4>
                    <p className="text-sm mt-2"><span className="font-medium">Key Areas:</span> {analysis.keyAreas}</p>
                    <p className="text-sm mt-1"><span className="font-medium">Suggestions:</span> {analysis.suggestions}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })
      )}
    </div>
  )
}
