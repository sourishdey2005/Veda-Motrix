
'use server';
/**
 * @fileoverview A Genkit flow that predicts vehicle failures from sensor data and maintenance logs.
 */
import {
  PredictVehicleFailureInput,
  PredictVehicleFailureOutput,
  PredictVehicleFailureOutputSchema,
} from '@/ai/types';
import { GoogleGenerativeAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable not set.");
}
const genAI = new GoogleGenerativeAI(apiKey);

export async function predictVehicleFailure(
  input: PredictVehicleFailureInput
): Promise<PredictVehicleFailureOutput> {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `You are an AI diagnosis agent specializing in predicting vehicle failures.
Analyze the provided sensor data and maintenance logs for vehicle ID ${input.vehicleId} to predict potential failures.

Sensor Data: ${input.sensorDataJson}
Maintenance Logs: ${input.maintenanceLogs}

Based on your analysis, predict potential failures, assign a priority (HIGH, MEDIUM, LOW) to each, and suggest actions to mitigate the failures. Include a confidence score (0-1) for each prediction.

Output a JSON object that conforms to this schema:
${JSON.stringify(PredictVehicleFailureOutputSchema.jsonSchema, null, 2)}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const parsed = JSON.parse(text);
    return PredictVehicleFailureOutputSchema.parse(parsed);

  } catch (error) {
    console.error("Error in predictVehicleFailure:", error);
    return {
      predictedFailures: [
        {
          component: "System",
          failureType: "Analysis Error",
          priority: "HIGH",
          confidence: 1.0,
          suggestedActions: `An unexpected error occurred: ${error instanceof Error ? error.message : String(error)}`,
        }
      ],
    };
  }
}
