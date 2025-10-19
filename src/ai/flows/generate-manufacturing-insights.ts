
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

const manufacturingInsightsPrompt = ai.definePrompt({
  name: 'manufacturingInsightsPrompt',
  input: {schema: GenerateManufacturingInsightsInputSchema},
  output: {schema: GenerateManufacturingInsightsOutputSchema},
  prompt: `You are a manufacturing insights expert. Analyze the following service data and generate improvement suggestions for RCA/CAPA.

Service Data: {{serviceData}}

Provide clear, actionable improvement suggestions.
`,
});

export async function generateManufacturingInsights(
  input: GenerateManufacturingInsightsInput
): Promise<GenerateManufacturingInsightsOutput> {
  const {output} = await ai.generate({
    prompt: manufacturingInsightsPrompt(input),
    model: 'googleai/gemini-pro',
    config: {
      output: {
        format: 'json',
        schema: GenerateManufacturingInsightsOutputSchema,
      },
    },
  });
  return output!;
}
