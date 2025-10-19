
'use server';

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { NextRequest } from 'next/server';
import { GenkitMetric, genkitMetric } from '@genkit-ai/next';

// Initialize the Genkit AI client with the Google AI plugin.
// This will use the GEMINI_API_KEY environment variable.
export const ai = genkit({
  plugins: [
    googleAI(),
    genkitMetric({
      metric: async (metric: GenkitMetric, req?: NextRequest) => {
        // Here you can implement logging for your metrics.
        // The request object is available for logging request-specific information.
        console.log(metric);
      },
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
