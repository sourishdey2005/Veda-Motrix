'use server';

import {ai} from '@/ai/genkit';
import {
  GenerateManufacturingInsightsInputSchema,
  GenerateManufacturingInsightsOutputSchema,
  type GenerateManufacturingInsightsInput,
  type GenerateManufacturingInsightsOutput,
} from '@/ai/types';

const prompt = ai.definePrompt(
  {
    name: 'manufacturingInsightsPrompt',
    input: {schema: GenerateManufacturingInsightsInputSchema},
    output: {schema: GenerateManufacturingInsightsOutputSchema},
    prompt: `You are a manufacturing insights expert. Analyze the following service data and generate improvement suggestions for RCA/CAPA.

    Service Data: {{{serviceData}}}

    Provide clear, actionable improvement suggestions.
  `,
  },
  async (input) => {
    return {
      model: 'googleai/gemini-1.5-flash',
      output: {
        format: 'json',
      },
    };
  }
);

const generateManufacturingInsightsFlow = ai.defineFlow(
  {
    name: 'generateManufacturingInsightsFlow',
    inputSchema: GenerateManufacturingInsightsInputSchema,
    outputSchema: GenerateManufacturingInsightsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('AI failed to generate a response.');
    }
    return output;
  }
);

export async function generateManufacturingInsights(
  input: GenerateManufacturingInsightsInput
): Promise<GenerateManufacturingInsightsOutput> {
  return generateManufacturingInsightsFlow(input);
}
