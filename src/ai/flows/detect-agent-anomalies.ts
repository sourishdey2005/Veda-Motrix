
'use server';
/**
 * @fileoverview A Genkit flow that detects anomalous behavior from other AI agents.
 */
import {
  DetectAgentAnomaliesInput,
  DetectAgentAnomaliesOutput,
} from '@/ai/types';
import { ai } from '@/ai/genkit';

export async function detectAgentAnomalies(
  input: DetectAgentAnomaliesInput
): Promise<DetectAgentAnomaliesOutput> {
  try {
    const prompt = `You are a UEBA (User and Entity Behavior Analytics) security agent. Analyze the provided agent actions and determine if the behavior is anomalous based on an anomaly threshold of ${input.anomalyThreshold}.

Agent ID: ${input.agentId}
Agent Actions:
${input.agentActions.map(action => `- ${action}`).join('\n')}

Respond in the following format on separate lines:
IS_ANOMALOUS: [true or false]
ANOMALY_SCORE: [A score from 0.0 to 1.0]
EXPLANATION: [A brief explanation of your reasoning]
`;

    const { output } = await ai.generate({
      model: 'googleai/gemini-1.5-flash-latest',
      prompt: prompt,
    });
    
    if (!output || !output.text) {
      throw new Error('No output from AI');
    }

    const lines = output.text.split('\n');
    const isAnomalous = lines.find(l => l.startsWith('IS_ANOMALOUS:'))?.split(':')[1].trim() === 'true';
    const anomalyScore = parseFloat(lines.find(l => l.startsWith('ANOMALY_SCORE:'))?.split(':')[1].trim() || '0');
    const explanation = lines.find(l => l.startsWith('EXPLANATION:'))?.split(':')[1].trim() || 'No explanation provided.';

    return { isAnomalous, anomalyScore, explanation };

  } catch (error) {
    console.error("Error in detectAgentAnomalies:", error);
    return {
      isAnomalous: true,
      anomalyScore: 1.0,
      explanation: `An unexpected error occurred during analysis: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
