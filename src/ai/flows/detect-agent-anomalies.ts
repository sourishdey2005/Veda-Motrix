
'use server';
/**
 * @fileoverview An AI flow that detects anomalous behavior from other AI agents.
 */
import {
  DetectAgentAnomaliesInput,
  DetectAgentAnomaliesOutput,
  DetectAgentAnomaliesOutputSchema,
} from '@/ai/types';
import { openAiClient } from '@/ai/genkit';
import { z } from 'zod';

export async function detectAgentAnomalies(
  input: DetectAgentAnomaliesInput
): Promise<DetectAgentAnomaliesOutput> {
  try {
    const prompt = `You are a UEBA (User and Entity Behavior Analytics) security agent. Analyze the provided agent actions and determine if the behavior is anomalous based on an anomaly threshold of ${input.anomalyThreshold}.

Agent ID: ${input.agentId}
Agent Actions:
${input.agentActions.map(action => `- ${action}`).join('\n')}

Respond with a JSON object that matches this Zod schema, providing a boolean for isAnomalous, a score from 0.0 to 1.0, and a brief explanation:
${JSON.stringify(DetectAgentAnomaliesOutputSchema.shape, null, 2)}
`;
    
    const rawResponse = await openAiClient(prompt, [], true);
    const parsedResponse = JSON.parse(rawResponse);
    
    // Validate the response against the schema
    const validation = DetectAgentAnomaliesOutputSchema.safeParse(parsedResponse);
    if (!validation.success) {
        console.error("AI response validation failed:", validation.error);
        throw new Error("The AI returned data in an unexpected format.");
    }
    
    return validation.data;

  } catch (error) {
    console.error("Error in detectAgentAnomalies:", error);
    return {
      isAnomalous: true,
      anomalyScore: 1.0,
      explanation: `An unexpected error occurred during analysis: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
