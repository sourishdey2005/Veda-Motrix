
'use server';
/**
 * @fileoverview An AI flow that generates manufacturing insights from service data.
 */
import { aiClient, textModel } from '@/ai/client';
import { isUnexpected } from '@azure-rest/ai-inference';
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

    const response = await aiClient.path("/chat/completions").post({
      body: {
        model: textModel,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.6,
        top_p: 1,
      }
    });

    if (isUnexpected(response)) {
      const errorBody = response.body as any;
      throw new Error(errorBody?.error?.message || 'An unexpected error occurred.');
    }

    const improvementSuggestions = response.body.choices[0]?.message?.content;

    return { improvementSuggestions: improvementSuggestions || "The AI could not generate any insights." };
  } catch (error) {
    console.error('Error in generateManufacturingInsights:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      improvementSuggestions: `Failed to generate insights. Error: ${errorMessage}`,
    };
  }
}
