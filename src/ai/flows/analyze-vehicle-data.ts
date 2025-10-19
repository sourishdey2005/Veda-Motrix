
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
import { z } from 'zod';

const analyzeVehicleDataPrompt = ai.definePrompt(
  {
    name: 'analyzeVehicleDataPrompt',
    input: { schema: AnalyzeVehicleDataInputSchema },
    output: { schema: AnalyzeVehicleDataOutputSchema },
    model: 'googleai/gemini-1.5-flash-latest',
    prompt: `You are a master agent responsible for analyzing vehicle sensor data for anomalies and maintenance needs.
Analyze the provided sensor data and logs to identify potential issues.

Vehicle ID: {{{vehicleId}}}
Sensor Data: {{{sensorDataJson}}}
Maintenance Logs: {{{maintenanceLogs}}}

Respond with a list of detected anomalies and a list of suggested maintenance needs, in the format defined by the output schema.
`,
  },
);

const analyzeVehicleDataFlow = ai.defineFlow(
  {
    name: 'analyzeVehicleDataFlow',
    inputSchema: AnalyzeVehicleDataInputSchema,
    outputSchema: AnalyzeVehicleDataOutputSchema,
  },
  async (input) => {
    const { output } = await analyzeVehicleDataPrompt(input);
    if (!output) {
      throw new Error('Analysis failed: AI did not return a structured response.');
    }
    return output;
  }
);


export async function analyzeVehicleData(
  input: AnalyzeVehicleDataInput
): Promise<AnalyzeVehicleDataOutput> {
  try {
    const result = await analyzeVehicleDataFlow(input);
    return {
        anomalies: result.anomalies.length > 0 ? result.anomalies : ["No anomalies detected."],
        maintenanceNeeds: result.maintenanceNeeds.length > 0 ? result.maintenanceNeeds : ["No immediate maintenance needs identified."],
    }
  } catch (error) {
    console.error("Error in analyzeVehicleData:", error);
    return {
      anomalies: ["Error processing data"],
      maintenanceNeeds: [`An unexpected error occurred: ${error instanceof Error ? error.message : String(error)}`],
    };
  }
}
