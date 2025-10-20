
'use server';
/**
 * @fileoverview An AI flow that analyzes customer feedback for sentiment and actionable insights.
 */
import {ai} from '@/ai/genkit';
import {z} from 'zod';
import {
  AnalyzeCustomerFeedbackInput,
  AnalyzeCustomerFeedbackInputSchema,
  AnalyzeCustomerFeedbackOutput,
  AnalyzeCustomerFeedbackOutputSchema,
} from '@/ai/types';
import {gemini15Flash} from '@genkit-ai/google-genai';

const customerFeedbackFlow = ai.defineFlow(
  {
    name: 'customerFeedbackFlow',
    inputSchema: AnalyzeCustomerFeedbackInputSchema,
    outputSchema: AnalyzeCustomerFeedbackOutputSchema,
  },
  async (input: AnalyzeCustomerFeedbackInput) => {
    const llmResponse = await ai.generate({
      model: 'gemini-1.5-flash-latest',
      prompt: `You are an AI agent specialized in analyzing customer feedback for a vehicle service center. Your task is to determine the sentiment of the feedback, identify key areas or topics mentioned, and suggest improvements. Analyze the following customer feedback: "${input.feedbackText}"`,
      output: {
        schema: AnalyzeCustomerFeedbackOutputSchema,
      },
    });

    const result = llmResponse.output;

    if (!result) {
      throw new Error('AI returned an invalid response format.');
    }
    return result;
  }
);

export async function analyzeCustomerFeedback(
  input: AnalyzeCustomerFeedbackInput
): Promise<AnalyzeCustomerFeedbackOutput> {
  try {
    return await customerFeedbackFlow(input);
  } catch (error) {
    console.error('Error in analyzeCustomerFeedback:', error);
    return {
      sentiment: 'Error',
      keyAreas: 'Could not analyze feedback.',
      suggestions: `An unexpected error occurred: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}
