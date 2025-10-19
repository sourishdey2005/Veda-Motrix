
'use server';

/**
 * @fileOverview AI agent for predicting potential vehicle failures and assigning priority levels.
 */
import openai from '@/ai/client';

export interface PredictVehicleFailureInput {
  vehicleId: string;
  sensorData: Record<string, number>;
  maintenanceLogs: string;
}

export interface PredictedFailure {
    component: string;
    failureType: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    confidence: number;
    suggestedActions: string;
}

export interface PredictVehicleFailureOutput {
  predictedFailures: PredictedFailure[];
}

export async function predictVehicleFailure(input: PredictVehicleFailureInput): Promise<PredictVehicleFailureOutput> {
  const prompt = `You are an AI diagnosis agent specializing in predicting vehicle failures.
    Analyze the provided sensor data and maintenance logs for vehicle ID ${input.vehicleId} to predict potential failures.

    Sensor Data: ${JSON.stringify(input.sensorData, null, 2)}
    Maintenance Logs: ${input.maintenanceLogs}

    Based on your analysis, predict potential failures, assign a priority (HIGH, MEDIUM, LOW) to each, and suggest actions to mitigate the failures. Include a confidence score (0-1) for each prediction.
    Return a JSON object with the following structure: { "predictedFailures": [{ "component": "string", "failureType": "string", "priority": "HIGH" | "MEDIUM" | "LOW", "confidence": number, "suggestedActions": "string" }] }.
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
    return JSON.parse(responseJson) as PredictVehicleFailureOutput;
  } catch (error) {
    console.error('Error in predictVehicleFailure:', error);
    throw new Error('Failed to predict vehicle failure.');
  }
}
