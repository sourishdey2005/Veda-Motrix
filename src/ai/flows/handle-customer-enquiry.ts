
'use server';

/**
 * @fileOverview Simulates conversations with vehicle owners about potential issues and recommended maintenance.
 *
 * - handleCustomerEnquiry - A function that simulates a conversation with a vehicle owner.
 * - HandleCustomerEnquiryInput - The input type for the handleCustomerEnquiry function.
 * - HandleCustomerEnquiryOutput - The return type for the handleCustomerEnquiry function.
 */
import { openai } from '@/ai/client';
import { z } from 'zod';

const HandleCustomerEnquiryInputSchema = z.object({
  vehicleIssue: z.string().describe('Description of the vehicle issue.'),
  recommendedMaintenance: z.string().describe('Recommended maintenance actions.'),
  userName: z.string().describe('Name of the vehicle owner.'),
});
export type HandleCustomerEnquiryInput = z.infer<typeof HandleCustomerEnquiryInputSchema>;

const HandleCustomerEnquiryOutputSchema = z.object({
  conversationSummary: z.string().describe('A summary of the simulated conversation.'),
});
export type HandleCustomerEnquiryOutput = z.infer<typeof HandleCustomerEnquiryOutputSchema>;

export async function handleCustomerEnquiry(
  input: HandleCustomerEnquiryInput
): Promise<HandleCustomerEnquiryOutput> {
  
    const prompt = `You are a customer engagement agent for VEDA-MOTRIX AI. Your goal is to inform vehicle owners about potential issues and recommended maintenance in a helpful and friendly manner.

    Vehicle Owner's Name: ${input.userName}
    Vehicle Issue: ${input.vehicleIssue}
    Recommended Maintenance: ${input.recommendedMaintenance}

    Generate a short conversation (around 5-6 lines) between you and the vehicle owner. Start with a greeting, explain the issue and the recommended maintenance, and offer assistance with scheduling a service appointment. The response should be in the format of a conversation.

    Agent: (Your greeting and explanation)
    Owner: (Owner's response)
    Agent: (Offer assistance with scheduling)
    Owner: (Owner's reply)

    End the conversation after the owner replies to the scheduling offer. The entire output should be a single string representing the conversation.
    `;

    const completion = await openai.chat.completions.create({
        model: 'openai/gpt-4o',
        messages: [{ role: 'user', content: prompt }],
    });

    const conversationSummary = completion.choices[0].message?.content;
    if (!conversationSummary) {
        throw new Error('AI failed to generate a response.');
    }

    return { conversationSummary };
}
