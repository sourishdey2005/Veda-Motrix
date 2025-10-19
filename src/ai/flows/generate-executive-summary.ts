
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

const summaryPrompt = ai.definePrompt(
  {
    name: 'generateExecutiveSummary',
    input: { schema: GenerateExecutiveSummaryInputSchema },
    output: { schema: GenerateExecutiveSummaryOutputSchema },
    prompt: `You are an AI assistant specialized in creating executive summaries for business intelligence dashboards. Your task is to analyze the provided JSON data and generate a clear, concise, and insightful summary for a management audience.
Focus on key takeaways, trends, and significant metrics.

Analyze the following data:
{{reportData}}

Generate a summary that highlights the most important findings. Structure it with a brief overview, followed by 2-3 bullet points on key areas (e.g., ROI, System Reliability, Cost Reduction).

Output a JSON object that conforms to the schema.`,
  },
);

const summaryFlow = ai.defineFlow({
    name: 'summaryFlow',
    inputSchema: GenerateExecutiveSummaryInputSchema,
    outputSchema: GenerateExecutiveSummaryOutputSchema,
}, async (input) => {
    const result = await summaryPrompt(input);
    return result;
});


export async function generateExecutiveSummary(
  input: GenerateExecutiveSummaryInput
): Promise<GenerateExecutiveSummaryOutput> {
  try {
    const result = await summaryFlow(input);
    return result;
  } catch (error) {
    console.error("Error in generateExecutiveSummary:", error);
    return {
      summary: `Failed to generate summary. Error: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
