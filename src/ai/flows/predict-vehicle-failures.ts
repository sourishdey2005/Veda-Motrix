
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
import { z } from 'zod';

export async function predictVehicleFailure(
  input: PredictVehicleFailureInput
): Promise<PredictVehicleFailureOutput> {
  try {
    const prompt = `You are an AI diagnosis agent specializing in predicting vehicle failures.
Analyze the provided sensor data and maintenance logs for vehicle ID ${input.vehicleId} to predict up to 3 potential failures. For each prediction, provide the component, failure type, priority (HIGH, MEDIUM, LOW), confidence score (0.0-1.0), and suggested actions.

Sensor Data (JSON): ${input.sensorDataJson}
Maintenance Logs: ${input.maintenanceLogs}

Respond with a JSON object that matches this Zod schema:
${JSON.stringify({predictedFailures: PredictVehicleFailureOutputSchema.shape.predictedFailures}, null, 2)}
`;

    const rawResponse = await openAiClient(prompt, [], true);
    const parsedResponse = JSON.parse(rawResponse);
    
    // Validate the response against the schema
    const validation = PredictVehicleFailureOutputSchema.safeParse(parsedResponse);
    if (!validation.success) {
        console.error("AI response validation failed:", validation.error);
        throw new Error("The AI returned data in an unexpected format.");
    }
    
    return validation.data;

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
