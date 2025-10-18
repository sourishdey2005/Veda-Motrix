
'use server';

/**
 * @fileOverview An AI agent to analyze vehicle sensor data and detect anomalies.
 *
 * - analyzeVehicleData - A function that handles the analysis of vehicle data.
 * - AnalyzeVehicleDataInput - The input type for the analyzeVehicleData function.
 * - AnalyzeVehicleDataOutput - The return type for the analyzeVehicleData function.
 */
import { openai } from '@/ai/client';
import { z } from 'zod';

const AnalyzeVehicleDataInputSchema = z.object({
  vehicleId: z.string().describe('The ID of the vehicle to analyze.'),
  sensorData: z.record(z.number()).describe('A record of sensor readings for the vehicle.'),
  maintenanceLogs: z.string().describe('Maintenance logs for the vehicle.'),
});
export type AnalyzeVehicleDataInput = z.infer<typeof AnalyzeVehicleDataInputSchema>;

const AnalyzeVehicleDataOutputSchema = z.object({
  anomalies: z.array(z.string()).describe('A list of detected anomalies in the sensor data.'),
  maintenanceNeeds: z.array(z.string()).describe('A list of potential maintenance needs based on the analysis.'),
});
export type AnalyzeVehicleDataOutput = z.infer<typeof AnalyzeVehicleDataOutputSchema>;

export async function analyzeVehicleData(input: AnalyzeVehicleDataInput): Promise<AnalyzeVehicleDataOutput> {
  
    const prompt = `You are a master agent responsible for analyzing vehicle sensor data and detecting anomalies.

    You are provided with sensor data, maintenance logs, and the vehicle ID.

    Analyze the sensor data for any anomalies or unusual patterns. Compare the current sensor data with historical data and maintenance logs to identify potential maintenance needs.

    Vehicle ID: ${input.vehicleId}
    Sensor Data: ${JSON.stringify(input.sensorData)}
    Maintenance Logs: ${input.maintenanceLogs}

    Return a valid JSON object with the following structure:
    {
      "anomalies": ["list of detected anomalies"],
      "maintenanceNeeds": ["list of potential maintenance needs"]
    }`;

    const completion = await openai.chat.completions.create({
        model: 'openai/gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
    });

    const result = completion.choices[0].message?.content;
    if (!result) {
        throw new Error('AI failed to generate a response.');
    }

    return AnalyzeVehicleDataOutputSchema.parse(JSON.parse(result));
}
