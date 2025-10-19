
'use server';

import {ai} from '@/ai/genkit';
import {z} from 'zod';

export const AnalyzeCustomerFeedbackInputSchema = z.object({
  feedbackText: z.string(),
});
export type AnalyzeCustomerFeedbackInput = z.infer<
  typeof AnalyzeCustomerFeedbackInputSchema
>;

export const AnalyzeCustomerFeedbackOutputSchema = z.object({
  sentiment: z
    .string()
    .describe(
      'The sentiment of the customer feedback (e.g., positive, negative, neutral). Also include degree of sentiment (very positive, slightly negative, etc.).'
    ),
  keyAreas: z
    .string()
    .describe(
      'Key areas or topics mentioned in the feedback (e.g., service quality, staff friendliness, waiting time). Separate multiple areas with commas.'
    ),
  suggestions: z
    .string()
    .describe('Suggestions for improvement based on the customer feedback.'),
});
export type AnalyzeCustomerFeedbackOutput = z.infer<
  typeof AnalyzeCustomerFeedbackOutputSchema
>;

const prompt = ai.definePrompt(
  {
    name: 'customerFeedbackPrompt',
    input: {schema: AnalyzeCustomerFeedbackInputSchema},
    output: {schema: AnalyzeCustomerFeedbackOutputSchema},
    prompt: `You are an AI agent specialized in analyzing customer feedback for a vehicle service center. Your task is to determine the sentiment of the feedback, identify key areas or topics mentioned, and suggest improvements.

    Analyze the following customer feedback:
    Feedback: {{{feedbackText}}}
    `,
  },
  async (input) => {
    return {
      model: 'googleai/gemini-1.5-flash',
      output: {
        format: 'json',
      },
    };
  }
);

export const analyzeCustomerFeedbackFlow = ai.defineFlow(
  {
    name: 'analyzeCustomerFeedbackFlow',
    inputSchema: AnalyzeCustomerFeedbackInputSchema,
    outputSchema: AnalyzeCustomerFeedbackOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('AI failed to generate a response.');
    }
    return output;
  }
);

export async function analyzeCustomerFeedback(
  input: AnalyzeCustomerFeedbackInput
): Promise<AnalyzeCustomerFeedbackOutput> {
  return analyzeCustomerFeedbackFlow(input);
}
