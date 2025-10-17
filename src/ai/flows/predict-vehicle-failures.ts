
'use server';

/**
 * @fileOverview AI agent for predicting potential vehicle failures and assigning priority levels.
 *
 * - predictVehicleFailure - Function to predict vehicle failures based on sensor data.
 * - PredictVehicleFailureInput - Input type for the predictVehicleFailure function.
 * - PredictVehicleFailureOutput - Output type for the predictVehicleFailure function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {z} from 'genkit';

const PredictVehicleFailureInputSchema = z.object({
  vehicleId: z.string().describe('The ID of the vehicle to analyze.'),
  sensorData: z.record(z.number()).describe('A record of sensor readings for the vehicle.'),
  maintenanceLogs: z.string().describe('Maintenance history for the vehicle'),
});
export type PredictVehicleFailureInput = z.infer<typeof PredictVehicleFailureInputSchema>;

const PredictVehicleFailureOutputSchema = z.object({
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

export async function predictVehicleFailure(input: PredictVehicleFailureInput): Promise<PredictVehicleFailureOutput> {
  return predictVehicleFailureFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictVehicleFailurePrompt',
  input: {schema: PredictVehicleFailureInputSchema},
  output: {schema: PredictVehicleFailureOutputSchema},
  prompt: `You are an AI diagnosis agent specializing in predicting vehicle failures.

  Analyze the provided sensor data and maintenance logs for vehicle ID {{{vehicleId}}} to predict potential failures.

  Sensor Data: {{{sensorData}}}
  Maintenance Logs: {{{maintenanceLogs}}}

  Based on your analysis, predict potential failures, assign a priority (HIGH, MEDIUM, LOW) to each, and suggest actions to mitigate the failures. Include a confidence score (0-1) for each prediction.
  Return the predictions in JSON format.
  Ensure the JSON is parseable.
  `,
});

const predictVehicleFailureFlow = ai.defineFlow(
  {
    name: 'predictVehicleFailureFlow',
    inputSchema: PredictVehicleFailureInputSchema,
    outputSchema: PredictVehicleFailureOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
