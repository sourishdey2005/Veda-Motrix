
'use server';
/**
 * @fileoverview An AI flow that analyzes customer feedback for sentiment and actionable insights.
 */
import {
  AnalyzeCustomerFeedbackInput,
  AnalyzeCustomerFeedbackOutput,
  AnalyzeCustomerFeedbackOutputSchema,
} from '@/ai/types';
import { openAiClient } from '@/ai/genkit';

export async function analyzeCustomerFeedback(
  input: AnalyzeCustomerFeedbackInput
): Promise<AnalyzeCustomerFeedbackOutput> {
  try {
    const result = await openAiClient<AnalyzeCustomerFeedbackInput, AnalyzeCustomerFeedbackOutput>({
      prompt: `You are an AI agent specialized in analyzing customer feedback for a vehicle service center. Your task is to determine the sentiment of the feedback, identify key areas or topics mentioned, and suggest improvements. Analyze the following customer feedback: "${input.feedbackText}"`,
      response_model: {
        schema: AnalyzeCustomerFeedbackOutputSchema,
        name: 'AnalyzeCustomerFeedbackOutput',
      },
    });

    if (typeof result === 'string' || !result) {
        throw new Error('AI returned an invalid response format.');
    }
    
    return result;

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
