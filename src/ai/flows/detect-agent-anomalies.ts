
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
  async (input: DetectAgentAnomaliesInput): Promise<DetectAgentAnomaliesOutput> => {
    const llmResponse = await ai.generate({
      model: 'gemini-pro',
      prompt: `You are a UEBA (User and Entity Behavior Analytics) security agent. Analyze the provided agent actions and determine if the behavior is anomalous based on a threshold of ${input.anomalyThreshold}. Respond with a valid JSON object matching the requested schema.

Agent ID: ${input.agentId}
Agent Actions:
${input.agentActions.map(action => `- ${action}`).join('\n')}
`,
      output: {
        schema: DetectAgentAnomaliesOutputSchema,
      },
    });

    const result = llmResponse.output;

    if (result) {
        return result;
    }

    // Fallback parsing if structured output fails
    try {
        const parsed = DetectAgentAnomaliesOutputSchema.parse(JSON.parse(llmResponse.text));
        return parsed;
    } catch(e) {
        console.error("Failed to get structured output or parse text for agent anomalies", e);
        return {
            isAnomalous: true,
            anomalyScore: 1.0,
            explanation: 'The AI failed to return a valid response. Please try again.',
        }
    }
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
