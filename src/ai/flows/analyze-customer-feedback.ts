
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
import { z } from 'zod';

const analyzeFeedbackPrompt = ai.definePrompt(
  {
    name: 'analyzeFeedbackPrompt',
    input: { schema: AnalyzeCustomerFeedbackInputSchema },
    output: { schema: AnalyzeCustomerFeedbackOutputSchema },
    model: 'googleai/gemini-1.5-flash-latest',
    prompt: `You are an AI agent specialized in analyzing customer feedback for a vehicle service center. Your task is to determine the sentiment of the feedback, identify key areas or topics mentioned, and suggest improvements.

Analyze the following customer feedback:
Feedback: {{{feedbackText}}}

Provide your analysis in the format defined by the output schema.
`,
  },
);

const analyzeCustomerFeedbackFlow = ai.defineFlow(
  {
    name: 'analyzeCustomerFeedbackFlow',
    inputSchema: AnalyzeCustomerFeedbackInputSchema,
    outputSchema: AnalyzeCustomerFeedbackOutputSchema,
  },
  async (input) => {
    const { output } = await analyzeFeedbackPrompt(input);
    if (!output) {
      throw new Error('Analysis failed: AI did not return a structured response.');
    }
    return output;
  }
);


export async function analyzeCustomerFeedback(
  input: AnalyzeCustomerFeedbackInput
): Promise<AnalyzeCustomerFeedbackOutput> {
  try {
     return await analyzeCustomerFeedbackFlow(input);
  } catch (error) {
    console.error("Error in analyzeCustomerFeedback:", error);
    return {
      sentiment: "Error",
      keyAreas: "Could not analyze feedback.",
      suggestions: `An unexpected error occurred: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
