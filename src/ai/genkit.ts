
import {genkit, configureGenkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import { next } from '@genkit-ai/next';

if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable not set.");
}

export const ai = configureGenkit({
  plugins: [
    googleAI({ apiKey: process.env.GEMINI_API_KEY }),
    next({
        // The Next.js plugin is required for this app.
    }),
  ],
  flowStateStore: 'firebase',
  traceStore: 'firebase',
  enableTracingAndMetrics: true,
  logLevel: 'debug',
});
