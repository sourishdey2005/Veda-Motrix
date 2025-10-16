'use server';

/**
 * @fileOverview Simulates conversations with vehicle owners about potential issues and recommended maintenance.
 *
 * - simulateCustomerEngagement - A function that simulates a conversation with a vehicle owner.
 * - SimulateCustomerEngagementInput - The input type for the simulateCustomerEngagement function.
 * - SimulateCustomerEngagementOutput - The return type for the simulateCustomerEngagement function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SimulateCustomerEngagementInputSchema = z.object({
  vehicleIssue: z.string().describe('Description of the vehicle issue.'),
  recommendedMaintenance: z.string().describe('Recommended maintenance actions.'),
  userName: z.string().describe('Name of the vehicle owner.'),
});
export type SimulateCustomerEngagementInput = z.infer<typeof SimulateCustomerEngagementInputSchema>;

const SimulateCustomerEngagementOutputSchema = z.object({
  conversationSummary: z.string().describe('A summary of the simulated conversation.'),
});
export type SimulateCustomerEngagementOutput = z.infer<typeof SimulateCustomerEngagementOutputSchema>;

export async function simulateCustomerEngagement(
  input: SimulateCustomerEngagementInput
): Promise<SimulateCustomerEngagementOutput> {
  return simulateCustomerEngagementFlow(input);
}

const prompt = ai.definePrompt({
  name: 'simulateCustomerEngagementPrompt',
  input: {schema: SimulateCustomerEngagementInputSchema},
  output: {schema: SimulateCustomerEngagementOutputSchema},
  prompt: `You are a customer engagement agent for VEDA-MOTRIX AI. Your goal is to inform vehicle owners about potential issues and recommended maintenance in a helpful and friendly manner.

  Vehicle Owner's Name: {{{userName}}}
  Vehicle Issue: {{{vehicleIssue}}}
  Recommended Maintenance: {{{recommendedMaintenance}}}

  Generate a short conversation (around 5-6 lines) between you and the vehicle owner. Start with a greeting, explain the issue and the recommended maintenance, and offer assistance with scheduling a service appointment.  The response should be in the format of a conversation.

  Agent: (Your greeting and explanation)
  Owner: (Owner's response)
  Agent: (Offer assistance with scheduling)
  Owner: (Owner's reply)

  End the conversation after the owner replies to the scheduling offer.

  CONVERSATION:
  `,
});

const simulateCustomerEngagementFlow = ai.defineFlow(
  {
    name: 'simulateCustomerEngagementFlow',
    inputSchema: SimulateCustomerEngagementInputSchema,
    outputSchema: SimulateCustomerEngagementOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {
      conversationSummary: output!.conversationSummary,
    };
  }
);
