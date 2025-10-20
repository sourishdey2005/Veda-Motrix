
'use server';
/**
 * @fileoverview An AI flow that answers user questions about vehicles, using a knowledge base and conversation history.
 */
import { aiClient, textModel } from '@/ai/genkit';
import { qnaData } from '@/lib/chatbot-qna';
import type { AnswerQuestionInput } from '@/ai/types';

export async function answerQuestion(
  input: AnswerQuestionInput
): Promise<{ answer: string }> {
  try {
    // First, check for a simple local answer.
    const localAnswer = qnaData.find(
      item =>
        item.question.toLowerCase().trim() === input.question.toLowerCase().trim()
    );
    if (localAnswer) {
      return { answer: localAnswer.answer };
    }

    const systemPrompt = `You are a helpful AI assistant for VEDA-MOTRIX, specializing in vehicle maintenance and troubleshooting. Your conversation history with the user is provided. First, check the provided knowledge base. If the user's question is answered there, use that answer. If the user's question is not in the knowledge base, use your general vehicle knowledge to provide a helpful, safe, and accurate answer. Always prioritize user safety. If a user describes a critical issue (e.g., smoke, strange noises, brake failure), strongly advise them to stop driving and seek professional help immediately. Provide detailed and elaborate answers to be as helpful as possible. Do not mention the knowledge base in your answer. Just answer the question.

Knowledge Base:
---
${qnaData
  .map(item => `Q: ${item.question}\nA: ${item.answer}`)
  .join('\n\n')}
---
`;

    const messages = [
        { role: 'system' as const, content: systemPrompt },
        ...input.conversationHistory.map(m => ({ role: m.role as "user" | "assistant", content: m.content })),
        { role: 'user' as const, content: input.question }
    ];
    
    const response = await aiClient.chat.completions.create({
        model: textModel,
        messages: messages,
        temperature: 0.6,
        top_p: 1,
    });

    const answer = response.choices[0]?.message?.content;

    return { answer: answer || "I'm sorry, I could not find an answer." };
  } catch (error) {
    console.error('Error in answerQuestion:', error);
    return {
      answer:
        "I'm sorry, an error occurred while processing your request. Please try again later.",
    };
  }
}
