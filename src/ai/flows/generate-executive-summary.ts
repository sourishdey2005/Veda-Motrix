
'use server';
/**
 * @fileoverview A Genkit flow that generates an executive summary from business intelligence data.
 */
import {ai} from '@/ai/genkit';
import {
  GenerateExecutiveSummaryInput,
  GenerateExecutiveSummaryInputSchema,
  GenerateExecutiveSummaryOutput,
  GenerateExecutiveSummaryOutputSchema,
} from '@/ai/types';
import {z} from 'zod';

export async function generateExecutiveSummary(
  input: GenerateExecutiveSummaryInput
): Promise<GenerateExecutiveSummaryOutput> {
  const prompt = ai.definePrompt(
    {
      name: 'executiveSummaryPrompt',
      input: {schema: GenerateExecutiveSummaryInputSchema},
      output: {schema: GenerateExecutiveSummaryOutputSchema},
      prompt: `You are an AI assistant specialized in creating executive summaries for business intelligence dashboards. Your task is to analyze the provided JSON data and generate a clear, concise, and insightful summary for a management audience.
Focus on key takeaways, trends, and significant metrics.

Analyze the following data:
{{reportData}}

Generate a summary that highlights the most important findings. Structure it with a brief overview, followed by 2-3 bullet points on key areas (e.g., ROI, System Reliability, Cost Reduction).
`,
    },
    async input => {
      const {output} = await ai.generate({
        prompt: input,
        model: 'googleai/gemini-pro',
        config: {
          output: {
            format: 'json',
            schema: GenerateExecutiveSummaryOutputSchema,
          },
        },
      });
      return output!;
    }
  );
  return prompt(input);
}
