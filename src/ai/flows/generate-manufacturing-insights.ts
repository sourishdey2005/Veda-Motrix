
'use server';

import { GoogleGenAI } from "@google/genai";
import {
  type GenerateManufacturingInsightsInput,
  type GenerateManufacturingInsightsOutput,
} from '@/ai/types';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable not set.");
}
const genAI = new GoogleGenAI(apiKey);

export async function generateManufacturingInsights(
  input: GenerateManufacturingInsightsInput
): Promise<GenerateManufacturingInsightsOutput> {

  const prompt = `You are a manufacturing insights expert. Analyze the following service data and generate improvement suggestions for RCA/CAPA.

    Service Data: ${input.serviceData}

    Provide clear, actionable improvement suggestions.
    
    Return a JSON object with the following structure:
    {
      "improvementSuggestions": "string"
    }`;

  try {
    const result = await genAI.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" },
    });
    const response = result.response;
    const jsonString = response.text();
    return JSON.parse(jsonString) as GenerateManufacturingInsightsOutput;
  } catch (error) {
    console.error("Error generating manufacturing insights:", error);
    throw new Error("Failed to generate manufacturing insights.");
  }
}
