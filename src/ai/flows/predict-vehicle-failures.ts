
'use server';
/**
 * @fileoverview A Genkit flow that predicts vehicle failures from sensor data and maintenance logs.
 */
import {
  PredictVehicleFailureInput,
  PredictVehicleFailureOutput,
  PredictVehicleFailureOutputSchema,
} from '@/ai/types';
import { ai } from '@/ai/genkit';
import { z } from 'zod';

export async function predictVehicleFailure(
  input: PredictVehicleFailureInput
): Promise<PredictVehicleFailureOutput> {
  try {
    const prompt = `You are an AI diagnosis agent specializing in predicting vehicle failures.
Analyze the provided sensor data and maintenance logs for vehicle ID ${input.vehicleId} to predict potential failures.

Sensor Data: ${input.sensorDataJson}
Maintenance Logs: ${input.maintenanceLogs}

Based on your analysis, predict potential failures, assign a priority (HIGH, MEDIUM, LOW) to each, and suggest actions to mitigate the failures. Include a confidence score (0-1) for each prediction.

Output a JSON object that conforms to the following Zod schema:
${JSON.stringify(PredictVehicleFailureOutputSchema.shape)}
`;

    const { output } = await ai.generate({
      model: 'googleai/gemini-pro',
      prompt: prompt,
      output: {
        format: 'json',
        schema: PredictVehicleFailureOutputSchema,
      },
    });

    if (!output) {
      throw new Error('No output from AI');
    }
    return output;
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
