
'use server';

if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY environment variable not set.");
}

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatCompletionResponse {
    id: string;
    model: string;
    choices: {
        message: {
            role: string;
            content: string;
        };
        finish_reason: string;
    }[];
}

export async function openAiClient(
    prompt: string,
    history: Message[] = [],
    isJsonMode: boolean = false
): Promise<string> {
    try {
        const messages = [...history];
        if (prompt) {
            messages.push({ role: 'user', content: prompt });
        }
        
        const body: Record<string, any> = {
            model: 'openai/gpt-4o',
            messages,
        };

        if (isJsonMode) {
            body.response_format = { type: 'json_object' };
        }

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error('OpenRouter API Error:', errorBody);
            throw new Error(`API request failed with status ${response.status}: ${response.statusText}. Body: ${errorBody}`);
        }

        const data: ChatCompletionResponse = await response.json();
        
        if (data.choices && data.choices.length > 0) {
            return data.choices[0].message.content;
        }

        throw new Error('No response choices returned from the API.');
    } catch (error) {
        console.error('Error in openAiClient:', error);
        throw error; // Re-throw the error to be caught by the calling flow
    }
}
