
'use server';
/**
 * @fileoverview A Genkit flow that generates manufacturing insights from service data.
 */
import {
  GenerateManufacturingInsightsInput,
  GenerateManufacturingInsightsOutput,
  GenerateManufacturingInsightsOutputSchema,
} from '@/ai/types';
import { GoogleGenerativeAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable not set.");
}
const genAI = new GoogleGenerativeAI(apiKey);

export async function generateManufacturingInsights(
  input: GenerateManufacturingInsightsInput
): Promise<GenerateManufacturingInsightsOutput> {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `You are a manufacturing insights expert. Analyze the following service data and generate improvement suggestions for RCA/CAPA.

Service Data: ${input.serviceData}

Provide clear, actionable improvement suggestions.

Output a JSON object that conforms to this schema:
${JSON.stringify(GenerateManufacturingInsightsOutputSchema.jsonSchema, null, 2)}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const parsed = JSON.parse(text);
    return GenerateManufacturingInsightsOutputSchema.parse(parsed);

  } catch (error) {
    console.error("Error in generateManufacturingInsights:", error);
    return {
      improvementSuggestions: `Failed to generate insights. Error: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
