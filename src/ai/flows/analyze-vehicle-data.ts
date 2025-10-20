
'use server';
/**
 * @fileoverview An AI flow that analyzes vehicle sensor data for anomalies and maintenance needs.
 */
import {ai} from '@/ai/genkit';
import {z} from 'zod';
import {
  AnalyzeVehicleDataInput,
  AnalyzeVehicleDataInputSchema,
  AnalyzeVehicleDataOutput,
  AnalyzeVehicleDataOutputSchema,
} from '@/ai/types';
import {gemini15Flash} from 'genkitx-googleai';

const vehicleDataFlow = ai.defineFlow(
  {
    name: 'vehicleDataFlow',
    inputSchema: AnalyzeVehicleDataInputSchema,
    outputSchema: AnalyzeVehicleDataOutputSchema,
  },
  async (input: AnalyzeVehicleDataInput) => {
    const llmResponse = await ai.generate({
      model: gemini15Flash,
      prompt: `You are a master agent responsible for analyzing vehicle sensor data for anomalies and maintenance needs. Analyze the provided sensor data and logs to identify potential issues. If none are found, return empty arrays.

Vehicle ID: ${input.vehicleId}
Sensor Data (JSON): ${input.sensorDataJson}
Maintenance Logs: ${input.maintenanceLogs}`,
      output: {
        schema: AnalyzeVehicleDataOutputSchema,
      },
    });

    const result = llmResponse.output;

    if (!result) {
      throw new Error('AI returned an invalid response format.');
    }

    return {
      anomalies:
        result.anomalies && result.anomalies.length > 0
          ? result.anomalies
          : ['No anomalies detected.'],
      maintenanceNeeds:
        result.maintenanceNeeds && result.maintenanceNeeds.length > 0
          ? result.maintenanceNeeds
          : ['No immediate maintenance needs identified.'],
    };
  }
);

export async function analyzeVehicleData(
  input: AnalyzeVehicleDataInput
): Promise<AnalyzeVehicleDataOutput> {
  try {
    return await vehicleDataFlow(input);
  } catch (error) {
    console.error('Error in analyzeVehicleData:', error);
    return {
      anomalies: ['Error: Analysis Failed'],
      maintenanceNeeds: [
        `An unexpected error occurred: ${
          error instanceof Error ? error.message : String(error)
        }`,
      ],
    };
  }
}
