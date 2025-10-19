
'use server';
/**
 * @fileOverview A Q&A agent for vehicle-related questions.
 */
import openai from '@/ai/client';
import { qnaData } from '@/lib/chatbot-qna';

interface Message {
    role: 'user' | 'model';
    content: string;
}

export interface AnswerQuestionInput {
  question: string;
  conversationHistory: Message[];
}

export interface AnswerQuestionOutput {
  answer: string;
}

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

export async function answerQuestion(input: AnswerQuestionInput): Promise<AnswerQuestionOutput> {
    const localAnswer = localSearch(input.question);
    if (localAnswer) {
        return { answer: localAnswer };
    }

    const systemPrompt = `You are a helpful AI assistant for VEDA-MOTRIX, specializing in vehicle maintenance and troubleshooting.
    First, I will provide a knowledge base. If the user's question is answered there, use that answer.
    If the user's question is not in the knowledge base, use your general vehicle knowledge to provide a helpful, safe, and accurate answer.
    Always prioritize user safety. If a user describes a critical issue (e.g., smoke, strange noises, brake failure), strongly advise them to stop driving and seek professional help immediately.
    Keep your answers concise and easy to understand.

    Knowledge Base:
    ---
    ${qnaData.map(item => `Q: ${item.question}\nA: ${item.answer}`).join('\n\n')}
    ---
    `;

    try {
        const completion = await openai.chat.completions.create({
            model: 'openai/gpt-4o',
            messages: [
                { role: 'system', content: systemPrompt },
                ...input.conversationHistory.map(msg => ({ role: msg.role === 'model' ? 'assistant' : 'user', content: msg.content })),
                { role: 'user', content: input.question },
            ],
        });

        const answer = completion.choices[0].message?.content;
        if (!answer) {
            return { answer: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment." };
        }
        return { answer };
    } catch (error) {
        console.error('Error in answerQuestion:', error);
        return { answer: "I'm sorry, an error occurred while processing your request. Please try again later." };
    }
}
