
'use server';

import OpenAI from 'openai';
import {z} from 'zod';
import {AnalyzeCustomerFeedbackOutputSchema} from './types';

if (!process.env.HF_TOKEN) {
  console.warn(
    'HF_TOKEN environment variable not set. AI features may not work.'
  );
}

const client = new OpenAI({
  baseURL: 'https://router.huggingface.co/v1',
  apiKey: process.env.HF_TOKEN,
});

type Message =
  | OpenAI.Chat.Completions.ChatCompletionSystemMessageParam
  | OpenAI.Chat.Completions.ChatCompletionUserMessageParam
  | OpenAI.Chat.Completions.ChatCompletionAssistantMessageParam;

const TEXT_MODEL = 'Qwen/Qwen3-0.6B:fireworks-ai';
const VISION_MODEL =
  'NousResearch/Nous-Hermes-2-Vision-GGUF/Nous-Hermes-2-Vision-7B-GGUF:free';

export async function openAiClient(
  messages: Message[],
  isJsonMode: boolean = false,
  isVision: boolean = false
): Promise<string> {
  try {
    const model = isVision ? VISION_MODEL : TEXT_MODEL;

    if (isJsonMode && !isVision) {
      const lastMessage = messages.pop();
      if (lastMessage && lastMessage.role === 'user') {
        const content = Array.isArray(lastMessage.content)
          ? lastMessage.content.join('\n')
          : lastMessage.content;
        messages.push({
          ...lastMessage,
          content: `${content}\n\nRespond with a valid JSON object.`,
        });
      }
    }

    const chatCompletion = await client.chat.completions.create({
      model: model,
      messages: messages,
      // The HF endpoint doesn't support response_format, we rely on prompting for JSON.
    });

    const content = chatCompletion.choices[0].message.content;

    if (content) {
      return content;
    }

    throw new Error('No response content returned from the API.');
  } catch (error: any) {
    console.error('Error in openAiClient:', error);
    // Re-throw the error so the calling flow can handle it with more specific details
    throw error;
  }
}
