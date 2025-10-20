
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

const predictFailureFlow = ai.defineFlow(
  {
    name: 'predictFailureFlow',
    inputSchema: PredictVehicleFailureInputSchema,
    outputSchema: PredictVehicleFailureOutputSchema,
  },
  async (input: PredictVehicleFailureInput): Promise<PredictVehicleFailureOutput> => {
    const llmResponse = await ai.generate({
      model: 'gemini-pro',
      prompt: `You are an AI diagnosis agent specializing in predicting vehicle failures.
Analyze the provided sensor data and maintenance logs to predict up to 3 potential failures. For each prediction, provide the component, failure type, priority (HIGH, MEDIUM, LOW), confidence score (0.0-1.0), and suggested actions. Respond with a valid JSON object matching the requested schema.

Vehicle ID ${input.vehicleId}
Sensor Data (JSON): ${input.sensorDataJson}
Maintenance Logs: ${input.maintenanceLogs}
`,
      output: {
        schema: PredictVehicleFailureOutputSchema,
      },
    });

    const result = llmResponse.output;
    if (result) {
        return result;
    }

    // Fallback parsing if structured output fails
    try {
        const parsed = PredictVehicleFailureOutputSchema.parse(JSON.parse(llmResponse.text));
        return parsed;
    } catch(e) {
        console.error("Failed to get structured output or parse text for vehicle failure", e);
        return {
            predictedFailures: [
                {
                    component: 'System',
                    failureType: 'Analysis Error',
                    priority: 'HIGH',
                    confidence: 1.0,
                    suggestedActions: 'The AI failed to return a valid response. Please try again.',
                },
            ],
        };
    }
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
