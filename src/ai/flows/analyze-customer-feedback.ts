
'use server';
/**
 * @fileoverview An AI flow that analyzes customer feedback for sentiment and actionable insights.
 */
import {
  AnalyzeCustomerFeedbackInput,
  AnalyzeCustomerFeedbackOutput,
  AnalyzeCustomerFeedbackOutputSchema,
} from '@/ai/types';
import { geminiClient } from '@/ai/genkit';
import { z } from 'zod';

export async function analyzeCustomerFeedback(
  input: AnalyzeCustomerFeedbackInput
): Promise<AnalyzeCustomerFeedbackOutput> {
  try {
    const prompt = `You are an AI agent specialized in analyzing customer feedback for a vehicle service center. Your task is to determine the sentiment of the feedback, identify key areas or topics mentioned, and suggest improvements.

Analyze the following customer feedback:
Feedback: "${input.feedbackText}"

Respond with a JSON object that strictly follows this Zod schema. Do not include any extra text or formatting outside of the JSON object itself:
${JSON.stringify(AnalyzeCustomerFeedbackOutputSchema.shape, null, 2)}
`;

    const rawResponse = await geminiClient(prompt, [], true);
    const parsedResponse = JSON.parse(rawResponse);
    
    const validation = AnalyzeCustomerFeedbackOutputSchema.safeParse(parsedResponse);
    if (!validation.success) {
        console.error("AI response validation failed:", validation.error);
        throw new Error("The AI returned data in an unexpected format.");
    }
    
    return validation.data;

  } catch (error) {
    console.error("Error in analyzeCustomerFeedback:", error);
    return {
      sentiment: "Error",
      keyAreas: "Could not analyze feedback.",
      suggestions: `An unexpected error occurred: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
