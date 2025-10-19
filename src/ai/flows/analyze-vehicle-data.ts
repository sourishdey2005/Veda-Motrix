
'use server';

/**
 * @fileOverview An AI agent to analyze vehicle sensor data and detect anomalies.
 */
import openai from '@/ai/client';

export interface AnalyzeVehicleDataInput {
  vehicleId: string;
  sensorData: Record<string, number>;
  maintenanceLogs: string;
}

export interface AnalyzeVehicleDataOutput {
  anomalies: string[];
  maintenanceNeeds: string[];
}

export async function analyzeVehicleData(input: AnalyzeVehicleDataInput): Promise<AnalyzeVehicleDataOutput> {
  const prompt = `You are a master agent responsible for analyzing vehicle sensor data and detecting anomalies.
    You are provided with sensor data, maintenance logs, and the vehicle ID.
    Analyze the sensor data for any anomalies or unusual patterns. Compare the current sensor data with historical data and maintenance logs to identify potential maintenance needs.

    Vehicle ID: ${input.vehicleId}
    Sensor Data: ${JSON.stringify(input.sensorData, null, 2)}
    Maintenance Logs: ${input.maintenanceLogs}

    Return a JSON object with the following structure: { "anomalies": ["string"], "maintenanceNeeds": ["string"] }.
  `;
  
  try {
    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const responseJson = completion.choices[0].message?.content;
    if (!responseJson) {
      throw new Error('AI failed to generate a response.');
    }
    return JSON.parse(responseJson) as AnalyzeVehicleDataOutput;
  } catch (error) {
    console.error('Error in analyzeVehicleData:', error);
    throw new Error('Failed to analyze vehicle data.');
  }
}
