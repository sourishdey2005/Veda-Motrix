
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

const vehicleDataFlow = ai.defineFlow(
  {
    name: 'vehicleDataFlow',
    inputSchema: AnalyzeVehicleDataInputSchema,
    outputSchema: AnalyzeVehicleDataOutputSchema,
  },
  async (input: AnalyzeVehicleDataInput): Promise<AnalyzeVehicleDataOutput> => {
    const llmResponse = await ai.generate({
      model: 'gemini-pro',
      prompt: `You are a master agent responsible for analyzing vehicle sensor data for anomalies and maintenance needs. Analyze the provided sensor data and logs to identify potential issues. If none are found, return empty arrays. Respond with a valid JSON object matching the requested schema.

Vehicle ID: ${input.vehicleId}
Sensor Data (JSON): ${input.sensorDataJson}
Maintenance Logs: ${input.maintenanceLogs}`,
      output: {
        schema: AnalyzeVehicleDataOutputSchema,
      },
    });

    const result = llmResponse.output;

    if (result) {
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
    
    // Fallback parsing if structured output fails
    try {
        const parsed = AnalyzeVehicleDataOutputSchema.parse(JSON.parse(llmResponse.text));
        return {
            anomalies: parsed.anomalies.length > 0 ? parsed.anomalies : ['No anomalies detected.'],
            maintenanceNeeds: parsed.maintenanceNeeds.length > 0 ? parsed.maintenanceNeeds : ['No immediate maintenance needs identified.']
        };
    } catch(e) {
        console.error("Failed to get structured output or parse text for vehicle data", e);
        return {
            anomalies: ['Error: Analysis Failed'],
            maintenanceNeeds: ['The AI failed to return a valid response. Please try again.'],
        }
    }
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
