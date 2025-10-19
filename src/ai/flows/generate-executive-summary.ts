
'use server';
/**
 * @fileoverview A Genkit flow that generates an executive summary from business intelligence data.
 */
import {
  GenerateExecutiveSummaryInput,
  GenerateExecutiveSummaryOutput,
} from '@/ai/types';
import { ai } from '@/ai/genkit';

export async function generateExecutiveSummary(
  input: GenerateExecutiveSummaryInput
): Promise<GenerateExecutiveSummaryOutput> {
  try {
    const prompt = `You are an AI assistant specialized in creating executive summaries for business intelligence dashboards. Analyze the provided JSON data and generate a clear, concise, and insightful summary in plain text for a management audience.
Focus on key takeaways, trends, and significant metrics.

Analyze the following data:
${input.reportData}

Generate a summary that highlights the most important findings. Structure it with a brief overview, followed by 2-3 bullet points on key areas (e.g., ROI, System Reliability, Cost Reduction). Do not wrap the output in JSON or Markdown.
`;
    const { output } = await ai.generate({
      model: 'googleai/gemini-1.5-flash-latest',
      prompt: prompt,
    });

    if (!output || !output.text) {
      throw new Error('No output from AI');
    }
    return { summary: output.text };
  } catch (error) {
    console.error("Error in generateExecutiveSummary:", error);
    return {
      summary: `Failed to generate summary. Error: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
