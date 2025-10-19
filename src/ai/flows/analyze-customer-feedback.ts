'use server';

import {ai} from '@/ai/genkit';
import {
  AnalyzeCustomerFeedbackInputSchema,
  AnalyzeCustomerFeedbackOutputSchema,
  type AnalyzeCustomerFeedbackInput,
  type AnalyzeCustomerFeedbackOutput,
} from '@/ai/types';

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

const analyzeCustomerFeedbackFlow = ai.defineFlow(
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
