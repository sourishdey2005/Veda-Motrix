
'use server';

/**
 * @fileOverview Analyzes customer feedback using an AI model to determine sentiment and identify key areas for improvement.
 *
 * - analyzeCustomerFeedback - Analyzes customer feedback and extracts sentiment.
 * - AnalyzeCustomerFeedbackInput - The input type for analyzeCustomerFeedback.
 * - AnalyzeCustomerFeedbackOutput - The return type for analyzeCustomerfeedback.
 */
import { openai } from '@/ai/client';
import { z } from 'zod';

export const AnalyzeCustomerFeedbackInputSchema = z.object({
  feedbackText: z
    .string()
    .describe('The text of the customer feedback to be analyzed.'),
});
export type AnalyzeCustomerFeedbackInput = z.infer<
  typeof AnalyzeCustomerFeedbackInputSchema
>;

export const AnalyzeCustomerFeedbackOutputSchema = z.object({
  sentiment: z
    .string()
    .describe(
      'The sentiment of the customer feedback (e.g., positive, negative, neutral).' + 
      'Also include degree of sentiment (very positive, slightly negative, etc.)'
    ),
  keyAreas: z
    .string()
    .describe(
      'Key areas or topics mentioned in the feedback (e.g., service quality, staff friendliness, waiting time).' + 
      'Separate multiple areas with commas.'
    ),
  suggestions: z
    .string()
    .describe('Suggestions for improvement based on the customer feedback.'),
});
export type AnalyzeCustomerFeedbackOutput = z.infer<
  typeof AnalyzeCustomerFeedbackOutputSchema
>;

export async function analyzeCustomerFeedback(
  input: AnalyzeCustomerFeedbackInput
): Promise<AnalyzeCustomerFeedbackOutput> {
    const prompt = `You are an AI agent specialized in analyzing customer feedback for a vehicle service center. Your task is to determine the sentiment of the feedback, identify key areas or topics mentioned, and suggest improvements.

    Analyze the following customer feedback:

    Feedback: ${input.feedbackText}

    Return a valid JSON object with the following structure:
    {
      "sentiment": "The sentiment of the feedback",
      "keyAreas": "Key areas or topics, comma-separated",
      "suggestions": "Suggestions for improvement"
    }`;

    const completion = await openai.chat.completions.create({
        model: 'openrouter/auto', // Using OpenRouter
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
    });

    const result = completion.choices[0].message?.content;
    if (!result) {
        throw new Error('AI failed to generate a response.');
    }

    return AnalyzeCustomerFeedbackOutputSchema.parse(JSON.parse(result));
}
