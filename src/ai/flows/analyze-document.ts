
'use server';
/**
 * @fileoverview An AI flow that analyzes a document (CSV, TXT, image).
 */
import {AnalyzeDocumentInput, AnalyzeDocumentOutput} from '@/ai/types';
import {openAiClient} from '@/ai/genkit';
import {ChatCompletionMessageParam} from 'openai/resources/chat';

export async function analyzeDocument(
  input: AnalyzeDocumentInput
): Promise<AnalyzeDocumentOutput> {
  try {
    const dataUriMatch = input.documentDataUri.match(/^data:(.+?);base64,(.*)$/);
    if (!dataUriMatch) {
      throw new Error('Invalid data URI');
    }
    const mimeType = dataUriMatch[1];

    let messages: ChatCompletionMessageParam[];

    if (mimeType.startsWith('image/')) {
      messages = [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `You are an expert data analyst AI. A user has provided an image and a prompt. Analyze the image to answer the user's prompt. Provide a clear, well-structured analysis in Markdown format.

User Prompt: "${input.prompt}"`,
            },
            {
              type: 'image_url',
              image_url: {url: input.documentDataUri},
            },
          ],
        },
      ];
    } else {
      const base64Data = dataUriMatch[2];
      const documentContent = Buffer.from(base64Data, 'base64').toString(
        'utf8'
      );
      const userPrompt = `You are an expert data analyst AI. A user has provided a document's text content and a prompt. Analyze the text content to answer the prompt. Provide a clear, well-structured analysis in Markdown format.

User Prompt: "${input.prompt}"

Document Content:
\`\`\`
${documentContent}
\`\`\`
`;
      messages = [{role: 'user', content: userPrompt}];
    }

    const rawResponse = await openAiClient(messages);
    return {analysis: rawResponse};
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
