
'use server';
/**
 * @fileoverview An AI flow that simulates a customer engagement conversation.
 */
import { aiClient, textModel } from '@/ai/genkit';
import {
  HandleCustomerEnquiryInput,
  HandleCustomerEnquiryOutput,
} from '@/ai/types';

export async function handleCustomerEnquiry(
  input: HandleCustomerEnquiryInput
): Promise<HandleCustomerEnquiryOutput> {
  try {
    const prompt = `You are a customer engagement agent for VEDA-MOTRIX AI. Your goal is to inform vehicle owners about potential issues and recommended maintenance in a helpful, detailed, and empathetic manner.

Generate a comprehensive, simulated conversation script (at least 8-10 lines) between the AI Agent and the Owner based on the following details. The script should start with a friendly greeting, explain the issue and the recommended maintenance in detail, explain the benefits of proactive repair, offer assistance with scheduling, and end after the owner replies.

Vehicle Owner's Name: ${input.userName}
Vehicle Issue: ${input.vehicleIssue}
Recommended Maintenance: ${input.recommendedMaintenance}

Example Format:
Agent: [Your friendly greeting and detailed explanation of the issue.]
Owner: [Owner's response, maybe with a question.]
Agent: [Answer the question and explain the benefits of the recommended maintenance.]
Owner: [Owner's reply.]
Agent: [Offer clear assistance with scheduling an appointment.]
Owner: [Owner's confirmation.]

Provide the final, elaborate conversation script as a single block of text.`;

    const response = await aiClient.chat.completions.create({
      model: textModel,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      top_p: 1,
    });

    const conversationSummary = response.choices[0]?.message?.content;

    return { conversationSummary: conversationSummary || "The AI could not generate a conversation." };
  } catch (error) {
    console.error('Error in handleCustomerEnquiry:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      conversationSummary: `Failed to generate conversation. Error: ${errorMessage}`,
    };
  }
}
