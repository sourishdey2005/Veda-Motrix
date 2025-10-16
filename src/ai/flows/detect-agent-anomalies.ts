
'use server';

/**
 * @fileOverview An AI agent that detects unauthorized or abnormal behavior from other agents.
 *
 * - detectAgentAnomalies - A function that handles the detection of agent anomalies.
 * - DetectAgentAnomaliesInput - The input type for the detectAgentAnomalies function.
 * - DetectAgentAnomaliesOutput - The return type for the detectAgentAnomalies function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {z} from 'genkit';

const DetectAgentAnomaliesInputSchema = z.object({
  agentId: z.string().describe('The ID of the agent to monitor.'),
  agentActions: z.array(z.string()).describe('The recent actions performed by the agent.'),
  anomalyThreshold: z.number().describe('The threshold above which an action is considered anomalous.'),
});
export type DetectAgentAnomaliesInput = z.infer<typeof DetectAgentAnomaliesInputSchema>;

const DetectAgentAnomaliesOutputSchema = z.object({
  isAnomalous: z.boolean().describe('Whether the agent behavior is anomalous.'),
  anomalyScore: z.number().describe('A score indicating the degree of anomaly.'),
  explanation: z.string().describe('An explanation of why the behavior is considered anomalous.'),
});
export type DetectAgentAnomaliesOutput = z.infer<typeof DetectAgentAnomaliesOutputSchema>;

export async function detectAgentAnomalies(input: DetectAgentAnomaliesInput): Promise<DetectAgentAnomaliesOutput> {
  return detectAgentAnomaliesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectAgentAnomaliesPrompt',
  model: googleAI.model('gemini-2.5-flash'),
  input: {schema: DetectAgentAnomaliesInputSchema},
  output: {schema: DetectAgentAnomaliesOutputSchema},
  prompt: `You are a UEBA (User and Entity Behavior Analytics) security agent responsible for detecting unauthorized or abnormal behavior from other AI agents.

You will receive the ID of the agent to monitor, a list of recent actions performed by the agent, and an anomaly threshold.

Based on this information, you will determine whether the agent's behavior is anomalous and provide an anomaly score and explanation.

Agent ID: {{{agentId}}}
Agent Actions: {{#each agentActions}}- {{{this}}}\n{{/each}}
Anomaly Threshold: {{{anomalyThreshold}}}

Consider factors such as:
- Deviation from the agent's typical behavior pattern.
- Unauthorized actions.
- Actions that violate security policies.
- Unusual frequency of actions.

Return whether the agent is anomalous (isAnomalous), a numerical anomaly score (anomalyScore), and an explanation of your reasoning (explanation).`,
});

const detectAgentAnomaliesFlow = ai.defineFlow(
  {
    name: 'detectAgentAnomaliesFlow',
    inputSchema: DetectAgentAnomaliesInputSchema,
    outputSchema: DetectAgentAnomaliesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
