
'use server';
/**
 * @fileoverview An AI flow that answers user questions about vehicles, using a knowledge base and conversation history.
 */
import {ai} from '@/ai/genkit';
import {z} from 'zod';
import {qnaData} from '@/lib/chatbot-qna';
import type {AnswerQuestionInput} from '@/ai/types';
import {AnswerQuestionInputSchema} from '@/ai/types';

const qnaFlow = ai.defineFlow(
  {
    name: 'qnaFlow',
    inputSchema: AnswerQuestionInputSchema,
    outputSchema: z.string(),
  },
  async input => {
    // First, check for a simple local answer.
    const localAnswer = qnaData.find(
      item =>
        item.question.toLowerCase().trim() === input.question.toLowerCase().trim()
    );
    if (localAnswer) {
      return localAnswer.answer;
    }

    // Format messages for the AI
    const history = input.conversationHistory.map(m => ({
      role: m.role === 'model' ? 'model' : 'user', // Adapt our role to Genkit's
      content: [{text: m.content}],
    }));

    const systemPrompt = `You are a helpful AI assistant for VEDA-MOTRIX, specializing in vehicle maintenance and troubleshooting. Your conversation history with the user is provided. First, check the provided knowledge base. If the user's question is answered there, use that answer. If the user's question is not in the knowledge base, use your general vehicle knowledge to provide a helpful, safe, and accurate answer. Always prioritize user safety. If a user describes a critical issue (e.g., smoke, strange noises, brake failure), strongly advise them to stop driving and seek professional help immediately. Keep your answers concise and easy to understand. Do not mention the knowledge base in your answer. Just answer the question.

Knowledge Base:
---
${qnaData
  .map(item => `Q: ${item.question}\nA: ${item.answer}`)
  .join('\n\n')}
---
`;

    const llmResponse = await ai.generate({
      model: 'gemini-1.5-flash',
      history: history,
      prompt: input.question,
      config: {
        systemInstruction: systemPrompt,
      },
    });

    return llmResponse.text;
  }
);

export async function answerQuestion(
  input: AnswerQuestionInput
): Promise<{answer: string}> {
  try {
    const result = await qnaFlow(input);
    return {answer: result};
  } catch (error) {
    console.error('Error in answerQuestion:', error);
    return {
      answer:
        "I'm sorry, an error occurred while processing your request. Please try again later.",
    };
  }
}
