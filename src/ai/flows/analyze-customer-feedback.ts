
'use server';
/**
 * @fileoverview A Genkit flow that analyzes customer feedback for sentiment and actionable insights.
 */
import {
  AnalyzeCustomerFeedbackInput,
  AnalyzeCustomerFeedbackInputSchema,
  AnalyzeCustomerFeedbackOutput,
  AnalyzeCustomerFeedbackOutputSchema,
} from '@/ai/types';
import { ai } from '@/ai/genkit';

const analysisPrompt = ai.definePrompt(
  {
    name: 'customerFeedbackAnalysis',
    input: { schema: AnalyzeCustomerFeedbackInputSchema },
    output: { schema: AnalyzeCustomerFeedbackOutputSchema },
    prompt: `You are an AI agent specialized in analyzing customer feedback for a vehicle service center. Your task is to determine the sentiment of the feedback, identify key areas or topics mentioned, and suggest improvements.

Analyze the following customer feedback:
Feedback: {{feedbackText}}

Output a JSON object that conforms to the schema.`,
  },
);

export async function analyzeCustomerFeedback(
  input: AnalyzeCustomerFeedbackInput
): Promise<AnalyzeCustomerFeedbackOutput> {
  try {
    const result = await ai.run(analysisPrompt, input);
    return result;
  } catch (error) {
    console.error("Error in analyzeCustomerFeedback:", error);
    // Provide a more structured error output
    return {
      sentiment: "Error",
      keyAreas: "Could not analyze feedback.",
      suggestions: `An unexpected error occurred: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
