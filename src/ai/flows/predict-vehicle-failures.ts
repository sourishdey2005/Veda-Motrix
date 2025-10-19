
'use server';
/**
 * @fileoverview A Genkit flow that predicts vehicle failures from sensor data and maintenance logs.
 */
import {ai} from '@/ai/genkit';
import {
  PredictVehicleFailureInput,
  PredictVehicleFailureInputSchema,
  PredictVehicleFailureOutput,
  PredictVehicleFailureOutputSchema,
} from '@/ai/types';
import {z} from 'zod';

export async function predictVehicleFailure(
  input: PredictVehicleFailureInput
): Promise<PredictVehicleFailureOutput> {
  const prompt = ai.definePrompt(
    {
      name: 'vehicleFailurePrompt',
      input: {schema: PredictVehicleFailureInputSchema},
      output: {schema: PredictVehicleFailureOutputSchema},
      prompt: `You are an AI diagnosis agent specializing in predicting vehicle failures.
Analyze the provided sensor data and maintenance logs for vehicle ID {{vehicleId}} to predict potential failures.

Sensor Data: {{sensorDataJson}}
Maintenance Logs: {{maintenanceLogs}}

Based on your analysis, predict potential failures, assign a priority (HIGH, MEDIUM, LOW) to each, and suggest actions to mitigate the failures. Include a confidence score (0-1) for each prediction.
`,
    },
    async input => {
      const {output} = await ai.generate({
        prompt: input,
        model: 'googleai/gemini-1.5-flash',
        config: {
          output: {
            format: 'json',
            schema: PredictVehicleFailureOutputSchema,
          },
        },
      });
      return output!;
    }
  );
  return prompt(input);
}
