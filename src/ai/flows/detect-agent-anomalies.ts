
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
import { z } from 'zod';

const detectAnomaliesPrompt = ai.definePrompt(
  {
    name: 'detectAnomaliesPrompt',
    input: { schema: DetectAgentAnomaliesInputSchema },
    output: { schema: DetectAgentAnomaliesOutputSchema },
    model: 'googleai/gemini-1.5-flash-latest',
    prompt: `You are a UEBA (User and Entity Behavior Analytics) security agent. Analyze the provided agent actions and determine if the behavior is anomalous based on an anomaly threshold of {{{anomalyThreshold}}}.

Agent ID: {{{agentId}}}
Agent Actions:
{{#each agentActions}}
- {{{this}}}
{{/each}}

Respond with a boolean for isAnomalous, a score from 0.0 to 1.0, and a brief explanation, in the format defined by the output schema.
`,
  },
);

const detectAgentAnomaliesFlow = ai.defineFlow(
  {
    name: 'detectAgentAnomaliesFlow',
    inputSchema: DetectAgentAnomaliesInputSchema,
    outputSchema: DetectAgentAnomaliesOutputSchema,
  },
  async (input) => {
    const { output } = await detectAnomaliesPrompt(input);
    if (!output) {
      throw new Error('Analysis failed: AI did not return a structured response.');
    }
    return output;
  }
);


export async function detectAgentAnomalies(
  input: DetectAgentAnomaliesInput
): Promise<DetectAgentAnomaliesOutput> {
  try {
    return await detectAgentAnomaliesFlow(input);
  } catch (error) {
    console.error("Error in detectAgentAnomalies:", error);
    return {
      isAnomalous: true,
      anomalyScore: 1.0,
      explanation: `An unexpected error occurred during analysis: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
