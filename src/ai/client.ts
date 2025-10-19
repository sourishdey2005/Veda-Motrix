
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'https://veda-motrix-ai.com', 
    'X-Title': 'VEDA-MOTRIX AI', 
  },
});

export default openai;
