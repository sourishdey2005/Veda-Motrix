
'use server';
/**
 * @fileoverview A Genkit flow that detects anomalous behavior from other AI agents.
 */
import {
  DetectAgentAnomaliesInput,
  DetectAgentAnomaliesOutput,
  DetectAgentAnomaliesOutputSchema,
} from '@/ai/types';
import { ai } from '@/ai/genkit';
import { z } from 'zod';

export async function detectAgentAnomalies(
  input: DetectAgentAnomaliesInput
): Promise<DetectAgentAnomaliesOutput> {
  try {
    const prompt = `You are a UEBA (User and Entity Behavior Analytics) security agent responsible for detecting unauthorized or abnormal behavior from other AI agents.
You will receive the ID of the agent to monitor, a list of recent actions performed by the agent, and an anomaly threshold.
Based on this information, you will determine whether the agent's behavior is anomalous and provide an anomaly score and explanation.

Agent ID: ${input.agentId}
Agent Actions: ${input.agentActions.map(action => `- ${action}`).join('\n')}
Anomaly Threshold: ${input.anomalyThreshold}

Consider factors such as:
- Deviation from the agent's typical behavior pattern.
- Unauthorized actions.
- Actions that violate security policies.
- Unusual frequency of actions.

Output a JSON object that conforms to the following Zod schema:
${JSON.stringify(DetectAgentAnomaliesOutputSchema.shape)}
`;

    const { output } = await ai.generate({
      model: 'googleai/gemini-pro',
      prompt: prompt,
      output: {
        format: 'json',
        schema: DetectAgentAnomaliesOutputSchema,
      },
    });
    
    if (!output) {
      throw new Error('No output from AI');
    }
    return output;
  } catch (error) {
    console.error("Error in detectAgentAnomalies:", error);
    return {
      isAnomalous: true,
      anomalyScore: 1.0,
      explanation: `An unexpected error occurred during analysis: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
