
'use server';

import OpenAI from 'openai';
import type { z } from 'zod';

// This is the new centralized client for interacting with the OpenRouter API.
// It uses the official 'openai' library, which is compatible with OpenRouter's API structure.
const openrouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'https://veda-motrix.ai', // Replace with your actual site URL
    'X-Title': 'VEDA-MOTRIX AI', // Replace with your actual site name
  },
});

interface AiClientOptions<T, U> {
  prompt: string | OpenAI.Chat.Completions.ChatCompletionMessageParam[];
  model?: string;
  response_model?: {
    schema: z.ZodObject<any>;
    name: string;
  };
}

/**
 * A simple wrapper around the OpenAI client to handle chat completions.
 * This will be the single point of entry for all AI calls.
 */
export async function openAiClient<T, U>({
  prompt,
  model = 'meta-llama/llama-3.3-8b-instruct:free',
  response_model,
}: AiClientOptions<T, U>): Promise<U | string | null> {
  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = Array.isArray(prompt)
    ? prompt
    : [{ role: 'user', content: prompt }];

  const commonParams: Partial<OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming> = {
    model,
    messages,
  };

  if (response_model) {
    const chatCompletion = await openrouter.chat.completions.create({
      ...commonParams,
      response_format: {
        type: 'json_object',
      },
      messages: [
        ...messages,
        {
          role: 'system',
          content: `Please respond with a JSON object that strictly adheres to the following Zod schema. Do not include any extra explanations or introductory text. The JSON object must be the only thing in your response. Schema: ${JSON.stringify(response_model.schema.shape, null, 2)}`,
        },
      ],
    });

    const jsonResponse = chatCompletion.choices[0].message?.content;
    if (jsonResponse) {
      try {
        const parsed = JSON.parse(jsonResponse);
        response_model.schema.parse(parsed);
        return parsed as U;
      } catch (error) {
        console.error('Failed to parse or validate AI JSON response:', error);
        throw new Error('AI response was not in the expected format.');
      }
    }
  } else {
    const chatCompletion = await openrouter.chat.completions.create(
      commonParams as OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming
    );
    return chatCompletion.choices[0].message?.content ?? null;
  }

  return null;
}
