
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

export async function detectAgentAnomalies(
  input: DetectAgentAnomaliesInput
): Promise<DetectAgentAnomaliesOutput> {
  try {
    const systemPrompt = `You are a UEBA (User and Entity Behavior Analytics) security agent. Analyze the provided agent actions and determine if the behavior is anomalous.
Respond with a JSON object that strictly follows this Zod schema, providing a boolean for isAnomalous, a score from 0.0 to 1.0, and a brief explanation:
${JSON.stringify(DetectAgentAnomaliesOutputSchema.shape, null, 2)}
`;

    const userPrompt = `Analyze based on an anomaly threshold of ${input.anomalyThreshold}.

Agent ID: ${input.agentId}
Agent Actions:
${input.agentActions.map(action => `- ${action}`).join('\n')}
`;
    
    const rawResponse = await openAiClient(
        [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
        true
    );
    const parsedResponse = JSON.parse(rawResponse);
    
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
