
'use server';
/**
 * @fileoverview A Genkit flow that analyzes customer feedback for sentiment and actionable insights.
 */
import {ai} from '@/ai/genkit';
import {
  AnalyzeCustomerFeedbackInput,
  AnalyzeCustomerFeedbackInputSchema,
  AnalyzeCustomerFeedbackOutput,
  AnalyzeCustomerFeedbackOutputSchema,
} from '@/ai/types';
import {z} from 'zod';

export async function analyzeCustomerFeedback(
  input: AnalyzeCustomerFeedbackInput
): Promise<AnalyzeCustomerFeedbackOutput> {
  const prompt = ai.definePrompt(
    {
      name: 'customerFeedbackPrompt',
      input: {schema: AnalyzeCustomerFeedbackInputSchema},
      output: {schema: AnalyzeCustomerFeedbackOutputSchema},
      prompt: `You are an AI agent specialized in analyzing customer feedback for a vehicle service center. Your task is to determine the sentiment of the feedback, identify key areas or topics mentioned, and suggest improvements.

Analyze the following customer feedback:
Feedback: {{feedbackText}}`,
    },
    async input => {
      const {output} = await ai.generate({
        prompt: input,
        model: 'googleai/gemini-pro',
        config: {
          output: {
            format: 'json',
            schema: AnalyzeCustomerFeedbackOutputSchema,
          },
        },
      });
      return output!;
    }
  );
  return prompt(input);
}
