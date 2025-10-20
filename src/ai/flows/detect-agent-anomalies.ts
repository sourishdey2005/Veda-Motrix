
'use server';
/**
 * @fileoverview An AI flow that detects anomalous behavior from other AI agents.
 */
import {ai} from '@/ai/genkit';
import {z} from 'zod';
import {
  DetectAgentAnomaliesInput,
  DetectAgentAnomaliesInputSchema,
  DetectAgentAnomaliesOutput,
  DetectAgentAnomaliesOutputSchema,
} from '@/ai/types';

const agentAnomalyFlow = ai.defineFlow(
  {
    name: 'agentAnomalyFlow',
    inputSchema: DetectAgentAnomaliesInputSchema,
    outputSchema: DetectAgentAnomaliesOutputSchema,
  },
  async (input: DetectAgentAnomaliesInput) => {
    const llmResponse = await ai.generate({
      model: 'gemini-pro',
      prompt: `You are a UEBA (User and Entity Behavior Analytics) security agent. Analyze the provided agent actions and determine if the behavior is anomalous based on a threshold of ${input.anomalyThreshold}.

Agent ID: ${input.agentId}
Agent Actions:
${input.agentActions.map(action => `- ${action}`).join('\n')}
`,
      output: {
        schema: DetectAgentAnomaliesOutputSchema,
      },
    });

    const result = llmResponse.output;

    if (!result) {
      throw new Error('AI returned an invalid response format.');
    }
    return result;
  }
);

export async function detectAgentAnomalies(
  input: DetectAgentAnomaliesInput
): Promise<DetectAgentAnomaliesOutput> {
  try {
    return await agentAnomalyFlow(input);
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
