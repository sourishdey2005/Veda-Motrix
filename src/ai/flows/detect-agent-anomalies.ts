
'use server';
/**
 * @fileoverview A Genkit flow that detects anomalous behavior from other AI agents.
 */
import {ai} from '@/ai/genkit';
import {
  DetectAgentAnomaliesInput,
  DetectAgentAnomaliesInputSchema,
  DetectAgentAnomaliesOutput,
  DetectAgentAnomaliesOutputSchema,
} from '@/ai/types';
import {z} from 'zod';

export async function detectAgentAnomalies(
  input: DetectAgentAnomaliesInput
): Promise<DetectAgentAnomaliesOutput> {
  const prompt = ai.definePrompt(
    {
      name: 'agentAnomaliesPrompt',
      input: {schema: DetectAgentAnomaliesInputSchema},
      output: {schema: DetectAgentAnomaliesOutputSchema},
      prompt: `You are a UEBA (User and Entity Behavior Analytics) security agent responsible for detecting unauthorized or abnormal behavior from other AI agents.
You will receive the ID of the agent to monitor, a list of recent actions performed by the agent, and an anomaly threshold.
Based on this information, you will determine whether the agent's behavior is anomalous and provide an anomaly score and explanation.

Agent ID: {{agentId}}
Agent Actions: {{agentActions}}
Anomaly Threshold: {{anomalyThreshold}}

Consider factors such as:
- Deviation from the agent's typical behavior pattern.
- Unauthorized actions.
- Actions that violate security policies.
- Unusual frequency of actions.
`,
    },
    async input => {
      const {output} = await ai.generate({
        prompt: input,
        model: 'googleai/gemini-1.5-flash',
        config: {
          output: {
            format: 'json',
            schema: DetectAgentAnomaliesOutputSchema,
          },
        },
      });
      return output!;
    }
  );
  return prompt(input);
}
