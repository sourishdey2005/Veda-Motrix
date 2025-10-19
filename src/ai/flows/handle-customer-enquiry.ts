
'use server';
/**
 * @fileoverview A Genkit flow that simulates a customer engagement conversation.
 */
import {
  HandleCustomerEnquiryInput,
  HandleCustomerEnquiryOutput,
  HandleCustomerEnquiryOutputSchema,
} from '@/ai/types';
import { GoogleGenerativeAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable not set.");
}
const genAI = new GoogleGenerativeAI(apiKey);

export async function handleCustomerEnquiry(
  input: HandleCustomerEnquiryInput
): Promise<HandleCustomerEnquiryOutput> {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `You are a customer engagement agent for VEDA-MOTRIX AI. Your goal is to inform vehicle owners about potential issues and recommended maintenance in a helpful and friendly manner.

Generate a short, simulated conversation script (5-6 lines) between the AI Agent and the Owner based on the following details. The script should start with a greeting, explain the issue and the recommended maintenance, offer assistance with scheduling, and end after the owner replies.

Vehicle Owner's Name: ${input.userName}
Vehicle Issue: ${input.vehicleIssue}
Recommended Maintenance: ${input.recommendedMaintenance}

Example Format:
Agent: [Your greeting and explanation]
Owner: [Owner's response]
Agent: [Offer assistance with scheduling]
Owner: [Owner's reply]

Output a JSON object that conforms to this schema:
${JSON.stringify(HandleCustomerEnquiryOutputSchema.jsonSchema, null, 2)}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const parsed = JSON.parse(text);
    return HandleCustomerEnquiryOutputSchema.parse(parsed);

  } catch (error) {
    console.error("Error in handleCustomerEnquiry:", error);
    return {
      conversationSummary: `Failed to generate conversation. Error: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
