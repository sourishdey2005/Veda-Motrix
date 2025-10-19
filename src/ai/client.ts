
'use server';

import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: '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',
  defaultHeaders: {
    'HTTP-Referer': 'https://veda-motrix-ai.com', 
    'X-Title': 'VEDA-MOTRIX AI', 
  },
});

export default openai;
