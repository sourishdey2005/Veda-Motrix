
'use server';

import { GoogleGenAI } from "@google/genai";
import {
  type AnalyzeVehicleDataInput,
  type AnalyzeVehicleDataOutput,
} from '@/ai/types';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable not set.");
}
const genAI = new GoogleGenAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: { responseMimeType: "application/json" },
});

export async function analyzeVehicleData(input: AnalyzeVehicleDataInput): Promise<AnalyzeVehicleDataOutput> {

    const prompt = `You are a master agent responsible for analyzing vehicle sensor data and detecting anomalies.
    You are provided with sensor data, maintenance logs, and the vehicle ID.
    Analyze the sensor data for any anomalies or unusual patterns. Compare the current sensor data with historical data and maintenance logs to identify potential maintenance needs.

    Vehicle ID: ${input.vehicleId}
    Sensor Data: ${input.sensorDataJson}
    Maintenance Logs: ${input.maintenanceLogs}
    
    Return a JSON object with the following structure:
    {
      "anomalies": ["list of detected anomalies"],
      "maintenanceNeeds": ["list of potential maintenance needs"]
    }`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const jsonString = response.text();
    return JSON.parse(jsonString) as AnalyzeVehicleDataOutput;
  } catch (error) {
    console.error("Error analyzing vehicle data:", error);
    throw new Error("Failed to analyze vehicle data.");
  }
}
