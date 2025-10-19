
'use server';

import { genAI } from "@/ai/google-ai";
import {
  type DetectAgentAnomaliesInput,
  type DetectAgentAnomaliesOutput,
} from '@/ai/types';

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: { responseMimeType: "application/json" },
});

export async function detectAgentAnomalies(
  input: DetectAgentAnomaliesInput
): Promise<DetectAgentAnomaliesOutput> {

  const prompt = `You are a UEBA (User and Entity Behavior Analytics) security agent responsible for detecting unauthorized or abnormal behavior from other AI agents.
    You will receive the ID of the agent to monitor, a list of recent actions performed by the agent, and an anomaly threshold.
    Based on this information, you will determine whether the agent's behavior is anomalous and provide an anomaly score and explanation.

    Agent ID: ${input.agentId}
    Agent Actions: ${JSON.stringify(input.agentActions)}
    Anomaly Threshold: ${input.anomalyThreshold}

    Consider factors such as:
    - Deviation from the agent's typical behavior pattern.
    - Unauthorized actions.
    - Actions that violate security policies.
    - Unusual frequency of actions.

    Return a JSON object with the following structure:
    {
      "isAnomalous": boolean,
      "anomalyScore": number (0-1),
      "explanation": "string"
    }`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const jsonString = response.text();
    return JSON.parse(jsonString) as DetectAgentAnomaliesOutput;
  } catch (error) {
    console.error("Error detecting agent anomalies:", error);
    throw new Error("Failed to detect agent anomalies.");
  }
}
