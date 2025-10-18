import OpenAI from 'openai';

if (!process.env.OPENROUTER_API_KEY) {
  // This error will be thrown if the API key is not set in the environment.
  // On platforms like Netlify, you must set this in the site's build & deploy settings.
  throw new Error('The OPENROUTER_API_KEY environment variable is not set.');
}

export const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'https://veda-motrix.ai',
    'X-Title': 'VEDA-MOTRIX AI',
  },
});
