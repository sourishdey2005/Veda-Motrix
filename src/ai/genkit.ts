
'use server';

if (!process.env.HF_TOKEN) {
  console.warn(
    'HF_TOKEN environment variable not set. AI features may not work.'
  );
}

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: any;
}

const TEXT_MODEL = "Qwen/Qwen3-0.6B:fireworks-ai";
const VISION_MODEL = "NousResearch/Nous-Hermes-2-Vision-GGUF/Nous-Hermes-2-Vision-7B-GGUF:free";

export async function openAiClient(
  messages: Message[],
  isJsonMode: boolean = false,
  isVision: boolean = false
): Promise<string> {
  try {
    const model = isVision ? VISION_MODEL : TEXT_MODEL;
    
    // The HuggingFace API doesn't have a dedicated JSON mode,
    // so we instruct the model to output JSON in the prompt for text models.
    if (isJsonMode && !isVision) {
      const lastMessage = messages.pop();
      if(lastMessage) {
        messages.push({ ...lastMessage, content: `${lastMessage.content}\n\nRespond with a JSON object.`})
      }
    }
    
    const body = {
      model: model,
      messages: messages,
      // The HF endpoint doesn't support response_format, we rely on prompting for JSON.
    };

    const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.HF_TOKEN}`,
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
