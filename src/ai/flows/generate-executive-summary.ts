
'use server';
/**
 * @fileoverview A Genkit flow that generates an executive summary from business intelligence data.
 */
import {
  GenerateExecutiveSummaryInput,
  GenerateExecutiveSummaryInputSchema,
  GenerateExecutiveSummaryOutput,
  GenerateExecutiveSummaryOutputSchema,
} from '@/ai/types';
import { ai } from '@/ai/genkit';
import { z } from 'zod';

const generateSummaryPrompt = ai.definePrompt(
  {
    name: 'generateSummaryPrompt',
    input: { schema: GenerateExecutiveSummaryInputSchema },
    output: { schema: GenerateExecutiveSummaryOutputSchema },
    model: 'googleai/gemini-1.5-flash-latest',
    prompt: `You are an AI assistant specialized in creating executive summaries for business intelligence dashboards. Analyze the provided JSON data and generate a clear, concise, and insightful summary in plain text for a management audience.
Focus on key takeaways, trends, and significant metrics.

Analyze the following data:
{{{reportData}}}

Generate a summary that highlights the most important findings. Structure it with a brief overview, followed by 2-3 bullet points on key areas (e.g., ROI, System Reliability, Cost Reduction).
`,
  },
);

const generateExecutiveSummaryFlow = ai.defineFlow(
  {
    name: 'generateExecutiveSummaryFlow',
    inputSchema: GenerateExecutiveSummaryInputSchema,
    outputSchema: GenerateExecutiveSummaryOutputSchema,
  },
  async (input) => {
    const { output } = await generateSummaryPrompt(input);
    if (!output) {
      throw new Error('Summary generation failed: AI did not return a structured response.');
    }
    return output;
  }
);

export async function generateExecutiveSummary(
  input: GenerateExecutiveSummaryInput
): Promise<GenerateExecutiveSummaryOutput> {
  try {
    return await generateExecutiveSummaryFlow(input);
  } catch (error) {
    console.error("Error in generateExecutiveSummary:", error);
    return {
      summary: `Failed to generate summary. Error: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
