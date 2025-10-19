
'use server';
/**
 * @fileoverview An AI flow that answers user questions about vehicles, using a knowledge base and conversation history.
 */
import {qnaData} from '@/lib/chatbot-qna';
import {AnswerQuestionInput, AnswerQuestionOutput, Message} from '@/ai/types';
import {openAiClient} from '@/ai/genkit';
import {ChatCompletionMessageParam} from 'openai/resources/chat';

export async function answerQuestion(
  input: AnswerQuestionInput
): Promise<AnswerQuestionOutput> {
  try {
    const localAnswer = qnaData.find(
      (item) =>
        item.question.toLowerCase().trim() === input.question.toLowerCase().trim()
    );
    if (localAnswer) {
      return {answer: localAnswer.answer};
    }

    const systemPrompt = `You are a helpful AI assistant for VEDA-MOTRIX, specializing in vehicle maintenance and troubleshooting. Your conversation history with the user is provided. First, check the provided knowledge base. If the user's question is answered there, use that answer. If the user's question is not in the knowledge base, use your general vehicle knowledge to provide a helpful, safe, and accurate answer. Always prioritize user safety. If a user describes a critical issue (e.g., smoke, strange noises, brake failure), strongly advise them to stop driving and seek professional help immediately. Keep your answers concise and easy to understand. Do not mention the knowledge base in your answer. Just answer the question.

Knowledge Base:
---
${qnaData
  .map((item) => `Q: ${item.question}\nA: ${item.answer}`)
  .join('\n\n')}
---
`;

    const messages: ChatCompletionMessageParam[] = [
      {role: 'system', content: systemPrompt},
      // Assuming input.conversationHistory is compatible with ChatCompletionMessageParam
      ...(input.conversationHistory as ChatCompletionMessageParam[]),
      {role: 'user', content: input.question},
    ];

    const answer = await openAiClient(messages);

    return {answer};
  } catch (error) {
    console.error('Error in answerQuestion:', error);
    return {
      answer:
        "I'm sorry, an error occurred while processing your request. Please try again later.",
    };
  }
}
