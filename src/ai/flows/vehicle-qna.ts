
'use server';
/**
 * @fileoverview An AI flow that answers user questions about vehicles, using a knowledge base and conversation history.
 */
import { qnaData } from '@/lib/chatbot-qna';
import type {
  AnswerQuestionInput,
  AnswerQuestionOutput,
} from '@/ai/types';
import { openAiClient } from '@/ai/genkit';
import type { OpenAI } from 'openai';

export async function answerQuestion(
  input: AnswerQuestionInput
): Promise<AnswerQuestionOutput> {
  try {
    // First, check for a simple local answer.
    const localAnswer = qnaData.find(
      item =>
        item.question.toLowerCase().trim() === input.question.toLowerCase().trim()
    );
    if (localAnswer) {
      return { answer: localAnswer.answer };
    }

    // Format messages for the AI
    const history: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = input.conversationHistory.map(m => ({
      role: m.role === 'model' ? 'assistant' : 'user', // Adapt our role to OpenAI's
      content: m.content,
    }));
    
    const systemPrompt: OpenAI.Chat.Completions.ChatCompletionMessageParam = {
      role: 'system',
      content: `You are a helpful AI assistant for VEDA-MOTRIX, specializing in vehicle maintenance and troubleshooting. Your conversation history with the user is provided. First, check the provided knowledge base. If the user's question is answered there, use that answer. If the user's question is not in the knowledge base, use your general vehicle knowledge to provide a helpful, safe, and accurate answer. Always prioritize user safety. If a user describes a critical issue (e.g., smoke, strange noises, brake failure), strongly advise them to stop driving and seek professional help immediately. Keep your answers concise and easy to understand. Do not mention the knowledge base in your answer. Just answer the question.

Knowledge Base:
---
${qnaData
  .map(item => `Q: ${item.question}\nA: ${item.answer}`)
  .join('\n\n')}
---
`,
    };

    const userPrompt: OpenAI.Chat.Completions.ChatCompletionMessageParam = {
      role: 'user',
      content: input.question,
    };

    const result = await openAiClient({
      prompt: [systemPrompt, ...history, userPrompt],
    });

    return { answer: result as string };

  } catch (error) {
    console.error('Error in answerQuestion:', error);
    return {
      answer:
        "I'm sorry, an error occurred while processing your request. Please try again later.",
    };
  }
}
