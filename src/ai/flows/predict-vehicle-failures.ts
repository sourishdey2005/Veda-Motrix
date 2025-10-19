
'use server';
/**
 * @fileoverview A Genkit flow that predicts vehicle failures from sensor data and maintenance logs.
 */
import {
  PredictVehicleFailureInput,
  PredictVehicleFailureOutput,
  PredictedFailure,
} from '@/ai/types';
import { ai } from '@/ai/genkit';

export async function predictVehicleFailure(
  input: PredictVehicleFailureInput
): Promise<PredictVehicleFailureOutput> {
  try {
    const prompt = `You are an AI diagnosis agent specializing in predicting vehicle failures.
Analyze the provided sensor data and maintenance logs for vehicle ID ${input.vehicleId} to predict potential failures.

Sensor Data: ${input.sensorDataJson}
Maintenance Logs: ${input.maintenanceLogs}

Based on your analysis, predict up to 3 potential failures. For each prediction, provide the component, failure type, priority (HIGH, MEDIUM, LOW), confidence score (0.0-1.0), and suggested actions.

Format each failure on a new line, using "||" as a separator between fields.
Example:
Brake Pads||Wear and Tear||HIGH||0.95||Replace front brake pads within 2 weeks.
Battery||Degradation||MEDIUM||0.80||Voltage dropping. Test and replacement recommended at next service.
`;

    const { output } = await ai.generate({
      model: 'googleai/gemini-pro',
      prompt: prompt,
    });

    if (!output || !output.text) {
      throw new Error('No output from AI');
    }
    
    const lines = output.text.split('\n').filter(Boolean);
    const predictedFailures: PredictedFailure[] = lines.map(line => {
        const parts = line.split('||');
        return {
            component: parts[0]?.trim() || "Unknown Component",
            failureType: parts[1]?.trim() || "Unknown Failure",
            priority: (parts[2]?.trim() as 'HIGH' | 'MEDIUM' | 'LOW') || 'LOW',
            confidence: parseFloat(parts[3]?.trim() || '0'),
            suggestedActions: parts[4]?.trim() || "No actions suggested.",
        };
    });

    return { predictedFailures };

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
