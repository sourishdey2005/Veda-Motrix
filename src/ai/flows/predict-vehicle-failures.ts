
'use server';

/**
 * @fileOverview AI agent for predicting potential vehicle failures and assigning priority levels.
 *
 * - predictVehicleFailure - Function to predict vehicle failures based on sensor data.
 * - PredictVehicleFailureInput - Input type for the predictVehicleFailure function.
 * - PredictVehicleFailureOutput - Output type for the predictVehicleFailure function.
 */
import { openai } from '@/ai/client';
import { z } from 'zod';

const PredictVehicleFailureInputSchema = z.object({
  vehicleId: z.string().describe('The ID of the vehicle to analyze.'),
  sensorData: z.record(z.number()).describe('A record of sensor readings for the vehicle.'),
  maintenanceLogs: z.string().describe('Maintenance history for the vehicle'),
});
export type PredictVehicleFailureInput = z.infer<typeof PredictVehicleFailureInputSchema>;

const PredictVehicleFailureOutputSchema = z.object({
  predictedFailures: z.array(
    z.object({
      component: z.string().describe('The component predicted to fail.'),
      failureType: z.string().describe('The type of failure predicted.'),
      priority: z.enum(['HIGH', 'MEDIUM', 'LOW']).describe('The priority of the predicted failure.'),
      confidence: z.number().describe('Confidence level of the prediction (0-1).'),
      suggestedActions: z.string().describe('Suggested actions to mitigate the failure.'),
    })
  ).describe('A list of predicted vehicle failures.'),
});
export type PredictVehicleFailureOutput = z.infer<typeof PredictVehicleFailureOutputSchema>;

export async function predictVehicleFailure(input: PredictVehicleFailureInput): Promise<PredictVehicleFailureOutput> {
    const prompt = `You are an AI diagnosis agent specializing in predicting vehicle failures.

    Analyze the provided sensor data and maintenance logs for vehicle ID ${input.vehicleId} to predict potential failures.

    Sensor Data: ${JSON.stringify(input.sensorData)}
    Maintenance Logs: ${input.maintenanceLogs}

    Based on your analysis, predict potential failures, assign a priority (HIGH, MEDIUM, LOW) to each, and suggest actions to mitigate the failures. Include a confidence score (0-1) for each prediction.
    Return a valid JSON object with the following structure:
    {
      "predictedFailures": [
        {
          "component": "string",
          "failureType": "string",
          "priority": "HIGH" | "MEDIUM" | "LOW",
          "confidence": number,
          "suggestedActions": "string"
        }
      ]
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

    return PredictVehicleFailureOutputSchema.parse(JSON.parse(result));
}
