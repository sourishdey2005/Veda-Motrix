
'use server';
/**
 * @fileoverview A Genkit flow that generates manufacturing insights from service data.
 */
import {
  GenerateManufacturingInsightsInput,
  GenerateManufacturingInsightsInputSchema,
  GenerateManufacturingInsightsOutput,
  GenerateManufacturingInsightsOutputSchema,
} from '@/ai/types';
import { ai } from '@/ai/genkit';

const insightsPrompt = ai.definePrompt(
  {
    name: 'generateManufacturingInsights',
    input: { schema: GenerateManufacturingInsightsInputSchema },
    output: { schema: GenerateManufacturingInsightsOutputSchema },
    prompt: `You are a manufacturing insights expert. Analyze the following service data and generate improvement suggestions for RCA/CAPA.

Service Data: {{serviceData}}

Provide clear, actionable improvement suggestions.

Output a JSON object that conforms to the schema.`,
  },
);

const insightsFlow = ai.defineFlow({
    name: 'insightsFlow',
    inputSchema: GenerateManufacturingInsightsInputSchema,
    outputSchema: GenerateManufacturingInsightsOutputSchema,
}, async (input) => {
    const result = await insightsPrompt(input);
    return result;
});

export async function generateManufacturingInsights(
  input: GenerateManufacturingInsightsInput
): Promise<GenerateManufacturingInsightsOutput> {
  try {
    const result = await insightsFlow(input);
    return result;
  } catch (error) {
    console.error("Error in generateManufacturingInsights:", error);
    return {
      improvementSuggestions: `Failed to generate insights. Error: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
