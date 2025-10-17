
'use server';
/**
 * @fileOverview A Q&A agent for vehicle-related questions.
 *
 * - answerQuestion - A function that answers user questions about their vehicle.
 * - AnswerQuestionInput - The input type for the answerQuestion function.
 * - AnswerQuestionOutput - The return type for the answerQuestion function.
 */

import { z } from 'zod';
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

// This function now performs a local search instead of calling an AI model.
export async function answerQuestion(input: AnswerQuestionInput): Promise<AnswerQuestionOutput> {
  const userQuestion = input.question.toLowerCase().trim();
  
  if (!userQuestion) {
    return { answer: "I'm sorry, I didn't receive a question. How can I help?" };
  }

  // Find the best match from the knowledge base.
  let bestMatch: { score: number; answer: string } = { score: 0, answer: "" };

  qnaData.forEach(item => {
    const qnaQuestion = item.question.toLowerCase().trim();
    
    // Simple scoring mechanism:
    // 3 points for exact match
    // 2 points if the user's question includes the Q&A question
    // 1 point if the Q&A question includes part of the user's question
    
    if (userQuestion === qnaQuestion) {
        if (bestMatch.score < 3) {
            bestMatch = { score: 3, answer: item.answer };
        }
    } else if (userQuestion.includes(qnaQuestion)) {
        if (bestMatch.score < 2) {
            bestMatch = { score: 2, answer: item.answer };
        }
    } else {
        const userWords = new Set(userQuestion.split(' '));
        const qnaWords = new Set(qnaQuestion.split(' '));
        const intersection = new Set([...userWords].filter(x => qnaWords.has(x)));
        const score = intersection.size / qnaWords.size;

        if (score > bestMatch.score && score > 0.5) { // Require more than 50% word match
             bestMatch = { score: score, answer: item.answer };
        }
    }
  });
  
  if (bestMatch.answer) {
    return { answer: bestMatch.answer };
  }

  // Default fallback answer if no good match is found.
  return { answer: "I'm sorry, I don't have information on that topic right now. I can help with vehicle maintenance, service, and general questions." };
}
