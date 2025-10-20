'use server';
/**
 * @fileoverview An AI flow that detects anomalous behavior from other AI agents.
 */
import { genAI } from '@/ai/genkit';
import {
  DetectAgentAnomaliesInput,
  DetectAgentAnomaliesOutput,
  DetectAgentAnomaliesOutputSchema,
} from '@/ai/types';

export async function detectAgentAnomalies(
  input: DetectAgentAnomaliesInput
): Promise<DetectAgentAnomaliesOutput> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `You are a UEBA (User and Entity Behavior Analytics) security agent. Analyze the provided agent actions and determine if the behavior is anomalous based on a threshold of ${input.anomalyThreshold}. Respond with a valid JSON object matching this schema: ${JSON.stringify(DetectAgentAnomaliesOutputSchema.shape)}.

Agent ID: ${input.agentId}
Agent Actions:
${input.agentActions.map(action => `- ${action}`).join('\n')}
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const parsed = DetectAgentAnomaliesOutputSchema.parse(JSON.parse(responseText));
    return parsed;
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
