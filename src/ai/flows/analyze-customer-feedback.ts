
'use server';
/**
 * @fileoverview A Genkit flow that analyzes customer feedback for sentiment and actionable insights.
 */
import {
  AnalyzeCustomerFeedbackInput,
  AnalyzeCustomerFeedbackOutput,
  AnalyzeCustomerFeedbackOutputSchema,
} from '@/ai/types';
import { GoogleGenerativeAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable not set.");
}
const genAI = new GoogleGenerativeAI(apiKey);

export async function analyzeCustomerFeedback(
  input: AnalyzeCustomerFeedbackInput
): Promise<AnalyzeCustomerFeedbackOutput> {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `You are an AI agent specialized in analyzing customer feedback for a vehicle service center. Your task is to determine the sentiment of the feedback, identify key areas or topics mentioned, and suggest improvements.

Analyze the following customer feedback:
Feedback: ${input.feedbackText}

Output a JSON object that conforms to this schema:
${JSON.stringify(AnalyzeCustomerFeedbackOutputSchema.jsonSchema, null, 2)}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const parsed = JSON.parse(text);
    return AnalyzeCustomerFeedbackOutputSchema.parse(parsed);

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
