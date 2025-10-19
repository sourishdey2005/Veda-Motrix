
'use server';

if (!process.env.OPENROUTER_API_KEY) {
  console.warn(
    'OPENROUTER_API_KEY environment variable not set. AI features may not work.'
  );
}

const YOUR_SITE_URL = process.env.YOUR_SITE_URL || 'http://localhost:3000';
const YOUR_SITE_NAME = process.env.YOUR_SITE_NAME || 'VEDA-MOTRIX';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: any;
}

export async function openAiClient(
  messages: Message[],
  isJsonMode: boolean = false
): Promise<string> {
  try {
    const body = {
      model: 'openai/gpt-4o-mini:free',
      messages: messages,
      response_format: isJsonMode ? { type: 'json_object' } : { type: 'text' },
    };

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "HTTP-Referer": YOUR_SITE_URL,
            "X-Title": YOUR_SITE_NAME,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error("API request failed with status", response.status, "Body:", errorBody);
        throw new Error(`API request failed with status ${response.status}: ${response.statusText}. Body: ${errorBody}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

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
