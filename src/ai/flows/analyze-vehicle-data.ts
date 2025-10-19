
'use server';
/**
 * @fileoverview A Genkit flow that analyzes vehicle sensor data for anomalies and maintenance needs.
 */
import {
  AnalyzeVehicleDataInput,
  AnalyzeVehicleDataOutput,
  AnalyzeVehicleDataOutputSchema,
} from '@/ai/types';
import { GoogleGenerativeAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable not set.");
}
const genAI = new GoogleGenerativeAI(apiKey);

export async function analyzeVehicleData(
  input: AnalyzeVehicleDataInput
): Promise<AnalyzeVehicleDataOutput> {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `You are a master agent responsible for analyzing vehicle sensor data and detecting anomalies.
You are provided with sensor data, maintenance logs, and the vehicle ID.
Analyze the sensor data for any anomalies or unusual patterns. Compare the current sensor data with historical data and maintenance logs to identify potential maintenance needs.

Vehicle ID: ${input.vehicleId}
Sensor Data: ${input.sensorDataJson}
Maintenance Logs: ${input.maintenanceLogs}

Output a JSON object that conforms to this schema:
${JSON.stringify(AnalyzeVehicleDataOutputSchema.jsonSchema, null, 2)}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const parsed = JSON.parse(text);
    return AnalyzeVehicleDataOutputSchema.parse(parsed);

  } catch (error) {
    console.error("Error in analyzeVehicleData:", error);
    return {
      anomalies: ["Error processing data"],
      maintenanceNeeds: [`An unexpected error occurred: ${error instanceof Error ? error.message : String(error)}`],
    };
  }
}
