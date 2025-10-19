'use server';

import {ai} from '@/ai/genkit';
import {
  PredictVehicleFailureInputSchema,
  PredictVehicleFailureOutputSchema,
  type PredictVehicleFailureOutput,
} from '@/ai/types';

const prompt = ai.definePrompt(
  {
    name: 'vehicleFailurePrompt',
    input: {schema: PredictVehicleFailureInputSchema},
    output: {schema: PredictVehicleFailureOutputSchema},
    prompt: `You are an AI diagnosis agent specializing in predicting vehicle failures.
    Analyze the provided sensor data and maintenance logs for vehicle ID {{{vehicleId}}} to predict potential failures.

    Sensor Data: {{{sensorDataJson}}}
    Maintenance Logs: {{{maintenanceLogs}}}

    Based on your analysis, predict potential failures, assign a priority (HIGH, MEDIUM, LOW) to each, and suggest actions to mitigate the failures. Include a confidence score (0-1) for each prediction.
  `,
  },
  async (input) => {
    return {
      model: 'googleai/gemini-1.5-flash',
      output: {
        format: 'json',
      },
    };
  }
);

const predictVehicleFailureFlow = ai.defineFlow(
  {
    name: 'predictVehicleFailureFlow',
    inputSchema: PredictVehicleFailureInputSchema,
    outputSchema: PredictVehicleFailureOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('AI failed to generate a response.');
    }
    return output;
  }
);

export async function predictVehicleFailure(input: {
  vehicleId: string;
  sensorData: Record<string, number>;
  maintenanceLogs: string;
}): Promise<PredictVehicleFailureOutput> {
  return predictVehicleFailureFlow({
    ...input,
    sensorDataJson: JSON.stringify(input.sensorData, null, 2),
  });
}
