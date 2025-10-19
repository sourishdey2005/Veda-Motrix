
'use server';
/**
 * @fileoverview A Genkit flow that generates manufacturing insights from service data.
 */
import {ai} from '@/ai/genkit';
import {
  GenerateManufacturingInsightsInput,
  GenerateManufacturingInsightsInputSchema,
  GenerateManufacturingInsightsOutput,
  GenerateManufacturingInsightsOutputSchema,
} from '@/ai/types';
import {z} from 'zod';

export async function generateManufacturingInsights(
  input: GenerateManufacturingInsightsInput
): Promise<GenerateManufacturingInsightsOutput> {
  const prompt = ai.definePrompt(
    {
      name: 'manufacturingInsightsPrompt',
      input: {schema: GenerateManufacturingInsightsInputSchema},
      output: {schema: GenerateManufacturingInsightsOutputSchema},
      prompt: `You are a manufacturing insights expert. Analyze the following service data and generate improvement suggestions for RCA/CAPA.

Service Data: {{serviceData}}

Provide clear, actionable improvement suggestions.
`,
    },
async input => {
      const {output} = await ai.generate({
        prompt: input,
        model: 'googleai/gemini-1.5-flash',
        config: {
          output: {
            format: 'json',
            schema: GenerateManufacturingInsightsOutputSchema,
          },
        },
      });
      return output!;
    }
  );
  return prompt(input);
}
