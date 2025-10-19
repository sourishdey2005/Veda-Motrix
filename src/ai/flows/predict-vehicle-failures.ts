
'use server';

import { GoogleGenAI } from "@google/genai";
import {
  type PredictVehicleFailureInput,
  type PredictVehicleFailureOutput,
  PredictedFailureSchema,
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


export async function predictVehicleFailure(
  input: PredictVehicleFailureInput
): Promise<PredictVehicleFailureOutput> {

    const prompt = `You are an AI diagnosis agent specializing in predicting vehicle failures.
    Analyze the provided sensor data and maintenance logs for vehicle ID ${input.vehicleId} to predict potential failures.

    Sensor Data: ${input.sensorDataJson}
    Maintenance Logs: ${input.maintenanceLogs}

    Based on your analysis, predict potential failures, assign a priority (HIGH, MEDIUM, LOW) to each, and suggest actions to mitigate the failures. Include a confidence score (0-1) for each prediction.

    Return a JSON object with the following structure:
    {
      "predictedFailures": [
        {
          "component": "string",
          "failureType": "string",
          "priority": "HIGH" | "MEDIUM" | "LOW",
          "confidence": number (0-1),
          "suggestedActions": "string"
        }
      ]
    }`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const jsonString = response.text();
    return JSON.parse(jsonString) as PredictVehicleFailureOutput;
  } catch (error) {
    console.error("Error predicting vehicle failure:", error);
    throw new Error("Failed to predict vehicle failure.");
  }
}
