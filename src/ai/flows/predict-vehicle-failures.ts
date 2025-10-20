
'use server';
/**
 * @fileoverview An AI flow that predicts vehicle failures from sensor data and maintenance logs.
 */
import { aiClient, textModel } from '@/ai/genkit';
import {
  PredictVehicleFailureInput,
  PredictVehicleFailureOutput,
  PredictVehicleFailureOutputSchema,
} from '@/ai/types';

export async function predictVehicleFailure(
  input: PredictVehicleFailureInput
): Promise<PredictVehicleFailureOutput> {
  try {
    const prompt = `You are an AI diagnosis agent specializing in predicting vehicle failures.
Analyze the provided sensor data and maintenance logs to predict up to 3 potential failures. For each prediction, provide the component, failure type, priority (HIGH, MEDIUM, LOW), confidence score (0.0-1.0), and suggested actions. Respond with a valid JSON object matching this schema: ${JSON.stringify(PredictVehicleFailureOutputSchema.shape)}.

Vehicle ID ${input.vehicleId}
Sensor Data (JSON): ${input.sensorDataJson}
Maintenance Logs: ${input.maintenanceLogs}
`;

    const response = await aiClient.chat.completions({
      model: textModel,
      messages: [
        { role: 'system', content: 'You are a helpful assistant that only returns valid JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0,
      top_p: 1,
    });

    const message = response.choices[0]?.message?.content;
    if (!message) {
      throw new Error('AI returned an empty response.');
    }

    try {
      const parsed = PredictVehicleFailureOutputSchema.parse(JSON.parse(message));
      return parsed;
    } catch (e) {
      console.error("Failed to parse AI JSON response:", e);
      return {
        predictedFailures: [
          {
            component: 'System',
            failureType: 'Analysis Error',
            priority: 'HIGH',
            confidence: 1.0,
            suggestedActions: `AI returned an invalid response format. Raw response: ${message}`,
          },
        ],
      };
    }

  } catch (error) {
    console.error('Error in predictVehicleFailure:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      predictedFailures: [
        {
          component: 'System',
          failureType: 'Analysis Error',
          priority: 'HIGH',
          confidence: 1.0,
          suggestedActions: `An unexpected error occurred: ${errorMessage}`,
        },
      ],
    };
  }
}
