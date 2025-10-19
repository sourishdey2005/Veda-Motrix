
'use server';
/**
 * @fileoverview An AI flow that analyzes vehicle sensor data for anomalies and maintenance needs.
 */
import {
  AnalyzeVehicleDataInput,
  AnalyzeVehicleDataInputSchema,
  AnalyzeVehicleDataOutput,
  AnalyzeVehicleDataOutputSchema,
} from '@/ai/types';
import {ai} from '@/ai/genkit';
import {z} from 'zod';

export async function analyzeVehicleData(
  input: AnalyzeVehicleDataInput
): Promise<AnalyzeVehicleDataOutput> {
  const analysisFlow = ai.defineFlow(
    {
      name: 'vehicleDataAnalysisFlow',
      inputSchema: AnalyzeVehicleDataInputSchema,
      outputSchema: AnalyzeVehicleDataOutputSchema,
    },
    async ({vehicleId, sensorDataJson, maintenanceLogs}) => {
      const llmResponse = await ai.generate({
        model: 'gemini-1.5-flash-latest',
        prompt: `You are a master agent responsible for analyzing vehicle sensor data for anomalies and maintenance needs. Analyze the provided sensor data and logs to identify potential issues. If none are found, return empty arrays.

Vehicle ID: ${vehicleId}
Sensor Data (JSON): ${sensorDataJson}
Maintenance Logs: ${maintenanceLogs}`,
        output: {
          schema: AnalyzeVehicleDataOutputSchema,
        },
      });
      return llmResponse.output()!;
    }
  );

  try {
    const result = await analysisFlow(input);
    return {
      anomalies:
        result.anomalies.length > 0
          ? result.anomalies
          : ['No anomalies detected.'],
      maintenanceNeeds:
        result.maintenanceNeeds.length > 0
          ? result.maintenanceNeeds
          : ['No immediate maintenance needs identified.'],
    };
  } catch (error) {
    console.error('Error in analyzeVehicleData:', error);
    return {
      anomalies: ['Error processing data'],
      maintenanceNeeds: [
        `An unexpected error occurred: ${
          error instanceof Error ? error.message : String(error)
        }`,
      ],
    };
  }
}
