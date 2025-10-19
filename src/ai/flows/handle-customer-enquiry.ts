
'use server';

import { genAI } from "@/ai/google-ai";
import {
  type HandleCustomerEnquiryInput,
  type HandleCustomerEnquiryOutput,
} from '@/ai/types';

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: { responseMimeType: "application/json" },
});

export async function handleCustomerEnquiry(
  input: HandleCustomerEnquiryInput
): Promise<HandleCustomerEnquiryOutput> {

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
    
    Return a JSON object with a single key "conversationSummary" containing the generated script as a string.
    Example: { "conversationSummary": "Agent: ...\nOwner: ...\nAgent: ...\nOwner: ..." }`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const jsonString = response.text();
    return JSON.parse(jsonString) as HandleCustomerEnquiryOutput;
  } catch (error) {
    console.error("Error handling customer enquiry:", error);
    throw new Error("Failed to handle customer enquiry.");
  }
}
