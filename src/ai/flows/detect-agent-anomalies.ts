
'use server';
/**
 * @fileoverview A Genkit flow that detects anomalous behavior from other AI agents.
 */
import {
  DetectAgentAnomaliesInput,
  DetectAgentAnomaliesOutput,
  DetectAgentAnomaliesOutputSchema,
} from '@/ai/types';
import { GoogleGenerativeAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable not set.");
}
const genAI = new GoogleGenerativeAI(apiKey);

export async function detectAgentAnomalies(
  input: DetectAgentAnomaliesInput
): Promise<DetectAgentAnomaliesOutput> {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
      generationConfig: { responseMimeType: "application/json" },
    });

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

Output a JSON object that conforms to this schema:
${JSON.stringify(DetectAgentAnomaliesOutputSchema.jsonSchema, null, 2)}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const parsed = JSON.parse(text);
    return DetectAgentAnomaliesOutputSchema.parse(parsed);

  } catch (error) {
    console.error("Error in detectAgentAnomalies:", error);
    return {
      isAnomalous: true,
      anomalyScore: 1.0,
      explanation: `An unexpected error occurred during analysis: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
