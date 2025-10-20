
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

const customerFeedbackFlow = ai.defineFlow(
  {
    name: 'customerFeedbackFlow',
    inputSchema: AnalyzeCustomerFeedbackInputSchema,
    outputSchema: AnalyzeCustomerFeedbackOutputSchema,
  },
  async (input: AnalyzeCustomerFeedbackInput): Promise<AnalyzeCustomerFeedbackOutput> => {
    const llmResponse = await ai.generate({
      model: 'gemini-pro',
      prompt: `You are an AI agent specialized in analyzing customer feedback for a vehicle service center. Your task is to determine the sentiment of the feedback, identify key areas or topics mentioned, and suggest improvements. Analyze the following customer feedback: "${input.feedbackText}". Respond with a valid JSON object matching the requested schema.`,
      output: {
        schema: AnalyzeCustomerFeedbackOutputSchema,
      },
    });

    const result = llmResponse.output;

    if (result) {
        return result;
    }
    
    // Fallback parsing if structured output fails
    try {
        const parsed = AnalyzeCustomerFeedbackOutputSchema.parse(JSON.parse(llmResponse.text));
        return parsed;
    } catch(e) {
        console.error("Failed to get structured output or parse text for customer feedback", e);
        return {
            sentiment: 'Error',
            keyAreas: 'Could not analyze feedback.',
            suggestions: 'The AI failed to return a valid response. Please try again.',
        }
    }
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
