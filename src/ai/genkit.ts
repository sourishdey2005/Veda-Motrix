
'use server';

import OpenAI from 'openai';
import type { z } from 'zod';

// This is the new centralized client for interacting with the NVIDIA API.
// It uses the official 'openai' library, which is compatible with NVIDIA's API structure.
const nvidiaClient = new OpenAI({
  baseURL: 'https://integrate.api.nvidia.com/v1',
  apiKey: process.env.NVIDIA_API_KEY,
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
 * A simple wrapper around the OpenAI client to handle chat completions via NVIDIA's API.
 * This will be the single point of entry for all AI calls.
 */
export async function openAiClient<T, U>({
  prompt,
  model, // The model will be passed in from the calling flow
  response_model,
}: AiClientOptions<T, U>): Promise<U | string | null> {
  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = Array.isArray(prompt)
    ? prompt
    : [{ role: 'user', content: prompt }];

  // Determine the model to use. If a model is explicitly passed, use it.
  // Otherwise, default to the Qwen model. This allows flows like document analysis
  // to specify a different, vision-capable model.
  const selectedModel = model || 'qwen/qwen3-next-80b-a3b-thinking';

  const commonParams: Partial<OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming> = {
    model: selectedModel,
    messages,
    temperature: 0.6,
    top_p: 0.7,
    max_tokens: 4096,
  };

  try {
    if (response_model) {
      const chatCompletion = await nvidiaClient.chat.completions.create({
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
      const chatCompletion = await nvidiaClient.chat.completions.create(
        commonParams as OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming
      );
      return chatCompletion.choices[0].message?.content ?? null;
    }
  } catch (error: any) {
     console.error('Error calling NVIDIA API:', error);
     // Re-throw the error so it can be caught by the individual flows
     throw new Error(`NVIDIA API request failed: ${error.message}`);
  }


  return null;
}
