
'use server';

import { genAI } from "@/ai/google-ai";
import {
  type AnalyzeCustomerFeedbackInput,
  type AnalyzeCustomerFeedbackOutput,
} from '@/ai/types';

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: { responseMimeType: "application/json" },
});

export async function analyzeCustomerFeedback(
  input: AnalyzeCustomerFeedbackInput
): Promise<AnalyzeCustomerFeedbackOutput> {

  const prompt = `You are an AI agent specialized in analyzing customer feedback for a vehicle service center. Your task is to determine the sentiment of the feedback, identify key areas or topics mentioned, and suggest improvements.

    Analyze the following customer feedback:
    Feedback: ${input.feedbackText}

    Return a JSON object with the following structure:
    {
      "sentiment": "The sentiment of the customer feedback (e.g., positive, negative, neutral). Also include degree of sentiment (very positive, slightly negative, etc.).",
      "keyAreas": "Key areas or topics mentioned in the feedback (e.g., service quality, staff friendliness, waiting time). Separate multiple areas with commas.",
      "suggestions": "Suggestions for improvement based on the customer feedback."
    }`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const jsonString = response.text();
    const parsed = JSON.parse(jsonString);
    return parsed as AnalyzeCustomerFeedbackOutput;
  } catch (error) {
    console.error("Error analyzing customer feedback:", error);
    throw new Error("Failed to analyze customer feedback.");
  }
}
