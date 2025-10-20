'use server';
/**
 * @fileoverview An AI flow that predicts vehicle failures from sensor data and maintenance logs.
 */
import { genAI } from '@/ai/genkit';
import {
  PredictVehicleFailureInput,
  PredictVehicleFailureOutput,
  PredictVehicleFailureOutputSchema,
} from '@/ai/types';

export async function predictVehicleFailure(
  input: PredictVehicleFailureInput
): Promise<PredictVehicleFailureOutput> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `You are an AI diagnosis agent specializing in predicting vehicle failures.
Analyze the provided sensor data and maintenance logs to predict up to 3 potential failures. For each prediction, provide the component, failure type, priority (HIGH, MEDIUM, LOW), confidence score (0.0-1.0), and suggested actions. Respond with a valid JSON object matching this schema: ${JSON.stringify(PredictVehicleFailureOutputSchema.shape)}.

Vehicle ID ${input.vehicleId}
Sensor Data (JSON): ${input.sensorDataJson}
Maintenance Logs: ${input.maintenanceLogs}
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const parsed = PredictVehicleFailureOutputSchema.parse(JSON.parse(responseText));

    return parsed;
  } catch (error) {
    console.error('Error in predictVehicleFailure:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      predictedFailures: [
        {
          component: 'System',
          failureType: 'Analysis Error',
          priority: 'HIGH',
          confidence: 1.0,
          suggestedActions: `An unexpected error occurred: ${errorMessage}`,
        },
      ],
    };
  }
}
