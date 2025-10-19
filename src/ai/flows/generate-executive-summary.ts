
'use server';

/**
 * @fileOverview Generates an executive summary from a given JSON object of report data.
 *
 * - generateExecutiveSummary - Analyzes a JSON object and produces a concise summary.
 * - GenerateExecutiveSummaryInput - The input type for generateExecutiveSummary.
 * - GenerateExecutiveSummaryOutput - The return type for generateExecutiveSummary.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const GenerateExecutiveSummaryInputSchema = z.object({
  reportData: z
    .string()
    .describe('A JSON string containing the data to be summarized.'),
});
export type GenerateExecutiveSummaryInput = z.infer<
  typeof GenerateExecutiveSummaryInputSchema
>;

export const GenerateExecutiveSummaryOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A concise, well-structured executive summary of the provided data, formatted for a business audience.'
    ),
});
export type GenerateExecutiveSummaryOutput = z.infer<
  typeof GenerateExecutiveSummaryOutputSchema
>;

const summaryPrompt = ai.definePrompt({
    name: 'generateExecutiveSummaryPrompt',
    input: { schema: GenerateExecutiveSummaryInputSchema },
    output: { schema: GenerateExecutiveSummaryOutputSchema },
    prompt: `You are an AI assistant specialized in creating executive summaries for business intelligence dashboards. Your task is to analyze the provided JSON data and generate a clear, concise, and insightful summary for a management audience.

    Focus on key takeaways, trends, and significant metrics.

    Analyze the following data:

    {{{reportData}}}

    Generate a summary that highlights the most important findings. Structure it with a brief overview, followed by 2-3 bullet points on key areas (e.g., ROI, System Reliability, Cost Reduction).
`
});


const generateExecutiveSummaryFlow = ai.defineFlow({
    name: 'generateExecutiveSummaryFlow',
    inputSchema: GenerateExecutiveSummaryInputSchema,
    outputSchema: GenerateExecutiveSummaryOutputSchema,
}, async (input) => {
    const { output } = await summaryPrompt(input);
    if (!output) {
        throw new Error('AI failed to generate a response.');
    }
    return output;
});


export async function generateExecutiveSummary(
  input: GenerateExecutiveSummaryInput
): Promise<GenerateExecutiveSummaryOutput> {
  return await generateExecutiveSummaryFlow(input);
}
