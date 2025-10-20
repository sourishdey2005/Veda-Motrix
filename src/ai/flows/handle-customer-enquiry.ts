
'use server';
/**
 * @fileoverview An AI flow that simulates a customer engagement conversation.
 */
import {ai} from '@/ai/genkit';
import {z} from 'zod';
import {
  HandleCustomerEnquiryInput,
  HandleCustomerEnquiryInputSchema,
  HandleCustomerEnquiryOutput,
  HandleCustomerEnquiryOutputSchema,
} from '@/ai/types';

const customerEnquiryFlow = ai.defineFlow(
  {
    name: 'customerEnquiryFlow',
    inputSchema: HandleCustomerEnquiryInputSchema,
    outputSchema: HandleCustomerEnquiryOutputSchema,
  },
  async (input: HandleCustomerEnquiryInput) => {
    const llmResponse = await ai.generate({
      model: 'gemini-1.5-flash',
      prompt: `You are a customer engagement agent for VEDA-MOTRIX AI. Your goal is to inform vehicle owners about potential issues and recommended maintenance in a helpful and friendly manner.

Generate a short, simulated conversation script (5-6 lines) between the AI Agent and the Owner based on the following details. The script should start with a greeting, explain the issue and the recommended maintenance, offer assistance with scheduling, and end after the owner replies.

Vehicle Owner's Name: ${input.userName}
Vehicle Issue: ${input.vehicleIssue}
Recommended Maintenance: ${input.recommendedMaintenance}

Example Format:
Agent: [Your greeting and explanation]
Owner: [Owner's response]
Agent: [Offer assistance with scheduling]
Owner: [Owner's reply]

Provide the final conversation script as a single block of text.`,
    });

    return {conversationSummary: llmResponse.text};
  }
);

export async function handleCustomerEnquiry(
  input: HandleCustomerEnquiryInput
): Promise<HandleCustomerEnquiryOutput> {
  try {
    return await customerEnquiryFlow(input);
  } catch (error) {
    console.error('Error in handleCustomerEnquiry:', error);
    return {
      conversationSummary: `Failed to generate conversation. Error: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}
