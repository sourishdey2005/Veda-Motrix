'use server';
/**
 * @fileoverview An AI flow that analyzes customer feedback for sentiment and actionable insights.
 */
import { genAI } from '@/ai/genkit';
import {
  AnalyzeCustomerFeedbackInput,
  AnalyzeCustomerFeedbackOutput,
  AnalyzeCustomerFeedbackOutputSchema,
} from '@/ai/types';

export async function analyzeCustomerFeedback(
  input: AnalyzeCustomerFeedbackInput
): Promise<AnalyzeCustomerFeedbackOutput> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `You are an AI agent specialized in analyzing customer feedback for a vehicle service center. Your task is to determine the sentiment of the feedback, identify key areas or topics mentioned, and suggest improvements. Analyze the following customer feedback: "${input.feedbackText}". Respond with a valid JSON object matching this schema: ${JSON.stringify(AnalyzeCustomerFeedbackOutputSchema.shape)}.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const parsed = AnalyzeCustomerFeedbackOutputSchema.parse(
      JSON.parse(responseText)
    );
    return parsed;
  } catch (error) {
    console.error('Error in analyzeCustomerFeedback:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      sentiment: 'Error',
      keyAreas: 'Could not analyze feedback.',
      suggestions: `An unexpected error occurred: ${errorMessage}`,
    };
  }
}
