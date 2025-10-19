
'use server';

import OpenAI from 'openai';
import {ChatCompletionMessageParam} from 'openai/resources/chat';

if (!process.env.OPENROUTER_API_KEY) {
  console.warn(
    'OPENROUTER_API_KEY environment variable not set. Using placeholder. AI features will not work.'
  );
}

const YOUR_SITE_URL = process.env.YOUR_SITE_URL || 'http://localhost:3000';
const YOUR_SITE_NAME = process.env.YOUR_SITE_NAME || 'VEDA-MOTRIX';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY || '',
  defaultHeaders: {
    'HTTP-Referer': YOUR_SITE_URL,
    'X-Title': YOUR_SITE_NAME,
  },
});

export async function openAiClient(
  messages: ChatCompletionMessageParam[],
  isJsonMode: boolean = false
): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'alibaba/tongyi-deepresearch-30b-a3b:free',
      messages: messages,
      response_format: isJsonMode ? {type: 'json_object'} : {type: 'text'},
    });

    const content = completion.choices[0]?.message?.content;
    if (content) {
      return content;
    }

    throw new Error('No response content returned from the API.');
  } catch (error) {
    console.error('Error in openAiClient:', error);
    // Re-throw the error so the calling flow can handle it
    throw error;
  }
}
