
'use server';

/**
 * @fileOverview Simulates conversations with vehicle owners about potential issues and recommended maintenance.
 *
 * - handleCustomerEnquiry - A function that simulates a conversation with a vehicle owner.
 * - HandleCustomerEnquiryInput - The input type for the handleCustomerEnquiry function.
 * - HandleCustomerEnquiryOutput - The return type for the handleCustomerEnquiry function.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const HandleCustomerEnquiryInputSchema = z.object({
  vehicleIssue: z.string().describe('Description of the vehicle issue.'),
  recommendedMaintenance: z.string().describe('Recommended maintenance actions.'),
  userName: z.string().describe('Name of the vehicle owner.'),
});
export type HandleCustomerEnquiryInput = z.infer<typeof HandleCustomerEnquiryInputSchema>;

export const HandleCustomerEnquiryOutputSchema = z.object({
  conversationSummary: z.string().describe('A summary of the simulated conversation, formatted as a script.'),
});
export type HandleCustomerEnquiryOutput = z.infer<typeof HandleCustomerEnquiryOutputSchema>;

const enquiryPrompt = ai.definePrompt({
    name: 'handleCustomerEnquiryPrompt',
    input: { schema: HandleCustomerEnquiryInputSchema },
    output: { schema: HandleCustomerEnquiryOutputSchema },
    prompt: `You are a customer engagement agent for VEDA-MOTRIX AI. Your goal is to inform vehicle owners about potential issues and recommended maintenance in a helpful and friendly manner.

    Vehicle Owner's Name: {{{userName}}}
    Vehicle Issue: {{{vehicleIssue}}}
    Recommended Maintenance: {{{recommendedMaintenance}}}

    Generate a short, simulated conversation script (5-6 lines) between the AI Agent and the Owner. The script should start with a greeting, explain the issue and the recommended maintenance, offer assistance with scheduling, and end after the owner replies.

    Example Format:
    Agent: [Your greeting and explanation]
    Owner: [Owner's response]
    Agent: [Offer assistance with scheduling]
    Owner: [Owner's reply]
    `
});


const handleCustomerEnquiryFlow = ai.defineFlow({
    name: 'handleCustomerEnquiryFlow',
    inputSchema: HandleCustomerEnquiryInputSchema,
    outputSchema: HandleCustomerEnquiryOutputSchema,
}, async (input) => {
    const { output } = await enquiryPrompt(input);
    if (!output) {
        throw new Error('AI failed to generate a response.');
    }
    return output;
});


export async function handleCustomerEnquiry(
  input: HandleCustomerEnquiryInput
): Promise<HandleCustomerEnquiryOutput> {
  return await handleCustomerEnquiryFlow(input);
}
