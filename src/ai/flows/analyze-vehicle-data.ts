
'use server';
/**
 * @fileoverview An AI flow that analyzes vehicle sensor data for anomalies and maintenance needs.
 */
import {
  AnalyzeVehicleDataInput,
  AnalyzeVehicleDataOutput,
  AnalyzeVehicleDataOutputSchema,
} from '@/ai/types';
import {openAiClient} from '@/ai/genkit';
import {ChatCompletionMessageParam} from 'openai/resources/chat';

export async function analyzeVehicleData(
  input: AnalyzeVehicleDataInput
): Promise<AnalyzeVehicleDataOutput> {
  try {
    const systemPrompt = `You are a master agent responsible for analyzing vehicle sensor data for anomalies and maintenance needs.
Respond with a JSON object that strictly follows this Zod schema. Do not include any extra text or formatting outside of the JSON object itself:
${JSON.stringify(AnalyzeVehicleDataOutputSchema.shape, null, 2)}

Your response should contain a list of detected anomalies and a list of suggested maintenance needs. If none are found, return empty arrays.
`;

    const userPrompt = `Analyze the provided sensor data and logs to identify potential issues.

Vehicle ID: ${input.vehicleId}
Sensor Data (JSON): ${input.sensorDataJson}
Maintenance Logs: ${input.maintenanceLogs}
`;

    const messages: ChatCompletionMessageParam[] = [
      {role: 'system', content: systemPrompt},
      {role: 'user', content: userPrompt},
    ];

    const rawResponse = await openAiClient(messages, true);
    const parsedResponse = JSON.parse(rawResponse);

    const validation =
      AnalyzeVehicleDataOutputSchema.safeParse(parsedResponse);
    if (!validation.success) {
      console.error('AI response validation failed:', validation.error);
      throw new Error('The AI returned data in an unexpected format.');
    }

    const result = validation.data;

    return {
      anomalies:
        result.anomalies.length > 0
          ? result.anomalies
          : ['No anomalies detected.'],
      maintenanceNeeds:
        result.maintenanceNeeds.length > 0
          ? result.maintenanceNeeds
          : ['No immediate maintenance needs identified.'],
    };
  } catch (error) {
    console.error('Error in analyzeVehicleData:', error);
    return {
      anomalies: ['Error processing data'],
      maintenanceNeeds: [
        `An unexpected error occurred: ${
          error instanceof Error ? error.message : String(error)
        }`,
      ],
    };
  }
}
