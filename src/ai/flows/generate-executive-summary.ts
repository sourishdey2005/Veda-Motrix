
'use server';
/**
 * @fileoverview A flow that generates an executive summary from business intelligence data.
 */
import { aiClient, textModel } from '@/ai/genkit';
import {
  GenerateExecutiveSummaryInput,
  GenerateExecutiveSummaryOutput,
} from '@/ai/types';

export async function generateExecutiveSummary(
  input: GenerateExecutiveSummaryInput
): Promise<GenerateExecutiveSummaryOutput> {
  try {
    const prompt = `You are an AI assistant specialized in creating executive summaries for business intelligence dashboards. Analyze the provided JSON data and generate a clear, concise, and insightful summary in plain text for a management audience.
Focus on key takeaways, trends, and significant metrics.

Analyze the following data:
${input.reportData}

Generate a summary that highlights the most important findings. Structure it with a brief overview, followed by 2-3 bullet points on key areas (e.g., ROI, System Reliability, Cost Reduction).`;

    const response = await aiClient.chat({
      model: textModel,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
      topP: 1,
    });

    const summary = response.choices[0]?.message?.content;

    return { summary: summary || "The AI could not generate a summary." };
  } catch (error) {
    console.error('Error in generateExecutiveSummary:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      summary: `Failed to generate summary. Error: ${errorMessage}`,
    };
  }
}
