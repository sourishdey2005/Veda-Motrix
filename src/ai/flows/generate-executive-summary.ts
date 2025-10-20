
'use server';
/**
 * @fileoverview A flow that generates an executive summary from business intelligence data.
 */
import {ai} from '@/ai/genkit';
import {z} from 'zod';
import {
  GenerateExecutiveSummaryInput,
  GenerateExecutiveSummaryInputSchema,
  GenerateExecutiveSummaryOutput,
  GenerateExecutiveSummaryOutputSchema,
} from '@/ai/types';

const executiveSummaryFlow = ai.defineFlow(
  {
    name: 'executiveSummaryFlow',
    inputSchema: GenerateExecutiveSummaryInputSchema,
    outputSchema: GenerateExecutiveSummaryOutputSchema,
  },
  async (input: GenerateExecutiveSummaryInput) => {
    const llmResponse = await ai.generate({
      model: 'gemini-pro',
      prompt: `You are an AI assistant specialized in creating executive summaries for business intelligence dashboards. Analyze the provided JSON data and generate a clear, concise, and insightful summary in plain text for a management audience.
Focus on key takeaways, trends, and significant metrics.

Analyze the following data:
${input.reportData}

Generate a summary that highlights the most important findings. Structure it with a brief overview, followed by 2-3 bullet points on key areas (e.g., ROI, System Reliability, Cost Reduction).`,
    });

    return {summary: llmResponse.text};
  }
);

export async function generateExecutiveSummary(
  input: GenerateExecutiveSummaryInput
): Promise<GenerateExecutiveSummaryOutput> {
  try {
    return await executiveSummaryFlow(input);
  } catch (error) {
    console.error('Error in generateExecutiveSummary:', error);
    return {
      summary: `Failed to generate summary. Error: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}
