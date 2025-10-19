
'use server';

if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable not set.");
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

interface TextPart {
    text: string;
}

interface InlineDataPart {
    inline_data: {
        mime_type: string;
        data: string;
    };
}

type Part = TextPart | InlineDataPart;

interface Message {
    role: 'user' | 'model';
    parts: Part[];
}

interface GeminiResponse {
    candidates: {
        content: {
            parts: {
                text: string;
            }[];
        };
    }[];
}

export async function geminiClient(
    prompt: string,
    history: Message[] = [],
    isJsonMode: boolean = false,
    imageDataUri?: string
): Promise<string> {
    try {
        const modelName = 'gemini-1.5-flash'; // Corrected stable model name
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`;

        const userParts: Part[] = [{ text: prompt }];

        if (imageDataUri) {
            const dataUriMatch = imageDataUri.match(/^data:(.+?);base64,(.*)$/);
            if (!dataUriMatch) {
                throw new Error('Invalid data URI for image.');
            }
            const mimeType = dataUriMatch[1];
            const base64Data = dataUriMatch[2];
            userParts.push({
                inline_data: {
                    mime_type: mimeType,
                    data: base64Data,
                },
            });
        }
        
        const contents: Message[] = [...history, { role: 'user', parts: userParts }];

        const payload: Record<string, any> = { contents };

        if (isJsonMode) {
             payload.generationConfig = {
                response_mime_type: "application/json",
            };
        }
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': GEMINI_API_KEY,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error('Google AI API Error:', errorBody);
            throw new Error(`API request failed with status ${response.status}: ${response.statusText}. Body: ${errorBody}`);
        }

        const data: GeminiResponse = await response.json();
        
        if (data.candidates && data.candidates.length > 0 && data.candidates[0].content.parts.length > 0) {
            return data.candidates[0].content.parts[0].text;
        }

        throw new Error('No response content returned from the API.');
    } catch (error) {
        console.error('Error in geminiClient:', error);
        throw error; // Re-throw the error to be caught by the calling flow
    }
}
