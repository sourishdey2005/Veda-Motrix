
'use server';

import {ai} from '@/ai/genkit';
import {z} from 'zod';

export const AnalyzeVehicleDataInputSchema = z.object({
  vehicleId: z.string(),
  sensorDataJson: z.string(),
  maintenanceLogs: z.string(),
});
export type AnalyzeVehicleDataInput = z.infer<
  typeof AnalyzeVehicleDataInputSchema
>;

export const AnalyzeVehicleDataOutputSchema = z.object({
  anomalies: z.array(z.string()),
  maintenanceNeeds: z.array(z.string()),
});
export type AnalyzeVehicleDataOutput = z.infer<
  typeof AnalyzeVehicleDataOutputSchema
>;

const prompt = ai.definePrompt(
  {
    name: 'vehicleDataPrompt',
    input: {schema: AnalyzeVehicleDataInputSchema},
    output: {schema: AnalyzeVehicleDataOutputSchema},
    prompt: `You are a master agent responsible for analyzing vehicle sensor data and detecting anomalies.
    You are provided with sensor data, maintenance logs, and the vehicle ID.
    Analyze the sensor data for any anomalies or unusual patterns. Compare the current sensor data with historical data and maintenance logs to identify potential maintenance needs.

    Vehicle ID: {{{vehicleId}}}
    Sensor Data: {{{sensorDataJson}}}
    Maintenance Logs: {{{maintenanceLogs}}}
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

export const analyzeVehicleDataFlow = ai.defineFlow(
  {
    name: 'analyzeVehicleDataFlow',
    inputSchema: AnalyzeVehicleDataInputSchema,
    outputSchema: AnalyzeVehicleDataOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('AI failed to generate a response.');
    }
    return output;
  }
);

export async function analyzeVehicleData(input: {
  vehicleId: string;
  sensorData: Record<string, number>;
  maintenanceLogs: string;
}): Promise<AnalyzeVehicleDataOutput> {
  return analyzeVehicleDataFlow({
    ...input,
    sensorDataJson: JSON.stringify(input.sensorData, null, 2),
  });
}
