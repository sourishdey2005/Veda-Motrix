
'use server';

import { genAI } from "@/ai/google-ai";
import {
  type GenerateExecutiveSummaryInput,
  type GenerateExecutiveSummaryOutput,
} from '@/ai/types';

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: { responseMimeType: "application/json" },
});

export async function generateExecutiveSummary(
  input: GenerateExecutiveSummaryInput
): Promise<GenerateExecutiveSummaryOutput> {

  const prompt = `You are an AI assistant specialized in creating executive summaries for business intelligence dashboards. Your task is to analyze the provided JSON data and generate a clear, concise, and insightful summary for a management audience.
    Focus on key takeaways, trends, and significant metrics.

    Analyze the following data:
    ${input.reportData}

    Generate a summary that highlights the most important findings. Structure it with a brief overview, followed by 2-3 bullet points on key areas (e.g., ROI, System Reliability, Cost Reduction).
    
    Return a JSON object with the following structure:
    {
      "summary": "A concise, well-structured executive summary of the provided data, formatted for a business audience."
    }`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const jsonString = response.text();
    return JSON.parse(jsonString) as GenerateExecutiveSummaryOutput;
  } catch (error) {
    console.error("Error generating executive summary:", error);
    throw new Error("Failed to generate executive summary.");
  }
}
