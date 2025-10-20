
'use server';
/**
 * @fileoverview An AI flow that analyzes vehicle sensor data for anomalies and maintenance needs.
 */
import {
  AnalyzeVehicleDataInput,
  AnalyzeVehicleDataOutput,
  AnalyzeVehicleDataOutputSchema,
} from '@/ai/types';
import { openAiClient } from '@/ai/genkit';

export async function analyzeVehicleData(
  input: AnalyzeVehicleDataInput
): Promise<AnalyzeVehicleDataOutput> {
  try {
    const result = await openAiClient<AnalyzeVehicleDataInput, AnalyzeVehicleDataOutput>({
      prompt: `You are a master agent responsible for analyzing vehicle sensor data for anomalies and maintenance needs. Analyze the provided sensor data and logs to identify potential issues. If none are found, return empty arrays.

Vehicle ID: ${input.vehicleId}
Sensor Data (JSON): ${input.sensorDataJson}
Maintenance Logs: ${input.maintenanceLogs}`,
      response_model: {
        schema: AnalyzeVehicleDataOutputSchema,
        name: 'AnalyzeVehicleDataOutput',
      },
    });

    if (typeof result === 'string' || !result) {
        throw new Error('AI returned an invalid response format.');
    }

    // Ensure we return valid structure even if AI returns empty arrays
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

  } catch (error) {
    console.error('Error in analyzeVehicleData:', error);
    // Return a valid AnalyzeVehicleDataOutput structure in case of an error
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
