
'use server';
/**
 * @fileoverview A Genkit flow that answers user questions about vehicles, using a knowledge base and conversation history.
 */
import { qnaData } from '@/lib/chatbot-qna';
import {
  AnswerQuestionInput,
  AnswerQuestionInputSchema,
  AnswerQuestionOutput,
  AnswerQuestionOutputSchema,
} from '@/ai/types';
import { ai } from '@/ai/genkit';
import { Message } from "genkit";
import { z } from 'zod';

const localSearch = (question: string): string | null => {
  const userQuestion = question.toLowerCase().trim();
  if (!userQuestion) return null;

  for (const item of qnaData) {
    if (item.question.toLowerCase().trim() === userQuestion) {
      return item.answer;
    }
  }
  return null;
};

const qnaPrompt = ai.definePrompt(
  {
    name: 'vehicleQnA',
    input: { schema: z.object({ question: z.string() }) },
    output: { schema: z.string() },
    system: `You are a helpful AI assistant for VEDA-MOTRIX, specializing in vehicle maintenance and troubleshooting. Your conversation history with the user is provided. The user's latest question is at the end. First, check the provided knowledge base. If the user's question is answered there, use that answer. If the user's question is not in the knowledge base, use your general vehicle knowledge to provide a helpful, safe, and accurate answer. Always prioritize user safety. If a user describes a critical issue (e.g., smoke, strange noises, brake failure), strongly advise them to stop driving and seek professional help immediately. Keep your answers concise and easy to understand. Do not mention the knowledge base in your answer. Just answer the question.
Knowledge Base:
---
${qnaData
  .map(item => `Q: ${item.question}\nA: ${item.answer}`)
  .join('\n\n')}
---`,
    prompt: `{{question}}`
  },
);

const qnaFlow = ai.defineFlow({
    name: 'qnaFlow',
    inputSchema: AnswerQuestionInputSchema,
    outputSchema: AnswerQuestionOutputSchema,
}, async ({ question, conversationHistory }) => {
    const localAnswer = localSearch(question);
    if (localAnswer) {
      return { answer: localAnswer };
    }
    const history: Message[] = conversationHistory.map(msg => ({
      role: msg.role,
      content: [{ text: msg.content }]
    }));
    
    const result = await qnaPrompt({ question }, { history });

    return { answer: result };
});


export async function answerQuestion(
  input: AnswerQuestionInput
): Promise<AnswerQuestionOutput> {
  try {
    const result = await qnaFlow(input);
    return result;
    
  } catch (error) {
    console.error('Error in answerQuestion:', error);
    return {
      answer:
        "I'm sorry, an error occurred while processing your request. Please try again later.",
    };
  }
}
