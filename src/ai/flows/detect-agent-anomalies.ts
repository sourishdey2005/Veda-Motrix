
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
    const result = await openAiClient<DetectAgentAnomaliesInput, DetectAgentAnomaliesOutput>({
      prompt: `You are a UEBA (User and Entity Behavior Analytics) security agent. Analyze the provided agent actions and determine if the behavior is anomalous based on a threshold of ${input.anomalyThreshold}.

Agent ID: ${input.agentId}
Agent Actions:
${input.agentActions.map(action => `- ${action}`).join('\n')}
`,
      response_model: {
        schema: DetectAgentAnomaliesOutputSchema,
        name: 'DetectAgentAnomaliesOutput',
      },
    });
    
    if (typeof result === 'string' || !result) {
        throw new Error('AI returned an invalid response format.');
    }
    
    return result;
    
  } catch (error) {
    console.error('Error in detectAgentAnomalies:', error);
    return {
      isAnomalous: true,
      anomalyScore: 1.0,
      explanation: `An unexpected error occurred during analysis: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}
