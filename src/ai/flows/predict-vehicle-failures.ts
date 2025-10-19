
'use server';

/**
 * @fileOverview AI agent for predicting potential vehicle failures and assigning priority levels.
 *
 * - predictVehicleFailure - Function to predict vehicle failures based on sensor data.
 * - PredictVehicleFailureInput - Input type for the predictVehicleFailure function.
 * - PredictVehicleFailureOutput - Output type for the predictVehicleFailure function.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const PredictVehicleFailureInputSchema = z.object({
  vehicleId: z.string().describe('The ID of the vehicle to analyze.'),
  sensorData: z.record(z.number()).describe('A record of sensor readings for the vehicle.'),
  maintenanceLogs: z.string().describe('Maintenance history for the vehicle'),
});
export type PredictVehicleFailureInput = z.infer<typeof PredictVehicleFailureInputSchema>;

export const PredictVehicleFailureOutputSchema = z.object({
  predictedFailures: z.array(
    z.object({
      component: z.string().describe('The component predicted to fail.'),
      failureType: z.string().describe('The type of failure predicted.'),
      priority: z.enum(['HIGH', 'MEDIUM', 'LOW']).describe('The priority of the predicted failure.'),
      confidence: z.number().describe('Confidence level of the prediction (0-1).'),
      suggestedActions: z.string().describe('Suggested actions to mitigate the failure.'),
    })
  ).describe('A list of predicted vehicle failures.'),
});
export type PredictVehicleFailureOutput = z.infer<typeof PredictVehicleFailureOutputSchema>;

const predictVehicleFailurePromptInputSchema = z.object({
    vehicleId: z.string(),
    sensorDataJson: z.string(),
    maintenanceLogs: z.string()
});

const failurePredictionPrompt = ai.definePrompt({
    name: 'predictVehicleFailurePrompt',
    input: { schema: predictVehicleFailurePromptInputSchema },
    output: { schema: PredictVehicleFailureOutputSchema },
    prompt: `You are an AI diagnosis agent specializing in predicting vehicle failures.

    Analyze the provided sensor data and maintenance logs for vehicle ID {{{vehicleId}}} to predict potential failures.

    Sensor Data: {{{sensorDataJson}}}
    Maintenance Logs: {{{maintenanceLogs}}}

    Based on your analysis, predict potential failures, assign a priority (HIGH, MEDIUM, LOW) to each, and suggest actions to mitigate the failures. Include a confidence score (0-1) for each prediction.`
});

const predictVehicleFailureFlow = ai.defineFlow({
    name: 'predictVehicleFailureFlow',
    inputSchema: PredictVehicleFailureInputSchema,
    outputSchema: PredictVehicleFailureOutputSchema,
}, async (input) => {
    const { output } = await failurePredictionPrompt({
        vehicleId: input.vehicleId,
        sensorDataJson: JSON.stringify(input.sensorData, null, 2),
        maintenanceLogs: input.maintenanceLogs
    });
    if (!output) {
        throw new Error('AI failed to generate a response.');
    }
    return output;
});

export async function predictVehicleFailure(input: PredictVehicleFailureInput): Promise<PredictVehicleFailureOutput> {
    return await predictVehicleFailureFlow(input);
}
