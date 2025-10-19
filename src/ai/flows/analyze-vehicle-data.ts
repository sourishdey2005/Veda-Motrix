
'use server';
/**
 * @fileoverview A Genkit flow that analyzes vehicle sensor data for anomalies and maintenance needs.
 */
import {ai} from '@/ai/genkit';
import {
  AnalyzeVehicleDataInput,
  AnalyzeVehicleDataInputSchema,
  AnalyzeVehicleDataOutput,
  AnalyzeVehicleDataOutputSchema,
} from '@/ai/types';

const vehicleDataPrompt = ai.definePrompt({
  name: 'vehicleDataPrompt',
  input: {schema: AnalyzeVehicleDataInputSchema},
  output: {schema: AnalyzeVehicleDataOutputSchema},
  prompt: `You are a master agent responsible for analyzing vehicle sensor data and detecting anomalies.
You are provided with sensor data, maintenance logs, and the vehicle ID.
Analyze the sensor data for any anomalies or unusual patterns. Compare the current sensor data with historical data and maintenance logs to identify potential maintenance needs.

Vehicle ID: {{vehicleId}}
Sensor Data: {{sensorDataJson}}
Maintenance Logs: {{maintenanceLogs}}
`,
});

export async function analyzeVehicleData(
  input: AnalyzeVehicleDataInput
): Promise<AnalyzeVehicleDataOutput> {
  const {output} = await ai.generate({
    prompt: vehicleDataPrompt(input),
    model: 'googleai/gemini-pro',
    config: {
      output: {
        format: 'json',
        schema: AnalyzeVehicleDataOutputSchema,
      },
    },
  });
  return output!;
}
