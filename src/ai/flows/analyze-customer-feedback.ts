
'use server';

/**
 * @fileOverview Analyzes customer feedback using Genkit to determine sentiment and identify key areas for improvement.
 *
 * - analyzeCustomerFeedback - Analyzes customer feedback and extracts sentiment.
 * - AnalyzeCustomerFeedbackInput - The input type for analyzeCustomerFeedback.
 * - AnalyzeCustomerFeedbackOutput - The return type for analyzeCustomerFeedback.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {z} from 'genkit';

const AnalyzeCustomerFeedbackInputSchema = z.object({
  feedbackText: z
    .string()
    .describe('The text of the customer feedback to be analyzed.'),
});
export type AnalyzeCustomerFeedbackInput = z.infer<
  typeof AnalyzeCustomerFeedbackInputSchema
>;

const AnalyzeCustomerFeedbackOutputSchema = z.object({
  sentiment: z
    .string()
    .describe(
      'The sentiment of the customer feedback (e.g., positive, negative, neutral).' + 
      'Also include degree of sentiment (very positive, slightly negative, etc.)'
    ),
  keyAreas: z
    .string()
    .describe(
      'Key areas or topics mentioned in the feedback (e.g., service quality, staff friendliness, waiting time).' + 
      'Separate multiple areas with commas.'
    ),
  suggestions: z
    .string()
    .describe('Suggestions for improvement based on the customer feedback.'),
});
export type AnalyzeCustomerFeedbackOutput = z.infer<
  typeof AnalyzeCustomerFeedbackOutputSchema
>;

export async function analyzeCustomerFeedback(
  input: AnalyzeCustomerFeedbackInput
): Promise<AnalyzeCustomerFeedbackOutput> {
  return analyzeCustomerFeedbackFlow(input);
}

const analyzeCustomerFeedbackPrompt = ai.definePrompt({
  name: 'analyzeCustomerFeedbackPrompt',
  input: {schema: AnalyzeCustomerFeedbackInputSchema},
  output: {schema: AnalyzeCustomerFeedbackOutputSchema},
  prompt: `You are an AI agent specialized in analyzing customer feedback for a vehicle service center. Your task is to determine the sentiment of the feedback, identify key areas or topics mentioned, and suggest improvements.

Analyze the following customer feedback:

Feedback: {{{feedbackText}}}

Determine the sentiment, extract key areas, and provide suggestions for improvement. The output should be structured as follows:

Sentiment: [Sentiment of the feedback]
Key Areas: [Key areas or topics mentioned in the feedback, separated by commas]
Suggestions: [Suggestions for improvement based on the feedback]`,
});

const analyzeCustomerFeedbackFlow = ai.defineFlow(
  {
    name: 'analyzeCustomerFeedbackFlow',
    inputSchema: AnalyzeCustomerFeedbackInputSchema,
    outputSchema: AnalyzeCustomerFeedbackOutputSchema,
  },
  async input => {
    const {output} = await analyzeCustomerFeedbackPrompt(input);
    return output!;
  }
);
