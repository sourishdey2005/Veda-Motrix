
'use server';
/**
 * @fileoverview An AI flow that simulates a customer engagement conversation.
 */
import { aiClient, textModel } from '@/ai/genkit';
import { isUnexpected } from '@azure-rest/ai-inference';
import {
  HandleCustomerEnquiryInput,
  HandleCustomerEnquiryOutput,
} from '@/ai/types';

export async function handleCustomerEnquiry(
  input: HandleCustomerEnquiryInput
): Promise<HandleCustomerEnquiryOutput> {
  try {
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

Provide the final conversation script as a single block of text.`;

    const response = await aiClient.path("/chat/completions").post({
      body: {
        model: textModel,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        top_p: 1,
      }
    });

    if (isUnexpected(response)) {
      const errorBody = response.body as any;
      throw new Error(errorBody?.error?.message || 'An unexpected error occurred.');
    }

    const conversationSummary = response.body.choices[0]?.message?.content;

    return { conversationSummary: conversationSummary || "The AI could not generate a conversation." };
  } catch (error) {
    console.error('Error in handleCustomerEnquiry:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      conversationSummary: `Failed to generate conversation. Error: ${errorMessage}`,
    };
  }
}
