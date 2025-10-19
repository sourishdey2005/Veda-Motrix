
'use server';
/**
 * @fileoverview A Genkit flow that predicts vehicle failures from sensor data and maintenance logs.
 */
import {
  PredictVehicleFailureInput,
  PredictVehicleFailureInputSchema,
  PredictVehicleFailureOutput,
  PredictVehicleFailureOutputSchema,
  PredictedFailure,
} from '@/ai/types';
import { ai } from '@/ai/genkit';
import { z } from 'zod';


const predictFailurePrompt = ai.definePrompt(
  {
    name: 'predictFailurePrompt',
    input: { schema: PredictVehicleFailureInputSchema },
    output: { schema: PredictVehicleFailureOutputSchema },
    model: 'googleai/gemini-1.5-flash-latest',
    prompt: `You are an AI diagnosis agent specializing in predicting vehicle failures.
Analyze the provided sensor data and maintenance logs for vehicle ID {{{vehicleId}}} to predict up to 3 potential failures. For each prediction, provide the component, failure type, priority (HIGH, MEDIUM, LOW), confidence score (0.0-1.0), and suggested actions.

Sensor Data: {{{sensorDataJson}}}
Maintenance Logs: {{{maintenanceLogs}}}

Respond in the format defined by the output schema.
`,
  },
);

const predictVehicleFailureFlow = ai.defineFlow(
  {
    name: 'predictVehicleFailureFlow',
    inputSchema: PredictVehicleFailureInputSchema,
    outputSchema: PredictVehicleFailureOutputSchema,
  },
  async (input) => {
    const { output } = await predictFailurePrompt(input);
    if (!output) {
      throw new Error('Prediction failed: AI did not return a structured response.');
    }
    return output;
  }
);


export async function predictVehicleFailure(
  input: PredictVehicleFailureInput
): Promise<PredictVehicleFailureOutput> {
  try {
    return await predictVehicleFailureFlow(input);
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
