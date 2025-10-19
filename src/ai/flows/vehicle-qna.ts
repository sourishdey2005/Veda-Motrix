
'use server';
/**
 * @fileOverview A Q&A agent for vehicle-related questions.
 *
 * - answerQuestion - A function that answers user questions about their vehicle.
 * - AnswerQuestionInput - The input type for the answerQuestion function.
 * - AnswerQuestionOutput - The return type for the answerQuestion function.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { qnaData } from '@/lib/chatbot-qna';

export const AnswerQuestionInputSchema = z.object({
  question: z.string().describe("The user's question about their vehicle."),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).describe('The history of the conversation so far.'),
});
export type AnswerQuestionInput = z.infer<typeof AnswerQuestionInputSchema>;

export const AnswerQuestionOutputSchema = z.object({
  answer: z.string().describe("The AI's answer to the user's question."),
});
export type AnswerQuestionOutput = z.infer<typeof AnswerQuestionOutputSchema>;

const localSearch = (question: string) => {
    const userQuestion = question.toLowerCase().trim();
    if (!userQuestion) {
        return null;
    }

    let bestMatch: { score: number; answer: string } = { score: 0, answer: "" };

    qnaData.forEach(item => {
        const qnaQuestion = item.question.toLowerCase().trim();
        let score = 0;
        if (userQuestion === qnaQuestion) {
            score = 3;
        } else if (userQuestion.includes(qnaQuestion)) {
            score = 2;
        } else {
            const userWords = new Set(userQuestion.split(' '));
            const qnaWords = new Set(qnaQuestion.split(' '));
            const intersection = new Set([...userWords].filter(x => qnaWords.has(x)));
            score = intersection.size / qnaWords.size;
        }

        if (score > bestMatch.score) {
            bestMatch = { score, answer: item.answer };
        }
    });

    if (bestMatch.score > 0.7) { // Confidence threshold
        return bestMatch.answer;
    }
    return null;
}

const qnaPrompt = ai.definePrompt({
    name: 'vehicleQnaPrompt',
    system: `You are a helpful AI assistant for VEDA-MOTRIX, specializing in vehicle maintenance and troubleshooting.
    First, check the provided knowledge base. If a relevant answer exists, use it.
    If the user's question is not in the knowledge base, use your general knowledge to provide a helpful, safe, and accurate answer.
    Always prioritize user safety. If a user describes a critical issue (e.g., smoke, strange noises, brake failure), strongly advise them to stop driving and seek professional help immediately.
    Keep your answers concise and easy to understand.

    Knowledge Base:
    ---
    ${qnaData.map(item => `Q: ${item.question}\nA: ${item.answer}`).join('\n')}
    ---
    `,
    input: { schema: AnswerQuestionInputSchema },
    output: { schema: AnswerQuestionOutputSchema },
});

const answerQuestionFlow = ai.defineFlow({
    name: 'answerQuestionFlow',
    inputSchema: AnswerQuestionInputSchema,
    outputSchema: AnswerQuestionOutputSchema,
}, async (input) => {
    
    // First, try a quick local search for a perfect match
    const localAnswer = localSearch(input.question);
    if (localAnswer) {
        return { answer: localAnswer };
    }

    // If no good local match, proceed with the full AI prompt
    const { output } = await qnaPrompt(input);
    if (!output) {
        return { answer: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment." };
    }
    return output;
});

export async function answerQuestion(input: AnswerQuestionInput): Promise<AnswerQuestionOutput> {
  return await answerQuestionFlow(input);
}
