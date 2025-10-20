
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
    const prompt = `You are an AI assistant specialized in creating comprehensive, in-depth executive summaries for business intelligence dashboards. Analyze the provided JSON data and generate a detailed, well-structured, and insightful report for a management audience.
    
Your report should include:
1.  **High-Level Overview**: A paragraph summarizing the most critical findings.
2.  **Key Performance Indicators (KPIs)**: A detailed breakdown of significant metrics, explaining what they mean and why they are important.
3.  **Identified Trends**: A section on positive and negative trends, with data-driven explanations.
4.  **Strategic Recommendations**: Actionable recommendations based on the data to capitalize on strengths and address weaknesses.
5.  **Future Outlook**: A brief forecast based on the current data trends.

Analyze the following data:
${input.reportData}

Generate a comprehensive and elaborate summary.`;

    const response = await aiClient.chat.completions.create({
      model: textModel,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
      top_p: 1,
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
