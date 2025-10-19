
'use server';
/**
 * @fileoverview A Genkit flow that generates an executive summary from business intelligence data.
 */
import {
  GenerateExecutiveSummaryInput,
  GenerateExecutiveSummaryOutput,
  GenerateExecutiveSummaryOutputSchema,
} from '@/ai/types';
import { GoogleGenerativeAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable not set.");
}
const genAI = new GoogleGenerativeAI(apiKey);

export async function generateExecutiveSummary(
  input: GenerateExecutiveSummaryInput
): Promise<GenerateExecutiveSummaryOutput> {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `You are an AI assistant specialized in creating executive summaries for business intelligence dashboards. Your task is to analyze the provided JSON data and generate a clear, concise, and insightful summary for a management audience.
Focus on key takeaways, trends, and significant metrics.

Analyze the following data:
${input.reportData}

Generate a summary that highlights the most important findings. Structure it with a brief overview, followed by 2-3 bullet points on key areas (e.g., ROI, System Reliability, Cost Reduction).

Output a JSON object that conforms to this schema:
${JSON.stringify(GenerateExecutiveSummaryOutputSchema.jsonSchema, null, 2)}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const parsed = JSON.parse(text);
    return GenerateExecutiveSummaryOutputSchema.parse(parsed);

  } catch (error) {
    console.error("Error in generateExecutiveSummary:", error);
    return {
      summary: `Failed to generate summary. Error: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
