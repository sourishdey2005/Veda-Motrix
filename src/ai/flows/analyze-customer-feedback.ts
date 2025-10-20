
'use server';
/**
 * @fileoverview An AI flow that analyzes customer feedback for sentiment and actionable insights.
 */
import { aiClient, textModel } from '@/ai/genkit';
import { isUnexpected } from '@azure-rest/ai-inference';
import {
  AnalyzeCustomerFeedbackInput,
  AnalyzeCustomerFeedbackOutput,
  AnalyzeCustomerFeedbackOutputSchema,
} from '@/ai/types';

export async function analyzeCustomerFeedback(
  input: AnalyzeCustomerFeedbackInput
): Promise<AnalyzeCustomerFeedbackOutput> {
  try {
    const prompt = `You are an AI agent specialized in analyzing customer feedback for a vehicle service center. Your task is to determine the sentiment of the feedback, identify key areas or topics mentioned, and suggest improvements. Analyze the following customer feedback: "${input.feedbackText}". Respond with a valid JSON object matching this schema: ${JSON.stringify(AnalyzeCustomerFeedbackOutputSchema.shape)}.`;

    const response = await aiClient.path("/chat/completions").post({
      body: {
        model: textModel,
        messages: [
          { role: 'system', content: 'You are a helpful assistant that only returns valid JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0,
        top_p: 1,
      },
    });

    if (isUnexpected(response)) {
      const errorBody = response.body as any;
      throw new Error(errorBody?.error?.message || 'An unexpected error occurred.');
    }

    const message = response.body.choices[0]?.message?.content;
    if (!message) {
      throw new Error('AI returned an empty response.');
    }
    
    // Attempt to parse the JSON response, with robust fallback.
    try {
      const parsed = AnalyzeCustomerFeedbackOutputSchema.parse(JSON.parse(message));
      return parsed;
    } catch (e) {
      console.error("Failed to parse AI JSON response:", e);
      return {
        sentiment: 'Error',
        keyAreas: 'Could not analyze feedback.',
        suggestions: `AI returned an invalid response format. Raw response: ${message}`,
      };
    }

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
