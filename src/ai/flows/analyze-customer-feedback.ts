
'use server';

/**
 * @fileOverview Analyzes customer feedback using an AI model to determine sentiment and identify key areas for improvement.
 */
import openai from '@/ai/client';

export interface AnalyzeCustomerFeedbackInput {
  feedbackText: string;
}

export interface AnalyzeCustomerFeedbackOutput {
  sentiment: string;
  keyAreas: string;
  suggestions: string;
}

export async function analyzeCustomerFeedback(
  input: AnalyzeCustomerFeedbackInput
): Promise<AnalyzeCustomerFeedbackOutput> {
  const prompt = `You are an AI agent specialized in analyzing customer feedback for a vehicle service center. Your task is to determine the sentiment of the feedback, identify key areas or topics mentioned, and suggest improvements.

    Analyze the following customer feedback:
    Feedback: ${input.feedbackText}

    Return a JSON object with the following structure: { "sentiment": "string", "keyAreas": "string", "suggestions": "string" }.
    - sentiment: The sentiment of the customer feedback (e.g., positive, negative, neutral). Also include degree of sentiment (very positive, slightly negative, etc.).
    - keyAreas: Key areas or topics mentioned in the feedback (e.g., service quality, staff friendliness, waiting time). Separate multiple areas with commas.
    - suggestions: Suggestions for improvement based on the customer feedback.
    `;

  try {
    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const responseJson = completion.choices[0].message?.content;
    if (!responseJson) {
      throw new Error('AI failed to generate a response.');
    }

    return JSON.parse(responseJson) as AnalyzeCustomerFeedbackOutput;
  } catch (error) {
    console.error('Error in analyzeCustomerFeedback:', error);
    throw new Error('Failed to analyze customer feedback.');
  }
}
