
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
import { z } from 'zod';

const generateInsightsPrompt = ai.definePrompt(
  {
    name: 'generateInsightsPrompt',
    input: { schema: GenerateManufacturingInsightsInputSchema },
    output: { schema: GenerateManufacturingInsightsOutputSchema },
    model: 'googleai/gemini-1.5-flash-latest',
    prompt: `You are a manufacturing insights expert. Analyze the following service data and generate clear, actionable improvement suggestions for RCA/CAPA.

Service Data: {{{serviceData}}}
`,
  },
);

const generateManufacturingInsightsFlow = ai.defineFlow(
  {
    name: 'generateManufacturingInsightsFlow',
    inputSchema: GenerateManufacturingInsightsInputSchema,
    outputSchema: GenerateManufacturingInsightsOutputSchema,
  },
  async (input) => {
    const { output } = await generateInsightsPrompt(input);
    if (!output) {
      throw new Error('Insight generation failed: AI did not return a structured response.');
    }
    return output;
  }
);


export async function generateManufacturingInsights(
  input: GenerateManufacturingInsightsInput
): Promise<GenerateManufacturingInsightsOutput> {
  try {
    return await generateManufacturingInsightsFlow(input);
  } catch (error) {
    console.error("Error in generateManufacturingInsights:", error);
    return {
      improvementSuggestions: `Failed to generate insights. Error: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
