
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
    const prompt = `You are a manufacturing insights expert. Analyze the following service data and generate clear, actionable improvement suggestions for RCA/CAPA.

Service Data: ${input.serviceData}`;

    const response = await aiClient.chat.completions({
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
