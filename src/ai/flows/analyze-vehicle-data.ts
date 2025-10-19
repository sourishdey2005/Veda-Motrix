
'use server';
/**
 * @fileoverview A Genkit flow that analyzes vehicle sensor data for anomalies and maintenance needs.
 */
import {
  AnalyzeVehicleDataInput,
  AnalyzeVehicleDataOutput,
  AnalyzeVehicleDataOutputSchema,
} from '@/ai/types';
import { ai } from '@/ai/genkit';
import { z } from 'zod';

export async function analyzeVehicleData(
  input: AnalyzeVehicleDataInput
): Promise<AnalyzeVehicleDataOutput> {
  try {
    const prompt = `You are a master agent responsible for analyzing vehicle sensor data and detecting anomalies.
You are provided with sensor data, maintenance logs, and the vehicle ID.
Analyze the sensor data for any anomalies or unusual patterns. Compare the current sensor data with historical data and maintenance logs to identify potential maintenance needs.

Vehicle ID: ${input.vehicleId}
Sensor Data: ${input.sensorDataJson}
Maintenance Logs: ${input.maintenanceLogs}

Output a JSON object that conforms to the following Zod schema:
${JSON.stringify(AnalyzeVehicleDataOutputSchema.shape)}
`;
    const { output } = await ai.generate({
      model: 'googleai/gemini-pro',
      prompt: prompt,
      output: {
        format: 'json',
        schema: AnalyzeVehicleDataOutputSchema,
      },
    });

    if (!output) {
      throw new Error('No output from AI');
    }
    return output;
  } catch (error) {
    console.error("Error in analyzeVehicleData:", error);
    return {
      anomalies: ["Error processing data"],
      maintenanceNeeds: [`An unexpected error occurred: ${error instanceof Error ? error.message : String(error)}`],
    };
  }
}
