'use server';

/**
 * @fileOverview Manufacturing Insights Agent Flow.
 *
 * This flow generates improvement suggestions for RCA/CAPA based on service data.
 * It takes service data as input and returns manufacturing improvement suggestions.
 *
 * @fileExport {function} generateManufacturingInsights - The main function to generate manufacturing insights.
 * @fileExport {type} GenerateManufacturingInsightsInput - The input type for the generateManufacturingInsights function.
 * @fileExport {type} GenerateManufacturingInsightsOutput - The output type for the generateManufacturingInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateManufacturingInsightsInputSchema = z.object({
  serviceData: z
    .string()
    .describe('Service data including failure reports, component issues, and service history.'),
});
export type GenerateManufacturingInsightsInput = z.infer<
  typeof GenerateManufacturingInsightsInputSchema
>;

const GenerateManufacturingInsightsOutputSchema = z.object({
  improvementSuggestions: z
    .string()
    .describe(
      'Improvement suggestions for RCA/CAPA based on the service data provided.'
    ),
});
export type GenerateManufacturingInsightsOutput = z.infer<
  typeof GenerateManufacturingInsightsOutputSchema
>;

const generateManufacturingInsightsPrompt = ai.definePrompt({
  name: 'generateManufacturingInsightsPrompt',
  input: {schema: GenerateManufacturingInsightsInputSchema},
  output: {schema: GenerateManufacturingInsightsOutputSchema},
  prompt: `You are a manufacturing insights expert. Analyze the following service data and generate improvement suggestions for RCA/CAPA.

Service Data: {{{serviceData}}}

Provide clear, actionable improvement suggestions.
`,
});

const generateManufacturingInsightsFlow = ai.defineFlow(
  {
    name: 'generateManufacturingInsightsFlow',
    inputSchema: GenerateManufacturingInsightsInputSchema,
    outputSchema: GenerateManufacturingInsightsOutputSchema,
  },
  async input => {
    const {output} = await generateManufacturingInsightsPrompt(input);
    return output!;
  }
);

export async function generateManufacturingInsights(
  input: GenerateManufacturingInsightsInput
): Promise<GenerateManufacturingInsightsOutput> {
  return generateManufacturingInsightsFlow(input);
}
