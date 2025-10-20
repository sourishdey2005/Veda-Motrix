
'use server';
/**
 * @fileoverview An AI flow that predicts vehicle failures from sensor data and maintenance logs.
 */
import {
  PredictVehicleFailureInput,
  PredictVehicleFailureOutput,
  PredictVehicleFailureOutputSchema,
} from '@/ai/types';
import { openAiClient } from '@/ai/genkit';

export async function predictVehicleFailure(
  input: PredictVehicleFailureInput
): Promise<PredictVehicleFailureOutput> {
  try {
    const result = await openAiClient<PredictVehicleFailureInput, PredictVehicleFailureOutput>({
      prompt: `You are an AI diagnosis agent specializing in predicting vehicle failures.
Analyze the provided sensor data and maintenance logs to predict up to 3 potential failures. For each prediction, provide the component, failure type, priority (HIGH, MEDIUM, LOW), confidence score (0.0-1.0), and suggested actions.

Vehicle ID ${input.vehicleId}
Sensor Data (JSON): ${input.sensorDataJson}
Maintenance Logs: ${input.maintenanceLogs}
`,
      response_model: {
        schema: PredictVehicleFailureOutputSchema,
        name: 'PredictVehicleFailureOutput',
      },
    });

    if (typeof result === 'string' || !result) {
        throw new Error('AI returned an invalid response format.');
    }
    
    return result;

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
