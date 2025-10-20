
/**
 * @fileoverview This file initializes the Genkit AI instance with the Google AI plugin.
 * It exports a single `ai` object that is used throughout the application to
 * interact with the generative AI models.
 */
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
  // Log errors to the console.
  logLevel: 'error',
  // Perform OpenTelemetry instrumentation and enable traces.
  enableTracing: true,
});
