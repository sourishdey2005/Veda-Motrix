
'use server';
/**
 * @fileoverview A Genkit flow that generates manufacturing insights from service data.
 */
import {
  GenerateManufacturingInsightsInput,
  GenerateManufacturingInsightsOutput,
  GenerateManufacturingInsightsOutputSchema,
} from '@/ai/types';
import { ai } from '@/ai/genkit';
import { z } from 'zod';

export async function generateManufacturingInsights(
  input: GenerateManufacturingInsightsInput
): Promise<GenerateManufacturingInsightsOutput> {
  try {
    const prompt = `You are a manufacturing insights expert. Analyze the following service data and generate improvement suggestions for RCA/CAPA.

Service Data: ${input.serviceData}

Provide clear, actionable improvement suggestions.

Output a JSON object that conforms to the following Zod schema:
${JSON.stringify(GenerateManufacturingInsightsOutputSchema.shape)}
`;

    const { output } = await ai.generate({
      model: 'googleai/gemini-pro',
      prompt: prompt,
      output: {
        format: 'json',
        schema: GenerateManufacturingInsightsOutputSchema,
      },
    });
    
    if (!output) {
      throw new Error('No output from AI');
    }
    return output;
  } catch (error) {
    console.error("Error in generateManufacturingInsights:", error);
    return {
      improvementSuggestions: `Failed to generate insights. Error: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
