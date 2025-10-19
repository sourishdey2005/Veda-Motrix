
'use server';
/**
 * @fileoverview A Genkit flow that analyzes vehicle sensor data for anomalies and maintenance needs.
 */
import {
  AnalyzeVehicleDataInput,
  AnalyzeVehicleDataInputSchema,
  AnalyzeVehicleDataOutput,
  AnalyzeVehicleDataOutputSchema,
} from '@/ai/types';
import { ai } from '@/ai/genkit';

const analysisPrompt = ai.definePrompt(
  {
    name: 'vehicleDataAnalysis',
    input: { schema: AnalyzeVehicleDataInputSchema },
    output: { schema: AnalyzeVehicleDataOutputSchema },
    prompt: `You are a master agent responsible for analyzing vehicle sensor data and detecting anomalies.
You are provided with sensor data, maintenance logs, and the vehicle ID.
Analyze the sensor data for any anomalies or unusual patterns. Compare the current sensor data with historical data and maintenance logs to identify potential maintenance needs.

Vehicle ID: {{vehicleId}}
Sensor Data: {{sensorDataJson}}
Maintenance Logs: {{maintenanceLogs}}

Output a JSON object that conforms to the schema.`,
  },
);

const analysisFlow = ai.defineFlow({
    name: 'vehicleDataAnalysisFlow',
    inputSchema: AnalyzeVehicleDataInputSchema,
    outputSchema: AnalyzeVehicleDataOutputSchema,
}, async (input) => {
    const result = await analysisPrompt(input);
    return result;
});


export async function analyzeVehicleData(
  input: AnalyzeVehicleDataInput
): Promise<AnalyzeVehicleDataOutput> {
  try {
    const result = await analysisFlow(input);
    return result;
  } catch (error) {
    console.error("Error in analyzeVehicleData:", error);
    return {
      anomalies: ["Error processing data"],
      maintenanceNeeds: [`An unexpected error occurred: ${error instanceof Error ? error.message : String(error)}`],
    };
  }
}
