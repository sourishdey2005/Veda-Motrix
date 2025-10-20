
'use server';
/**
 * @fileoverview An AI flow that generates manufacturing insights from service data.
 */
import {ai} from '@/ai/genkit';
import {z} from 'zod';
import {
  GenerateManufacturingInsightsInput,
  GenerateManufacturingInsightsInputSchema,
  GenerateManufacturingInsightsOutput,
  GenerateManufacturingInsightsOutputSchema,
} from '@/ai/types';

const manufacturingInsightsFlow = ai.defineFlow(
  {
    name: 'manufacturingInsightsFlow',
    inputSchema: GenerateManufacturingInsightsInputSchema,
    outputSchema: GenerateManufacturingInsightsOutputSchema,
  },
  async (input: GenerateManufacturingInsightsInput) => {
    const llmResponse = await ai.generate({
      model: 'gemini-pro',
      prompt: `You are a manufacturing insights expert. Analyze the following service data and generate clear, actionable improvement suggestions for RCA/CAPA.

Service Data: ${input.serviceData}`,
    });

    return {improvementSuggestions: llmResponse.text};
  }
);

export async function generateManufacturingInsights(
  input: GenerateManufacturingInsightsInput
): Promise<GenerateManufacturingInsightsOutput> {
  try {
    return await manufacturingInsightsFlow(input);
  } catch (error) {
    console.error('Error in generateManufacturingInsights:', error);
    return {
      improvementSuggestions: `Failed to generate insights. Error: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}
