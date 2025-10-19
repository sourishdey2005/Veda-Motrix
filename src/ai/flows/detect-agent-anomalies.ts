'use server';

import {ai} from '@/ai/genkit';
import {
  DetectAgentAnomaliesInputSchema,
  DetectAgentAnomaliesOutputSchema,
  type DetectAgentAnomaliesInput,
  type DetectAgentAnomaliesOutput,
} from '@/ai/types';

const prompt = ai.definePrompt(
  {
    name: 'agentAnomaliesPrompt',
    input: {schema: DetectAgentAnomaliesInputSchema},
    output: {schema: DetectAgentAnomaliesOutputSchema},
    prompt: `You are a UEBA (User and Entity Behavior Analytics) security agent responsible for detecting unauthorized or abnormal behavior from other AI agents.
    You will receive the ID of the agent to monitor, a list of recent actions performed by the agent, and an anomaly threshold.
    Based on this information, you will determine whether the agent's behavior is anomalous and provide an anomaly score and explanation.

    Agent ID: {{{agentId}}}
    Agent Actions: {{{agentActions}}}
    Anomaly Threshold: {{{anomalyThreshold}}}

    Consider factors such as:
    - Deviation from the agent's typical behavior pattern.
    - Unauthorized actions.
    - Actions that violate security policies.
    - Unusual frequency of actions.
  `,
  },
  async (input) => {
    return {
      model: 'googleai/gemini-1.5-flash',
      output: {
        format: 'json',
      },
    };
  }
);

const detectAgentAnomaliesFlow = ai.defineFlow(
  {
    name: 'detectAgentAnomaliesFlow',
    inputSchema: DetectAgentAnomaliesInputSchema,
    outputSchema: DetectAgentAnomaliesOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('AI failed to generate a response.');
    }
    return output;
  }
);

export async function detectAgentAnomalies(
  input: DetectAgentAnomaliesInput
): Promise<DetectAgentAnomaliesOutput> {
  return detectAgentAnomaliesFlow(input);
}
