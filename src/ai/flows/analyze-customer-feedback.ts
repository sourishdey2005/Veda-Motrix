
'use server';
/**
 * @fileoverview An AI flow that analyzes customer feedback for sentiment and actionable insights.
 */
import {
  AnalyzeCustomerFeedbackInput,
  AnalyzeCustomerFeedbackInputSchema,
  AnalyzeCustomerFeedbackOutput,
  AnalyzeCustomerFeedbackOutputSchema,
} from '@/ai/types';
import {ai} from '@/ai/genkit';
import {z} from 'zod';

export async function analyzeCustomerFeedback(
  input: AnalyzeCustomerFeedbackInput
): Promise<AnalyzeCustomerFeedbackOutput> {
  const analysisFlow = ai.defineFlow(
    {
      name: 'analysisFlow',
      inputSchema: AnalyzeCustomerFeedbackInputSchema,
      outputSchema: AnalyzeCustomerFeedbackOutputSchema,
    },
    async ({feedbackText}) => {
      const llmResponse = await ai.generate({
        model: 'gemini-1.5-flash-latest',
        prompt: `You are an AI agent specialized in analyzing customer feedback for a vehicle service center. Your task is to determine the sentiment of the feedback, identify key areas or topics mentioned, and suggest improvements. Analyze the following customer feedback: "${feedbackText}"`,
        output: {
          schema: AnalyzeCustomerFeedbackOutputSchema,
        },
      });

      return llmResponse.output()!;
    }
  );

  try {
    return await analysisFlow(input);
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
