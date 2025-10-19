
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
import { openai } from '@/ai/client';
import { z } from 'zod';

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

export async function generateManufacturingInsights(
  input: GenerateManufacturingInsightsInput
): Promise<GenerateManufacturingInsightsOutput> {
    const prompt = `You are a manufacturing insights expert. Analyze the following service data and generate improvement suggestions for RCA/CAPA.

    Service Data: ${input.serviceData}

    Provide clear, actionable improvement suggestions as a single string.`;

    const completion = await openai.chat.completions.create({
        model: 'openrouter/auto',
        messages: [{ role: 'user', content: prompt }],
    });

    const improvementSuggestions = completion.choices[0].message?.content;
    if (!improvementSuggestions) {
        throw new Error('AI failed to generate a response.');
    }

    return { improvementSuggestions };
}
