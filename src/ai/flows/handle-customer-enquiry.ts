
'use server';
/**
 * @fileoverview A Genkit flow that simulates a customer engagement conversation.
 */
import {ai} from '@/ai/genkit';
import {
  HandleCustomerEnquiryInput,
  HandleCustomerEnquiryInputSchema,
  HandleCustomerEnquiryOutput,
  HandleCustomerEnquiryOutputSchema,
} from '@/ai/types';
import {z} from 'zod';

export async function handleCustomerEnquiry(
  input: HandleCustomerEnquiryInput
): Promise<HandleCustomerEnquiryOutput> {
  const prompt = ai.definePrompt(
    {
      name: 'customerEnquiryPrompt',
      input: {schema: HandleCustomerEnquiryInputSchema},
      output: {schema: HandleCustomerEnquiryOutputSchema},
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
`,
    },
    async input => {
      const {output} = await ai.generate({
        prompt: input,
        model: 'googleai/gemini-1.5-flash',
        config: {
          output: {
            format: 'json',
            schema: HandleCustomerEnquiryOutputSchema,
          },
        },
      });
      return output!;
    }
  );
  return prompt(input);
}
