'use server';

import {ai} from '@/ai/genkit';
import {
  GenerateExecutiveSummaryInputSchema,
  GenerateExecutiveSummaryOutputSchema,
  type GenerateExecutiveSummaryInput,
  type GenerateExecutiveSummaryOutput,
} from '@/ai/types';

const prompt = ai.definePrompt(
  {
    name: 'executiveSummaryPrompt',
    input: {schema: GenerateExecutiveSummaryInputSchema},
    output: {schema: GenerateExecutiveSummaryOutputSchema},
    prompt: `You are an AI assistant specialized in creating executive summaries for business intelligence dashboards. Your task is to analyze the provided JSON data and generate a clear, concise, and insightful summary for a management audience.
    Focus on key takeaways, trends, and significant metrics.

    Analyze the following data:
    {{{reportData}}}

    Generate a summary that highlights the most important findings. Structure it with a brief overview, followed by 2-3 bullet points on key areas (e.g., ROI, System Reliability, Cost Reduction).
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

const generateExecutiveSummaryFlow = ai.defineFlow(
  {
    name: 'generateExecutiveSummaryFlow',
    inputSchema: GenerateExecutiveSummaryInputSchema,
    outputSchema: GenerateExecutiveSummaryOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('AI failed to generate a response.');
    }
    return output;
  }
);

export async function generateExecutiveSummary(
  input: GenerateExecutiveSummaryInput
): Promise<GenerateExecutiveSummaryOutput> {
  return generateExecutiveSummaryFlow(input);
}
