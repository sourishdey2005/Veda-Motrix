
'use server';
/**
 * @fileoverview An AI flow that generates manufacturing insights from service data.
 */
import {
  GenerateManufacturingInsightsInput,
  GenerateManufacturingInsightsOutput,
} from '@/ai/types';
import { openAiClient } from '@/ai/genkit';

export async function generateManufacturingInsights(
  input: GenerateManufacturingInsightsInput
): Promise<GenerateManufacturingInsightsOutput> {
  try {
    const prompt = `You are a manufacturing insights expert. Analyze the following service data and generate clear, actionable improvement suggestions for RCA/CAPA.

Service Data: ${input.serviceData}
`;

    const improvementSuggestions = await openAiClient(prompt);
    return { improvementSuggestions };

  } catch (error) {
    console.error("Error in generateManufacturingInsights:", error);
    return {
      improvementSuggestions: `Failed to generate insights. Error: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
