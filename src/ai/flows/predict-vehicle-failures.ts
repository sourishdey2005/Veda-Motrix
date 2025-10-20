
'use server';
/**
 * @fileoverview An AI flow that predicts vehicle failures from sensor data and maintenance logs.
 */
import {ai} from '@/ai/genkit';
import {z} from 'zod';
import {
  PredictVehicleFailureInput,
  PredictVehicleFailureInputSchema,
  PredictVehicleFailureOutput,
  PredictVehicleFailureOutputSchema,
} from '@/ai/types';
import {gemini15Flash} from 'genkitx-googleai';

const predictFailureFlow = ai.defineFlow(
  {
    name: 'predictFailureFlow',
    inputSchema: PredictVehicleFailureInputSchema,
    outputSchema: PredictVehicleFailureOutputSchema,
  },
  async (input: PredictVehicleFailureInput) => {
    const llmResponse = await ai.generate({
      model: gemini15Flash,
      prompt: `You are an AI diagnosis agent specializing in predicting vehicle failures.
Analyze the provided sensor data and maintenance logs to predict up to 3 potential failures. For each prediction, provide the component, failure type, priority (HIGH, MEDIUM, LOW), confidence score (0.0-1.0), and suggested actions.

Vehicle ID ${input.vehicleId}
Sensor Data (JSON): ${input.sensorDataJson}
Maintenance Logs: ${input.maintenanceLogs}
`,
      output: {
        schema: PredictVehicleFailureOutputSchema,
      },
    });

    const result = llmResponse.output;
    if (!result) {
      throw new Error('AI returned an invalid response format.');
    }
    return result;
  }
);

export async function predictVehicleFailure(
  input: PredictVehicleFailureInput
): Promise<PredictVehicleFailureOutput> {
  try {
    return await predictFailureFlow(input);
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
