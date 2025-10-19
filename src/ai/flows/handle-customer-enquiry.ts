
'use server';

/**
 * @fileOverview Simulates conversations with vehicle owners about potential issues and recommended maintenance.
 */
import openai from '@/ai/client';

export interface HandleCustomerEnquiryInput {
  vehicleIssue: string;
  recommendedMaintenance: string;
  userName: string;
}

export interface HandleCustomerEnquiryOutput {
  conversationSummary: string;
}

export async function handleCustomerEnquiry(
  input: HandleCustomerEnquiryInput
): Promise<HandleCustomerEnquiryOutput> {
  const prompt = `You are a customer engagement agent for VEDA-MOTRIX AI. Your goal is to inform vehicle owners about potential issues and recommended maintenance in a helpful and friendly manner.

    Vehicle Owner's Name: ${input.userName}
    Vehicle Issue: ${input.vehicleIssue}
    Recommended Maintenance: ${input.recommendedMaintenance}

    Generate a short, simulated conversation script (5-6 lines) between the AI Agent and the Owner. The script should start with a greeting, explain the issue and the recommended maintenance, offer assistance with scheduling, and end after the owner replies.

    Example Format:
    Agent: [Your greeting and explanation]
    Owner: [Owner's response]
    Agent: [Offer assistance with scheduling]
    Owner: [Owner's reply]

    Return a JSON object with the following structure: { "conversationSummary": "string" }.
    `;

  try {
    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const responseJson = completion.choices[0].message?.content;
    if (!responseJson) {
      throw new Error('AI failed to generate a response.');
    }
    return JSON.parse(responseJson) as HandleCustomerEnquiryOutput;
  } catch (error) {
    console.error('Error in handleCustomerEnquiry:', error);
    throw new Error('Failed to handle customer enquiry.');
  }
}
