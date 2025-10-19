
'use server';
/**
 * @fileoverview An AI flow that simulates a customer engagement conversation.
 */
import {
  HandleCustomerEnquiryInput,
  HandleCustomerEnquiryInputSchema,
  HandleCustomerEnquiryOutput,
  HandleCustomerEnquiryOutputSchema,
} from '@/ai/types';
import {ai} from '@/ai/genkit';
import {z} from 'zod';

export async function handleCustomerEnquiry(
  input: HandleCustomerEnquiryInput
): Promise<HandleCustomerEnquiryOutput> {
  const enquiryFlow = ai.defineFlow(
    {
      name: 'customerEnquiryFlow',
      inputSchema: HandleCustomerEnquiryInputSchema,
      outputSchema: HandleCustomerEnquiryOutputSchema,
    },
    async ({userName, vehicleIssue, recommendedMaintenance}) => {
      const llmResponse = await ai.generate({
        model: 'gemini-1.5-flash-latest',
        prompt: `You are a customer engagement agent for VEDA-MOTRIX AI. Your goal is to inform vehicle owners about potential issues and recommended maintenance in a helpful and friendly manner.

Generate a short, simulated conversation script (5-6 lines) between the AI Agent and the Owner based on the following details. The script should start with a greeting, explain the issue and the recommended maintenance, offer assistance with scheduling, and end after the owner replies.

Vehicle Owner's Name: ${userName}
Vehicle Issue: ${vehicleIssue}
Recommended Maintenance: ${recommendedMaintenance}

Example Format:
Agent: [Your greeting and explanation]
Owner: [Owner's response]
Agent: [Offer assistance with scheduling]
Owner: [Owner's reply]

Provide the final conversation script as a single block of text.`,
      });
      return {conversationSummary: llmResponse.text()};
    }
  );

  try {
    return await enquiryFlow(input);
  } catch (error) {
    console.error('Error in handleCustomerEnquiry:', error);
    return {
      conversationSummary: `Failed to generate conversation. Error: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}
