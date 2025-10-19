
'use server';
/**
 * @fileoverview An AI flow that analyzes a document (CSV, TXT, image).
 */
import {
  AnalyzeDocumentInput,
  AnalyzeDocumentOutput,
} from '@/ai/types';
import { openAiClient } from '@/ai/genkit';

export async function analyzeDocument(
  input: AnalyzeDocumentInput
): Promise<AnalyzeDocumentOutput> {
  try {
    const dataUriMatch = input.documentDataUri.match(/^data:(.+?);base64,(.*)$/);
    if (!dataUriMatch) {
      throw new Error('Invalid data URI');
    }
    const mimeType = dataUriMatch[1];
    const base64Data = dataUriMatch[2];

    let documentContent: string;
    let prompt: string;

    if (mimeType.startsWith('image/')) {
        // This is a multi-modal prompt for images
        prompt = `You are an expert data analyst AI. A user has provided an image and a prompt. Analyze the image to answer the user's prompt. 
        Provide a clear, well-structured analysis in Markdown format.
        
        User Prompt: "${input.prompt}"`;
        
        const multiModalPrompt = `[
            {"type": "text", "text": "${prompt.replace(/"/g, '\\"')}"},
            {"type": "image_url", "image_url": {"url": "${input.documentDataUri}"}}
        ]`;

        // The openAiClient needs to be adapted for multimodal input if it's not already
        // For now, we assume the API can handle it or we adjust the client.
        // This is a simplified example. A real implementation might need to adjust the client.
        const rawResponse = await openAiClient(multiModalPrompt);
        return { analysis: rawResponse };

    } else {
        // Handle text-based files
        documentContent = Buffer.from(base64Data, 'base64').toString('utf8');
        prompt = `You are an expert data analyst AI. A user has provided a document's text content and a prompt. Analyze the text content to answer the prompt. Provide a clear, well-structured analysis in Markdown format.

User Prompt: "${input.prompt}"

Document Content:
\`\`\`
${documentContent}
\`\`\`
`;
        const rawResponse = await openAiClient(prompt);
        return { analysis: rawResponse };
    }

  } catch (error: any) {
    console.error('Error in document analysis flow:', error);
    let errorMessage = `An unexpected error occurred while analyzing the document. It might be corrupted or in an unsupported format.\n\nDetails: ${error.message}`;
    if (error.message?.includes('Invalid data URI')) {
      errorMessage =
        'The uploaded file could not be read. It might be corrupted or in a format the system cannot process.';
    }
    return {
      analysis: `#### Error\n${errorMessage}`,
    };
  }
}
