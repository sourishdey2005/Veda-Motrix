'use server';
/**
 * @fileoverview A Genkit flow that simulates a customer engagement conversation.
 */
import {
  HandleCustomerEnquiryInput,
  HandleCustomerEnquiryOutput,
} from '@/ai/types';
import { ai } from '@/ai/genkit';

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

Provide the final conversation script as a single block of plain text.
`;

    const { output } = await ai.generate({
      model: 'googleai/gemini-pro',
      prompt: prompt,
    });
    
    if (!output || !output.text) {
      throw new Error('No output from AI');
    }
    return { conversationSummary: output.text };
  } catch (error) {
    console.error("Error in handleCustomerEnquiry:", error);
    return {
      conversationSummary: `Failed to generate conversation. Error: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
