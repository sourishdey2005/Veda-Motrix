'use server';
/**
 * @fileoverview A Genkit flow that analyzes a document (CSV, TXT, image).
 * PDF analysis has been temporarily removed due to an unstable dependency.
 */
import {
  AnalyzeDocumentInput,
  AnalyzeDocumentOutput,
} from '@/ai/types';
import { ai } from '@/ai/genkit';

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
    
    let prompt;
    const requestParts: (string | { inlineData: { mimeType: string; data: string } })[] = [];

    if (mimeType.startsWith('image/')) {
        prompt = `You are an expert data analyst AI. A user has provided an image and a prompt. Describe the contents of the image and answer the user's prompt based on the image. Provide a clear, well-structured analysis in Markdown format.

User Prompt: "${input.prompt}"`;
        requestParts.push({
            inlineData: {
                mimeType: mimeType,
                data: base64Data,
            }
        });
    } else if (mimeType.startsWith('text/')) {
        const textContent = Buffer.from(base64Data, 'base64').toString('utf-8');
        prompt = `You are an expert data analyst AI. A user has provided a document's text content and a prompt. Analyze the text content to answer the prompt. Provide a clear, well-structured analysis in Markdown format.

User Prompt: "${input.prompt}"

Document Content:
\`\`\`
${textContent}
\`\`\`
`;
    } else {
       return {
          analysis: `#### Error\nUnsupported file type: ${mimeType}. Please use a standard image format (JPG, PNG), CSV, or a plain text file (.txt). PDF analysis is temporarily unavailable.`,
        };
    }
    
    requestParts.unshift(prompt);
    
    const { output } = await ai.generate({
        model: 'googleai/gemini-pro',
        prompt: requestParts,
    });

    if (!output || !output.text) {
      throw new Error('No text output from AI');
    }

    return { analysis: output.text };

  } catch (error: any) {
      console.error('Error in document analysis flow:', error);
      let errorMessage = `An unexpected error occurred while analyzing the document. It might be corrupted or in an unsupported format.\n\nDetails: ${error.message}`;
      if (error.message?.includes('Invalid data URI')) {
        errorMessage = 'The uploaded file could not be read. It might be corrupted or in a format the system cannot process.';
      }
      return {
        analysis: `#### Error\n${errorMessage}`,
      };
  }
}
