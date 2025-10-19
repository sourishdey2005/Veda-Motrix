
'use server';
/**
 * @fileoverview A Genkit flow that analyzes customer feedback for sentiment and actionable insights.
 */
import {
  AnalyzeCustomerFeedbackInput,
  AnalyzeCustomerFeedbackOutput,
  AnalyzeCustomerFeedbackOutputSchema,
} from '@/ai/types';
import { ai } from '@/ai/genkit';
import { z } from 'zod';

export async function analyzeCustomerFeedback(
  input: AnalyzeCustomerFeedbackInput
): Promise<AnalyzeCustomerFeedbackOutput> {
  try {
    const prompt = `You are an AI agent specialized in analyzing customer feedback for a vehicle service center. Your task is to determine the sentiment of the feedback, identify key areas or topics mentioned, and suggest improvements.

Analyze the following customer feedback:
Feedback: ${input.feedbackText}

Output a JSON object that conforms to the following Zod schema:
${JSON.stringify(AnalyzeCustomerFeedbackOutputSchema.shape)}
`;

    const { output } = await ai.generate({
      model: 'googleai/gemini-pro',
      prompt: prompt,
      output: {
        format: 'json',
        schema: AnalyzeCustomerFeedbackOutputSchema,
      },
    });

    if (!output) {
      throw new Error('No output from AI');
    }
    return output;
  } catch (error) {
    console.error("Error in analyzeCustomerFeedback:", error);
    return {
      sentiment: "Error",
      keyAreas: "Could not analyze feedback.",
      suggestions: `An unexpected error occurred: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
