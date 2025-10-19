
'use server';
/**
 * @fileoverview An AI flow that generates manufacturing insights from service data.
 */
import {
  GenerateManufacturingInsightsInput,
  GenerateManufacturingInsightsInputSchema,
  GenerateManufacturingInsightsOutput,
  GenerateManufacturingInsightsOutputSchema,
} from '@/ai/types';
import {ai} from '@/ai/genkit';
import {z} from 'zod';

export async function generateManufacturingInsights(
  input: GenerateManufacturingInsightsInput
): Promise<GenerateManufacturingInsightsOutput> {
  const insightsFlow = ai.defineFlow(
    {
      name: 'manufacturingInsightsFlow',
      inputSchema: GenerateManufacturingInsightsInputSchema,
      outputSchema: GenerateManufacturingInsightsOutputSchema,
    },
    async ({serviceData}) => {
      const llmResponse = await ai.generate({
        model: 'gemini-1.5-flash-latest',
        prompt: `You are a manufacturing insights expert. Analyze the following service data and generate clear, actionable improvement suggestions for RCA/CAPA.

Service Data: ${serviceData}`,
      });
      return {improvementSuggestions: llmResponse.text()};
    }
  );

  try {
    return await insightsFlow(input);
  } catch (error) {
    console.error('Error in generateManufacturingInsights:', error);
    return {
      improvementSuggestions: `Failed to generate insights. Error: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}
