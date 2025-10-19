
'use server';

import { GoogleGenAI } from "@google/genai";
import {
  type HandleCustomerEnquiryInput,
  type HandleCustomerEnquiryOutput,
} from '@/ai/types';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable not set.");
}
const genAI = new GoogleGenAI(apiKey);

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
    const result = await genAI.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" },
    });
    const response = result.response;
    const jsonString = response.text();
    return JSON.parse(jsonString) as HandleCustomerEnquiryOutput;
  } catch (error) {
    console.error("Error handling customer enquiry:", error);
    throw new Error("Failed to handle customer enquiry.");
  }
}
