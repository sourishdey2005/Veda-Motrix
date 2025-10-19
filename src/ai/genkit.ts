
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import { nextPlugin } from '@genkit-ai/next';

if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable not set.");
}

export const ai = genkit({
  plugins: [
    googleAI({ apiKey: process.env.GEMINI_API_KEY }),
    nextPlugin(),
  ],
  flowStateStore: 'firebase',
  traceStore: 'firebase',
  enableTracingAndMetrics: true,
});
