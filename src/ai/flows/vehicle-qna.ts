'use server';

import {ai} from '@/ai/genkit';
import {qnaData} from '@/lib/chatbot-qna';
import {
  AnswerQuestionInputSchema,
  AnswerQuestionOutputSchema,
  type AnswerQuestionInput,
  type AnswerQuestionOutput,
} from '@/ai/types';

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

const prompt = ai.definePrompt(
  {
    name: 'vehicleQnaPrompt',
    input: {schema: AnswerQuestionInputSchema},
    output: {schema: AnswerQuestionOutputSchema},
    prompt: `You are a helpful AI assistant for VEDA-MOTRIX, specializing in vehicle maintenance and troubleshooting.
    Your conversation history with the user is provided below.
    The user's latest question is at the end.
    
    First, I will provide a knowledge base. If the user's question is answered there, use that answer.
    If the user's question is not in the knowledge base, use your general vehicle knowledge to provide a helpful, safe, and accurate answer.
    Always prioritize user safety. If a user describes a critical issue (e.g., smoke, strange noises, brake failure), strongly advise them to stop driving and seek professional help immediately.
    Keep your answers concise and easy to understand.

    Knowledge Base:
    ---
    ${qnaData
      .map((item) => `Q: ${item.question}\nA: ${item.answer}`)
      .join('\n\n')}
    ---
    
    Conversation History:
    {{#each conversationHistory}}
      {{#if (eq role 'user')}}
        User: {{content}}
      {{else}}
        AI: {{content}}
      {{/if}}
    {{/each}}
    
    User's Current Question: {{{question}}}
  `,
  },
  async (input) => {
    return {
      model: 'googleai/gemini-1.5-flash',
    };
  }
);

const answerQuestionFlow = ai.defineFlow(
  {
    name: 'answerQuestionFlow',
    inputSchema: AnswerQuestionInputSchema,
    outputSchema: AnswerQuestionOutputSchema,
  },
  async (input) => {
    const localAnswer = localSearch(input.question);
    if (localAnswer) {
      return {answer: localAnswer};
    }

    try {
      const {output} = await prompt(input);
      if (!output) {
        return {
          answer:
            "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        };
      }
      return output;
    } catch (error) {
      console.error('Error in answerQuestion:', error);
      return {
        answer:
          "I'm sorry, an error occurred while processing your request. Please try again later.",
      };
    }
  }
);

export async function answerQuestion(
  input: AnswerQuestionInput
): Promise<AnswerQuestionOutput> {
  return answerQuestionFlow(input);
}
