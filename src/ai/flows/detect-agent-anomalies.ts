
'use server';
/**
 * @fileoverview An AI flow that detects anomalous behavior from other AI agents.
 */
import {
  DetectAgentAnomaliesInput,
  DetectAgentAnomaliesInputSchema,
  DetectAgentAnomaliesOutput,
  DetectAgentAnomaliesOutputSchema,
} from '@/ai/types';
import {ai} from '@/ai/genkit';
import {z} from 'zod';

export async function detectAgentAnomalies(
  input: DetectAgentAnomaliesInput
): Promise<DetectAgentAnomaliesOutput> {
  const detectionFlow = ai.defineFlow(
    {
      name: 'agentAnomalyDetectionFlow',
      inputSchema: DetectAgentAnomaliesInputSchema,
      outputSchema: DetectAgentAnomaliesOutputSchema,
    },
    async ({agentId, agentActions, anomalyThreshold}) => {
      const llmResponse = await ai.generate({
        model: 'gemini-1.5-flash-latest',
        prompt: `You are a UEBA (User and Entity Behavior Analytics) security agent. Analyze the provided agent actions and determine if the behavior is anomalous based on a threshold of ${anomalyThreshold}.

Agent ID: ${agentId}
Agent Actions:
${agentActions.map(action => `- ${action}`).join('\n')}
`,
        output: {
          schema: DetectAgentAnomaliesOutputSchema,
        },
      });
      return llmResponse.output()!;
    }
  );

  try {
    return await detectionFlow(input);
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
