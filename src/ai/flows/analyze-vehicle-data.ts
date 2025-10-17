
'use server';

/**
 * @fileOverview An AI agent to analyze vehicle sensor data and detect anomalies.
 *
 * - analyzeVehicleData - A function that handles the analysis of vehicle data.
 * - AnalyzeVehicleDataInput - The input type for the analyzeVehicleData function.
 * - AnalyzeVehicleDataOutput - The return type for the analyzeVehicleData function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {z} from 'genkit';

const AnalyzeVehicleDataInputSchema = z.object({
  vehicleId: z.string().describe('The ID of the vehicle to analyze.'),
  sensorData: z.record(z.number()).describe('A record of sensor readings for the vehicle.'),
  maintenanceLogs: z.string().describe('Maintenance logs for the vehicle.'),
});
export type AnalyzeVehicleDataInput = z.infer<typeof AnalyzeVehicleDataInputSchema>;

const AnalyzeVehicleDataOutputSchema = z.object({
  anomalies: z.array(z.string()).describe('A list of detected anomalies in the sensor data.'),
  maintenanceNeeds: z.array(z.string()).describe('A list of potential maintenance needs based on the analysis.'),
});
export type AnalyzeVehicleDataOutput = z.infer<typeof AnalyzeVehicleDataOutputSchema>;

export async function analyzeVehicleData(input: AnalyzeVehicleDataInput): Promise<AnalyzeVehicleDataOutput> {
  return analyzeVehicleDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeVehicleDataPrompt',
  input: {schema: AnalyzeVehicleDataInputSchema},
  output: {schema: AnalyzeVehicleDataOutputSchema},
  prompt: `You are a master agent responsible for analyzing vehicle sensor data and detecting anomalies.

You are provided with sensor data, maintenance logs, and the vehicle ID.

Analyze the sensor data for any anomalies or unusual patterns. Compare the current sensor data with historical data and maintenance logs to identify potential maintenance needs.

Vehicle ID: {{{vehicleId}}}
Sensor Data: {{{sensorData}}}
Maintenance Logs: {{{maintenanceLogs}}}

Output a list of detected anomalies and potential maintenance needs.

Anomalies:
{{#each anomalies}}
- {{{this}}}
{{/each}}

Maintenance Needs:
{{#each maintenanceNeeds}}
- {{{this}}}
{{/each}}`,
});

const analyzeVehicleDataFlow = ai.defineFlow(
  {
    name: 'analyzeVehicleDataFlow',
    inputSchema: AnalyzeVehicleDataInputSchema,
    outputSchema: AnalyzeVehicleDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
