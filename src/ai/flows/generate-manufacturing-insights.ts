'use server';
/**
 * @fileoverview An AI flow that generates manufacturing insights from service data.
 */
import { genAI } from '@/ai/genkit';
import {
  GenerateManufacturingInsightsInput,
  GenerateManufacturingInsightsOutput,
} from '@/ai/types';

export async function generateManufacturingInsights(
  input: GenerateManufacturingInsightsInput
): Promise<GenerateManufacturingInsightsOutput> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `You are a manufacturing insights expert. Analyze the following service data and generate clear, actionable improvement suggestions for RCA/CAPA.

Service Data: ${input.serviceData}`;

    const result = await model.generateContent(prompt);
    const improvementSuggestions = result.response.text();

    return { improvementSuggestions };
  } catch (error) {
    console.error('Error in generateManufacturingInsights:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      improvementSuggestions: `Failed to generate insights. Error: ${errorMessage}`,
    };
  }
}
