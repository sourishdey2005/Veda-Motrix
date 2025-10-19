
'use server';

/**
 * @fileOverview Manufacturing Insights Agent Flow.
 */
import openai from '@/ai/client';

export interface GenerateManufacturingInsightsInput {
  serviceData: string;
}

export interface GenerateManufacturingInsightsOutput {
  improvementSuggestions: string;
}

export async function generateManufacturingInsights(
  input: GenerateManufacturingInsightsInput
): Promise<GenerateManufacturingInsightsOutput> {
  const prompt = `You are a manufacturing insights expert. Analyze the following service data and generate improvement suggestions for RCA/CAPA.

    Service Data: ${input.serviceData}

    Provide clear, actionable improvement suggestions.
    Return a JSON object with the following structure: { "improvementSuggestions": "string" }.
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const responseJson = completion.choices[0].message?.content;
    if (!responseJson) {
      throw new Error('AI failed to generate a response.');
    }
    return JSON.parse(responseJson) as GenerateManufacturingInsightsOutput;
  } catch (error) {
    console.error('Error in generateManufacturingInsights:', error);
    throw new Error('Failed to generate manufacturing insights.');
  }
}
