'use server';
/**
 * @fileoverview An AI flow that analyzes vehicle sensor data for anomalies and maintenance needs.
 */
import { genAI } from '@/ai/genkit';
import {
  AnalyzeVehicleDataInput,
  AnalyzeVehicleDataOutput,
  AnalyzeVehicleDataOutputSchema,
} from '@/ai/types';

export async function analyzeVehicleData(
  input: AnalyzeVehicleDataInput
): Promise<AnalyzeVehicleDataOutput> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `You are a master agent responsible for analyzing vehicle sensor data for anomalies and maintenance needs. Analyze the provided sensor data and logs to identify potential issues. If none are found, return empty arrays. Respond with a valid JSON object matching this schema: ${JSON.stringify(AnalyzeVehicleDataOutputSchema.shape)}.

Vehicle ID: ${input.vehicleId}
Sensor Data (JSON): ${input.sensorDataJson}
Maintenance Logs: ${input.maintenanceLogs}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    const parsed = AnalyzeVehicleDataOutputSchema.parse(JSON.parse(responseText));
    
    return {
        anomalies: parsed.anomalies.length > 0 ? parsed.anomalies : ['No anomalies detected.'],
        maintenanceNeeds: parsed.maintenanceNeeds.length > 0 ? parsed.maintenanceNeeds : ['No immediate maintenance needs identified.']
    };

  } catch (error) {
    console.error('Error in analyzeVehicleData:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      anomalies: ['Error: Analysis Failed'],
      maintenanceNeeds: [ `An unexpected error occurred: ${errorMessage}`],
    };
  }
}
