
'use server';
/**
 * @fileoverview A Genkit flow that analyzes vehicle sensor data for anomalies and maintenance needs.
 */
import {
  AnalyzeVehicleDataInput,
  AnalyzeVehicleDataOutput,
} from '@/ai/types';
import { ai } from '@/ai/genkit';

export async function analyzeVehicleData(
  input: AnalyzeVehicleDataInput
): Promise<AnalyzeVehicleDataOutput> {
  try {
    const prompt = `You are a master agent responsible for analyzing vehicle sensor data for anomalies and maintenance needs.
Analyze the provided sensor data and logs to identify potential issues.

Vehicle ID: ${input.vehicleId}
Sensor Data: ${input.sensorDataJson}
Maintenance Logs: ${input.maintenanceLogs}

Respond in the following format:
ANOMALIES: [List detected anomalies, one per line]
---
MAINTENANCE: [List suggested maintenance needs, one per line]
`;
    const { output } = await ai.generate({
      model: 'googleai/gemini-pro',
      prompt: prompt,
    });

    if (!output || !output.text) {
      throw new Error('No output from AI');
    }
    
    const sections = output.text.split('---');
    const anomaliesSection = sections[0].replace('ANOMALIES:', '').trim();
    const maintenanceSection = sections[1] ? sections[1].replace('MAINTENANCE:', '').trim() : '';

    const anomalies = anomaliesSection.split('\n').map(s => s.trim()).filter(Boolean);
    const maintenanceNeeds = maintenanceSection.split('\n').map(s => s.trim()).filter(Boolean);

    return {
      anomalies: anomalies.length > 0 ? anomalies : ["No anomalies detected."],
      maintenanceNeeds: maintenanceNeeds.length > 0 ? maintenanceNeeds : ["No immediate maintenance needs identified."],
    };

  } catch (error) {
    console.error("Error in analyzeVehicleData:", error);
    return {
      anomalies: ["Error processing data"],
      maintenanceNeeds: [`An unexpected error occurred: ${error instanceof Error ? error.message : String(error)}`],
    };
  }
}
