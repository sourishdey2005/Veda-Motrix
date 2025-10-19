
'use server';

/**
 * @fileOverview An AI agent to analyze vehicle sensor data and detect anomalies.
 *
 * - analyzeVehicleData - A function that handles the analysis of vehicle data.
 * - AnalyzeVehicleDataInput - The input type for the analyzeVehicleData function.
 * - AnalyzeVehicleDataOutput - The return type for the analyzeVehicleData function.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const AnalyzeVehicleDataInputSchema = z.object({
  vehicleId: z.string().describe('The ID of the vehicle to analyze.'),
  sensorData: z.record(z.number()).describe('A record of sensor readings for the vehicle.'),
  maintenanceLogs: z.string().describe('Maintenance logs for the vehicle.'),
});
export type AnalyzeVehicleDataInput = z.infer<typeof AnalyzeVehicleDataInputSchema>;

export const AnalyzeVehicleDataOutputSchema = z.object({
  anomalies: z.array(z.string()).describe('A list of detected anomalies in the sensor data.'),
  maintenanceNeeds: z.array(z.string()).describe('A list of potential maintenance needs based on the analysis.'),
});
export type AnalyzeVehicleDataOutput = z.infer<typeof AnalyzeVehicleDataOutputSchema>;

const analyzeVehicleDataPromptInputSchema = z.object({
    vehicleId: z.string(),
    sensorDataJson: z.string(),
    maintenanceLogs: z.string()
});

const vehicleDataPrompt = ai.definePrompt({
    name: 'analyzeVehicleDataPrompt',
    input: { schema: analyzeVehicleDataPromptInputSchema },
    output: { schema: AnalyzeVehicleDataOutputSchema },
    prompt: `You are a master agent responsible for analyzing vehicle sensor data and detecting anomalies.

    You are provided with sensor data, maintenance logs, and the vehicle ID.

    Analyze the sensor data for any anomalies or unusual patterns. Compare the current sensor data with historical data and maintenance logs to identify potential maintenance needs.

    Vehicle ID: {{{vehicleId}}}
    Sensor Data: {{{sensorDataJson}}}
    Maintenance Logs: {{{maintenanceLogs}}}
`
});

const analyzeVehicleDataFlow = ai.defineFlow(
  {
    name: 'analyzeVehicleDataFlow',
    inputSchema: AnalyzeVehicleDataInputSchema,
    outputSchema: AnalyzeVehicleDataOutputSchema,
  },
  async (input) => {
    const { output } = await vehicleDataPrompt({
        vehicleId: input.vehicleId,
        sensorDataJson: JSON.stringify(input.sensorData, null, 2),
        maintenanceLogs: input.maintenanceLogs
    });
    if (!output) {
        throw new Error('AI failed to generate a response.');
    }
    return output;
  }
);


export async function analyzeVehicleData(input: AnalyzeVehicleDataInput): Promise<AnalyzeVehicleDataOutput> {
  return await analyzeVehicleDataFlow(input);
}
