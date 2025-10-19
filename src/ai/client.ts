import {ai} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// Configure the AI and plugins.
export const initGenkit = () => {
  ai({
    plugins: [
      googleAI({
        apiVersion: ['v1', 'v1beta'],
      }),
    ],
    logLevel: 'debug',
    enableTracingAndMetrics: true,
  });
};
