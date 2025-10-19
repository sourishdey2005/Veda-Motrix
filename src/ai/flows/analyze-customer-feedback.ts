'use server';
/**
 * @fileoverview A Genkit flow that analyzes customer feedback for sentiment and actionable insights.
 */
import {
  AnalyzeCustomerFeedbackInput,
  AnalyzeCustomerFeedbackOutput,
} from '@/ai/types';
import { ai } from '@/ai/genkit';

export async function analyzeCustomerFeedback(
  input: AnalyzeCustomerFeedbackInput
): Promise<AnalyzeCustomerFeedbackOutput> {
  try {
    const prompt = `You are an AI agent specialized in analyzing customer feedback for a vehicle service center. Your task is to determine the sentiment of the feedback, identify key areas or topics mentioned, and suggest improvements.

Analyze the following customer feedback:
Feedback: ${input.feedbackText}

Provide your analysis in the following format, separating each section with '---':
SENTIMENT: [Your sentiment analysis here (e.g., Very Positive, Negative, Neutral)]
KEY_AREAS: [Key topics mentioned here (e.g., Service Quality, Staff, Waiting Time)]
SUGGESTIONS: [Your improvement suggestions here]
`;

    const { output } = await ai.generate({
      model: 'googleai/gemini-pro',
      prompt: prompt,
    });

    if (!output || !output.text) {
      throw new Error('No text output from AI');
    }

    const parts = output.text.split('---');
    const sentimentPart = parts.find(p => p.startsWith('SENTIMENT:'))?.replace('SENTIMENT:', '').trim() || 'Could not determine sentiment.';
    const keyAreasPart = parts.find(p => p.startsWith('KEY_AREAS:'))?.replace('KEY_AREAS:', '').trim() || 'Could not identify key areas.';
    const suggestionsPart = parts.find(p => p.startsWith('SUGGESTIONS:'))?.replace('SUGGESTIONS:', '').trim() || 'No suggestions generated.';

    return {
      sentiment: sentimentPart,
      keyAreas: keyAreasPart,
      suggestions: suggestionsPart,
    };

  } catch (error) {
    console.error("Error in analyzeCustomerFeedback:", error);
    return {
      sentiment: "Error",
      keyAreas: "Could not analyze feedback.",
      suggestions: `An unexpected error occurred: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
