
'use server';
/**
 * @fileoverview A Genkit flow that detects anomalous behavior from other AI agents.
 */
import {
  DetectAgentAnomaliesInput,
  DetectAgentAnomaliesInputSchema,
  DetectAgentAnomaliesOutput,
  DetectAgentAnomaliesOutputSchema,
} from '@/ai/types';
import { ai } from '@/ai/genkit';

const detectAnomaliesPrompt = ai.definePrompt(
  {
    name: 'detectAgentAnomalies',
    input: { schema: DetectAgentAnomaliesInputSchema },
    output: { schema: DetectAgentAnomaliesOutputSchema },
    prompt: `You are a UEBA (User and Entity Behavior Analytics) security agent responsible for detecting unauthorized or abnormal behavior from other AI agents.
You will receive the ID of the agent to monitor, a list of recent actions performed by the agent, and an anomaly threshold.
Based on this information, you will determine whether the agent's behavior is anomalous and provide an anomaly score and explanation.

Agent ID: {{agentId}}
Agent Actions: {{#each agentActions}}- {{.}}{{/each}}
Anomaly Threshold: {{anomalyThreshold}}

Consider factors such as:
- Deviation from the agent's typical behavior pattern.
- Unauthorized actions.
- Actions that violate security policies.
- Unusual frequency of actions.

Output a JSON object that conforms to the schema.`,
  },
);

const detectAnomaliesFlow = ai.defineFlow({
    name: 'detectAnomaliesFlow',
    inputSchema: DetectAgentAnomaliesInputSchema,
    outputSchema: DetectAgentAnomaliesOutputSchema,
}, async (input) => {
    const result = await detectAnomaliesPrompt(input);
    return result;
});


export async function detectAgentAnomalies(
  input: DetectAgentAnomaliesInput
): Promise<DetectAgentAnomaliesOutput> {
  try {
    const result = await detectAnomaliesFlow(input);
    return result;
  } catch (error) {
    console.error("Error in detectAgentAnomalies:", error);
    return {
      isAnomalous: true,
      anomalyScore: 1.0,
      explanation: `An unexpected error occurred during analysis: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
