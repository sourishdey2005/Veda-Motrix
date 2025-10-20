
'use server';
/**
 * @fileoverview An AI flow that analyzes vehicle sensor data for anomalies and maintenance needs.
 */
import { aiClient, textModel } from '@/ai/genkit';
import {
  AnalyzeVehicleDataInput,
  AnalyzeVehicleDataOutput,
  AnalyzeVehicleDataOutputSchema,
} from '@/ai/types';

export async function analyzeVehicleData(
  input: AnalyzeVehicleDataInput
): Promise<AnalyzeVehicleDataOutput> {
  try {
    const prompt = `You are a master agent responsible for analyzing vehicle sensor data for anomalies and maintenance needs. Analyze the provided sensor data and logs to identify potential issues. If none are found, return empty arrays. Respond with a valid JSON object matching this schema: ${JSON.stringify(AnalyzeVehicleDataOutputSchema.shape)}.

Vehicle ID: ${input.vehicleId}
Sensor Data (JSON): ${input.sensorDataJson}
Maintenance Logs: ${input.maintenanceLogs}`;

    const response = await aiClient.chat.completions({
      model: textModel,
      messages: [
        { role: 'system', content: 'You are a helpful assistant that only returns valid JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0,
      top_p: 1,
    });
    
    const message = response.choices[0]?.message?.content;
    if (!message) {
      throw new Error('AI returned an empty response.');
    }
    
    try {
      const parsed = AnalyzeVehicleDataOutputSchema.parse(JSON.parse(message));
      return {
          anomalies: parsed.anomalies.length > 0 ? parsed.anomalies : ['No anomalies detected.'],
          maintenanceNeeds: parsed.maintenanceNeeds.length > 0 ? parsed.maintenanceNeeds : ['No immediate maintenance needs identified.']
      };
    } catch (e) {
      console.error("Failed to parse AI JSON response:", e);
      return {
        anomalies: ['Error: Analysis Failed'],
        maintenanceNeeds: [ `AI returned an invalid response format. Raw response: ${message}`],
      };
    }

  } catch (error) {
    console.error('Error in analyzeVehicleData:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      anomalies: ['Error: Analysis Failed'],
      maintenanceNeeds: [ `An unexpected error occurred: ${errorMessage}`],
    };
  }
}
