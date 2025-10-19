
'use server';
/**
 * @fileoverview An AI flow that predicts vehicle failures from sensor data and maintenance logs.
 */
import {
  PredictVehicleFailureInput,
  PredictVehicleFailureInputSchema,
  PredictVehicleFailureOutput,
  PredictVehicleFailureOutputSchema,
} from '@/ai/types';
import {ai} from '@/ai/genkit';
import {z} from 'zod';

export async function predictVehicleFailure(
  input: PredictVehicleFailureInput
): Promise<PredictVehicleFailureOutput> {
  const predictionFlow = ai.defineFlow(
    {
      name: 'vehicleFailurePredictionFlow',
      inputSchema: PredictVehicleFailureInputSchema,
      outputSchema: PredictVehicleFailureOutputSchema,
    },
    async ({vehicleId, sensorDataJson, maintenanceLogs}) => {
      const llmResponse = await ai.generate({
        model: 'gemini-1.5-flash-latest',
        prompt: `You are an AI diagnosis agent specializing in predicting vehicle failures.
Analyze the provided sensor data and maintenance logs to predict up to 3 potential failures. For each prediction, provide the component, failure type, priority (HIGH, MEDIUM, LOW), confidence score (0.0-1.0), and suggested actions.

Vehicle ID ${vehicleId}
Sensor Data (JSON): ${sensorDataJson}
Maintenance Logs: ${maintenanceLogs}
`,
        output: {
          schema: PredictVehicleFailureOutputSchema,
        },
      });
      return llmResponse.output()!;
    }
  );

  try {
    return await predictionFlow(input);
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
