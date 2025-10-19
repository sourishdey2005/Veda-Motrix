
'use server';
/**
 * @fileoverview A Genkit flow that simulates a customer engagement conversation.
 */
import {
  HandleCustomerEnquiryInput,
  HandleCustomerEnquiryInputSchema,
  HandleCustomerEnquiryOutput,
  HandleCustomerEnquiryOutputSchema,
} from '@/ai/types';
import { ai } from '@/ai/genkit';

const enquiryPrompt = ai.definePrompt(
  {
    name: 'handleCustomerEnquiry',
    input: { schema: HandleCustomerEnquiryInputSchema },
    output: { schema: HandleCustomerEnquiryOutputSchema },
    prompt: `You are a customer engagement agent for VEDA-MOTRIX AI. Your goal is to inform vehicle owners about potential issues and recommended maintenance in a helpful and friendly manner.

Generate a short, simulated conversation script (5-6 lines) between the AI Agent and the Owner based on the following details. The script should start with a greeting, explain the issue and the recommended maintenance, offer assistance with scheduling, and end after the owner replies.

Vehicle Owner's Name: {{userName}}
Vehicle Issue: {{vehicleIssue}}
Recommended Maintenance: {{recommendedMaintenance}}

Example Format:
Agent: [Your greeting and explanation]
Owner: [Owner's response]
Agent: [Offer assistance with scheduling]
Owner: [Owner's reply]

Output a JSON object that conforms to the schema.`,
  },
);

const enquiryFlow = ai.defineFlow({
    name: 'enquiryFlow',
    inputSchema: HandleCustomerEnquiryInputSchema,
    outputSchema: HandleCustomerEnquiryOutputSchema,
}, async (input) => {
    const result = await enquiryPrompt(input);
    return result;
});


export async function handleCustomerEnquiry(
  input: HandleCustomerEnquiryInput
): Promise<HandleCustomerEnquiryOutput> {
  try {
    const result = await enquiryFlow(input);
    return result;
  } catch (error) {
    console.error("Error in handleCustomerEnquiry:", error);
    return {
      conversationSummary: `Failed to generate conversation. Error: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
