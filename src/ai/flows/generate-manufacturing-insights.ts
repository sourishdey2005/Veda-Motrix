
'use server';
/**
 * @fileoverview An AI flow that generates manufacturing insights from service data.
 */
import { aiClient, textModel } from '@/ai/genkit';
import {
  GenerateManufacturingInsightsInput,
  GenerateManufacturingInsightsOutput,
} from '@/ai/types';

export async function generateManufacturingInsights(
  input: GenerateManufacturingInsightsInput
): Promise<GenerateManufacturingInsightsOutput> {
  try {
    const prompt = `You are a manufacturing insights expert. Analyze the following service data and generate a detailed and elaborate report with clear, actionable improvement suggestions for RCA/CAPA (Root Cause Analysis / Corrective and Preventive Action).

Your report should include:
1.  **Trend Identification**: Identify recurring failure patterns or component issues from the data.
2.  **Root Cause Hypothesis**: For each trend, propose a potential root cause in the manufacturing or design process.
3.  **Detailed CAPA Suggestions**: Provide specific, actionable steps for the engineering and manufacturing teams to investigate and resolve the issue.
4.  **Predicted Impact**: Estimate the potential impact of implementing your suggestions (e.g., cost savings, failure rate reduction).

Service Data: ${input.serviceData}`;

    const response = await aiClient.chat.completions.create({
      model: textModel,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
      top_p: 1,
    });

    const improvementSuggestions = response.choices[0]?.message?.content;

    return { improvementSuggestions: improvementSuggestions || "The AI could not generate any insights." };
  } catch (error) {
    console.error('Error in generateManufacturingInsights:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      improvementSuggestions: `Failed to generate insights. Error: ${errorMessage}`,
    };
  }
}
