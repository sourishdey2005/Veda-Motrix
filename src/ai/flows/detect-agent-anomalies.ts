
'use server';
/**
 * @fileoverview An AI flow that detects anomalous behavior from other AI agents.
 */
import { aiClient, textModel } from '@/ai/genkit';
import {
  DetectAgentAnomaliesInput,
  DetectAgentAnomaliesOutput,
  DetectAgentAnomaliesOutputSchema,
} from '@/ai/types';

export async function detectAgentAnomalies(
  input: DetectAgentAnomaliesInput
): Promise<DetectAgentAnomaliesOutput> {
  try {
    const prompt = `You are a UEBA (User and Entity Behavior Analytics) security agent. Analyze the provided agent actions and determine if the behavior is anomalous based on a threshold of ${input.anomalyThreshold}. Respond with a valid JSON object matching this schema: ${JSON.stringify(DetectAgentAnomaliesOutputSchema.shape)}.

Agent ID: ${input.agentId}
Agent Actions:
${input.agentActions.map(action => `- ${action}`).join('\n')}
`;

    const response = await aiClient.chat({
      model: textModel,
      messages: [
        { role: 'system', content: 'You are a helpful assistant that only returns valid JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0,
      topP: 1,
    });

    const message = response.choices[0]?.message?.content;
    if (!message) {
      throw new Error('AI returned an empty response.');
    }

    try {
      const parsed = DetectAgentAnomaliesOutputSchema.parse(JSON.parse(message));
      return parsed;
    } catch (e) {
      console.error("Failed to parse AI JSON response:", e);
       return {
        isAnomalous: true,
        anomalyScore: 1.0,
        explanation: `AI returned an invalid response format. Raw response: ${message}`,
      };
    }

  } catch (error) {
    console.error('Error in detectAgentAnomalies:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      isAnomalous: true,
      anomalyScore: 1.0,
      explanation: `An unexpected error occurred during analysis: ${errorMessage}`,
    };
  }
}
