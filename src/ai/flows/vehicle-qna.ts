'use server';
/**
 * @fileOverview A Q&A agent for vehicle-related questions.
 *
 * - answerQuestion - A function that answers user questions about their vehicle.
 * - AnswerQuestionInput - The input type for the answerQuestion function.
 * - AnswerQuestionOutput - The return type for the answerQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { qnaData } from '@/lib/chatbot-qna';

const AnswerQuestionInputSchema = z.object({
  question: z.string().describe('The user\'s question about their vehicle.'),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).describe('The history of the conversation so far.'),
});
export type AnswerQuestionInput = z.infer<typeof AnswerQuestionInputSchema>;

const AnswerQuestionOutputSchema = z.object({
  answer: z.string().describe('The AI\'s answer to the user\'s question.'),
});
export type AnswerQuestionOutput = z.infer<typeof AnswerQuestionOutputSchema>;

export async function answerQuestion(input: AnswerQuestionInput): Promise<AnswerQuestionOutput> {
  return vehicleQnAFlow(input);
}

const prompt = ai.definePrompt({
  name: 'vehicleQnAPrompt',
  input: {schema: AnswerQuestionInputSchema},
  output: {schema: AnswerQuestionOutputSchema},
  prompt: `You are VEDA, an expert AI assistant for VEDA-MOTRIX vehicle owners. Your goal is to answer questions professionally and concisely based on a knowledge base of predefined questions and answers.

You must follow these rules:
1.  Use the provided Knowledge Base as your primary source of truth.
2.  If the user's question is a close match to a question in the Knowledge Base, provide the corresponding answer.
3.  If the question is not in the Knowledge Base, you must state: "I'm sorry, I don't have information on that topic right now. I can help with vehicle maintenance, service, and general questions." Do not attempt to answer it from your own knowledge.
4.  Keep your answers concise and professional.
5.  Consider the conversation history for context, but always prioritize the knowledge base for answers.

START KNOWLEDGE BASE
${qnaData.map((item, index) => `Q${index + 1}: ${item.question}\nA${index + 1}: ${item.answer}`).join('\n\n')}
END KNOWLEDGE BASE

Conversation History:
{{#each conversationHistory}}
{{#if (eq role 'user')}}User: {{content}}{{/if}}
{{#if (eq role 'model')}}AI: {{content}}{{/if}}
{{/each}}

User's current question: {{{question}}}

Based on the knowledge base and the conversation history, what is the best answer to the user's current question?`,
});

const vehicleQnAFlow = ai.defineFlow(
  {
    name: 'vehicleQnAFlow',
    inputSchema: AnswerQuestionInputSchema,
    outputSchema: AnswerQuestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
