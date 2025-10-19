
'use server';

if (!process.env.OPENROUTER_API_KEY) {
    console.warn("OPENROUTER_API_KEY environment variable not set. Using placeholder. AI features will not work.");
}

// It's recommended to set these in your environment variables for real use.
const YOUR_SITE_URL = process.env.YOUR_SITE_URL || 'http://localhost:3000';
const YOUR_SITE_NAME = process.env.YOUR_SITE_NAME || 'VEDA-MOTRIX';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string | (string | { type: 'image_url', image_url: { url: string } })[];
}

interface OpenAiResponse {
    choices: {
        message: {
            content: string;
        };
    }[];
}

export async function openAiClient(
    messages: Message[],
    isJsonMode: boolean = false
): Promise<string> {
    try {
        const apiKey = process.env.OPENROUTER_API_KEY || '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';
        if (apiKey === 'YOUR_OPENROUTER_API_KEY_PLACEHOLDER') {
             throw new Error("OpenRouter API key is not configured.");
        }

        const body: any = {
            model: 'alibaba/tongyi-deepresearch-30b-a3b:free',
            messages: messages,
        };

        if (isJsonMode) {
            body.response_format = { type: "json_object" };
            // Add a system message to ensure JSON output if not already present
            if (!messages.some(m => m.role === 'system' && typeof m.content === 'string' && m.content.includes('JSON'))) {
                 messages.unshift({
                    role: 'system',
                    content: 'You are a helpful assistant designed to output JSON.'
                });
            }
        }
        
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': YOUR_SITE_URL,
                'X-Title': YOUR_SITE_NAME,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error('OpenRouter API Error:', errorBody);
            throw new Error(`API request failed with status ${response.status}: ${response.statusText}. Body: ${errorBody}`);
        }

        const data: OpenAiResponse = await response.json();
        
        if (data.choices && data.choices.length > 0 && data.choices[0].message.content) {
            return data.choices[0].message.content;
        }

        throw new Error('No response content returned from the API.');
    } catch (error) {
        console.error('Error in openAiClient:', error);
        throw error; 
    }
}
