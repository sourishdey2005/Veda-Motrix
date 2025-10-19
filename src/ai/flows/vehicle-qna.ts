
'use server';

import { GoogleGenAI } from "@google/genai";
import { qnaData } from '@/lib/chatbot-qna';
import {
  type AnswerQuestionInput,
  type AnswerQuestionOutput,
} from '@/ai/types';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable not set.");
}
const genAI = new GoogleGenAI(apiKey);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

export async function answerQuestion(
  input: AnswerQuestionInput
): Promise<AnswerQuestionOutput> {
  const localAnswer = localSearch(input.question);
  if (localAnswer) {
    return { answer: localAnswer };
  }

  const history = input.conversationHistory.map(message => ({
    role: message.role,
    parts: [{ text: message.content }]
  }));

  const lastUserMessage = { role: 'user', parts: [{ text: input.question }] };

  const knowledgeBase = `
    Knowledge Base:
    ---
    ${qnaData
      .map((item) => `Q: ${item.question}\nA: ${item.answer}`)
      .join('\n\n')}
    ---
  `;

  const systemInstruction = `You are a helpful AI assistant for VEDA-MOTRIX, specializing in vehicle maintenance and troubleshooting.
    Your conversation history with the user is provided below.
    The user's latest question is at the end.
    
    First, check the provided knowledge base. If the user's question is answered there, use that answer.
    If the user's question is not in the knowledge base, use your general vehicle knowledge to provide a helpful, safe, and accurate answer.
    Always prioritize user safety. If a user describes a critical issue (e.g., smoke, strange noises, brake failure), strongly advise them to stop driving and seek professional help immediately.
    Keep your answers concise and easy to understand.
    Do not mention the knowledge base in your answer. Just answer the question.
  `;

  try {
    const chat = model.startChat({
        history: history,
        systemInstruction: {
            role: "system",
            parts: [{ text: systemInstruction }, { text: knowledgeBase }]
        }
    });

    const result = await chat.sendMessage(input.question);
    const response = result.response;
    
    return { answer: response.text() };

  } catch (error) {
    console.error('Error in answerQuestion:', error);
    return {
      answer:
        "I'm sorry, an error occurred while processing your request. Please try again later.",
    };
  }
}
