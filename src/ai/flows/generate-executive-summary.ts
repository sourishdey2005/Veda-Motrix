
'use server';
/**
 * @fileoverview A Genkit flow that generates an executive summary from business intelligence data.
 */
import {
  GenerateExecutiveSummaryInput,
  GenerateExecutiveSummaryOutput,
  GenerateExecutiveSummaryOutputSchema,
} from '@/ai/types';
import { ai } from '@/ai/genkit';
import { z } from 'zod';

export async function generateExecutiveSummary(
  input: GenerateExecutiveSummaryInput
): Promise<GenerateExecutiveSummaryOutput> {
  try {
    const prompt = `You are an AI assistant specialized in creating executive summaries for business intelligence dashboards. Your task is to analyze the provided JSON data and generate a clear, concise, and insightful summary for a management audience.
Focus on key takeaways, trends, and significant metrics.

Analyze the following data:
${input.reportData}

Generate a summary that highlights the most important findings. Structure it with a brief overview, followed by 2-3 bullet points on key areas (e.g., ROI, System Reliability, Cost Reduction).

Output a JSON object that conforms to the following Zod schema:
${JSON.stringify(GenerateExecutiveSummaryOutputSchema.shape)}
`;
    const { output } = await ai.generate({
      model: 'googleai/gemini-pro',
      prompt: prompt,
      output: {
        format: 'json',
        schema: GenerateExecutiveSummaryOutputSchema,
      },
    });

    if (!output) {
      throw new Error('No output from AI');
    }
    return output;
  } catch (error) {
    console.error("Error in generateExecutiveSummary:", error);
    return {
      summary: `Failed to generate summary. Error: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
