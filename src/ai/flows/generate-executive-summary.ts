'use server';
/**
 * @fileoverview A flow that generates an executive summary from business intelligence data.
 */
import { genAI } from '@/ai/genkit';
import {
  GenerateExecutiveSummaryInput,
  GenerateExecutiveSummaryOutput,
} from '@/ai/types';

export async function generateExecutiveSummary(
  input: GenerateExecutiveSummaryInput
): Promise<GenerateExecutiveSummaryOutput> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `You are an AI assistant specialized in creating executive summaries for business intelligence dashboards. Analyze the provided JSON data and generate a clear, concise, and insightful summary in plain text for a management audience.
Focus on key takeaways, trends, and significant metrics.

Analyze the following data:
${input.reportData}

Generate a summary that highlights the most important findings. Structure it with a brief overview, followed by 2-3 bullet points on key areas (e.g., ROI, System Reliability, Cost Reduction).`;

    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    return { summary };
  } catch (error) {
    console.error('Error in generateExecutiveSummary:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      summary: `Failed to generate summary. Error: ${errorMessage}`,
    };
  }
}
