
'use server';
/**
 * @fileoverview A Genkit flow that predicts vehicle failures from sensor data and maintenance logs.
 */
import {
  PredictVehicleFailureInput,
  PredictVehicleFailureInputSchema,
  PredictVehicleFailureOutput,
  PredictVehicleFailureOutputSchema,
} from '@/ai/types';
import { ai } from '@/ai/genkit';

const predictionPrompt = ai.definePrompt(
  {
    name: 'predictVehicleFailure',
    input: { schema: PredictVehicleFailureInputSchema },
    output: { schema: PredictVehicleFailureOutputSchema },
    prompt: `You are an AI diagnosis agent specializing in predicting vehicle failures.
Analyze the provided sensor data and maintenance logs for vehicle ID {{vehicleId}} to predict potential failures.

Sensor Data: {{sensorDataJson}}
Maintenance Logs: {{maintenanceLogs}}

Based on your analysis, predict potential failures, assign a priority (HIGH, MEDIUM, LOW) to each, and suggest actions to mitigate the failures. Include a confidence score (0-1) for each prediction.

Output a JSON object that conforms to the schema.`,
  },
);

const predictionFlow = ai.defineFlow({
    name: 'predictionFlow',
    inputSchema: PredictVehicleFailureInputSchema,
    outputSchema: PredictVehicleFailureOutputSchema,
}, async (input) => {
    const result = await predictionPrompt(input);
    return result;
});


export async function predictVehicleFailure(
  input: PredictVehicleFailureInput
): Promise<PredictVehicleFailureOutput> {
  try {
    const result = await predictionFlow(input);
    return result;
  } catch (error) {
    console.error("Error in predictVehicleFailure:", error);
    return {
      predictedFailures: [
        {
          component: "System",
          failureType: "Analysis Error",
          priority: "HIGH",
          confidence: 1.0,
          suggestedActions: `An unexpected error occurred: ${error instanceof Error ? error.message : String(error)}`,
        }
      ],
    };
  }
}
