
'use server';
/**
 * @fileoverview An AI flow that predicts vehicle failures from sensor data and maintenance logs.
 */
import {
  PredictVehicleFailureInput,
  PredictVehicleFailureOutput,
  PredictVehicleFailureOutputSchema,
} from '@/ai/types';
import {openAiClient} from '@/ai/genkit';
import {z} from 'zod';

export async function predictVehicleFailure(
  input: PredictVehicleFailureInput
): Promise<PredictVehicleFailureOutput> {
  try {
    const systemPrompt = `You are an AI diagnosis agent specializing in predicting vehicle failures.
Analyze the provided sensor data and maintenance logs to predict up to 3 potential failures. For each prediction, provide the component, failure type, priority (HIGH, MEDIUM, LOW), confidence score (0.0-1.0), and suggested actions.

Respond with a JSON object that strictly follows this Zod schema. Do not include any extra text or formatting outside of the JSON object itself:
${JSON.stringify(
  PredictVehicleFailureOutputSchema.describe(),
  null,
  2
)}
`;

    const userPrompt = `Vehicle ID ${input.vehicleId}
Sensor Data (JSON): ${input.sensorDataJson}
Maintenance Logs: ${input.maintenanceLogs}
`;

    const messages = [
      {role: 'system' as const, content: systemPrompt},
      {role: 'user' as const, content: userPrompt},
    ];

    const rawResponse = await openAiClient(messages, true);
    const parsedResponse = JSON.parse(rawResponse);

    const validation =
      PredictVehicleFailureOutputSchema.safeParse(parsedResponse);
    if (!validation.success) {
      console.error('AI response validation failed:', validation.error);
      throw new Error('The AI returned data in an unexpected format.');
    }

    return validation.data;
  } catch (error) {
    console.error('Error in predictVehicleFailure:', error);
    return {
      predictedFailures: [
        {
          component: 'System',
          failureType: 'Analysis Error',
          priority: 'HIGH',
          confidence: 1.0,
          suggestedActions: `An unexpected error occurred: ${
            error instanceof Error ? error.message : String(error)
          }`,
        },
      ],
    };
  }
}
