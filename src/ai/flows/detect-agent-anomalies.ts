
'use server';

/**
 * @fileOverview An AI agent that detects unauthorized or abnormal behavior from other agents.
 */
import openai from '@/ai/client';

export interface DetectAgentAnomaliesInput {
  agentId: string;
  agentActions: string[];
  anomalyThreshold: number;
}

export interface DetectAgentAnomaliesOutput {
  isAnomalous: boolean;
  anomalyScore: number;
  explanation: string;
}

export async function detectAgentAnomalies(input: DetectAgentAnomaliesInput): Promise<DetectAgentAnomaliesOutput> {
  const prompt = `You are a UEBA (User and Entity Behavior Analytics) security agent responsible for detecting unauthorized or abnormal behavior from other AI agents.
    You will receive the ID of the agent to monitor, a list of recent actions performed by the agent, and an anomaly threshold.
    Based on this information, you will determine whether the agent's behavior is anomalous and provide an anomaly score and explanation.

    Agent ID: ${input.agentId}
    Agent Actions: ${input.agentActions.join(', ')}
    Anomaly Threshold: ${input.anomalyThreshold}

    Consider factors such as:
    - Deviation from the agent's typical behavior pattern.
    - Unauthorized actions.
    - Actions that violate security policies.
    - Unusual frequency of actions.

    Return a JSON object with the following structure: { "isAnomalous": boolean, "anomalyScore": number, "explanation": "string" }.
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const responseJson = completion.choices[0].message?.content;
    if (!responseJson) {
      throw new Error('AI failed to generate a response.');
    }
    return JSON.parse(responseJson) as DetectAgentAnomaliesOutput;
  } catch (error) {
    console.error('Error in detectAgentAnomalies:', error);
    throw new Error('Failed to detect agent anomalies.');
  }
}
