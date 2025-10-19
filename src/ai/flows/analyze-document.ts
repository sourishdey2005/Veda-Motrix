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
import { Part } from 'genkit/content';

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

    let promptParts: Part[] = [];

    if (mimeType.startsWith('image/')) {
      const analysisPrompt = `You are an expert data analyst AI. A user has provided an image and a prompt. Describe the contents of the image and answer the user's prompt based on the image. Provide a clear, well-structured analysis in Markdown format.

User Prompt: "${input.prompt}"`;
      promptParts = [
        { text: analysisPrompt },
        { inlineData: { mimeType, data: base64Data } },
      ];
    } else if (mimeType.startsWith('text/')) {
      const textContent = Buffer.from(base64Data, 'base64').toString('utf-8');
      const analysisPrompt = `You are an expert data analyst AI. A user has provided a document's text content and a prompt. Analyze the text content to answer the prompt. Provide a clear, well-structured analysis in Markdown format.

User Prompt: "${input.prompt}"

Document Content:
\`\`\`
${textContent}
\`\`\`
`;
      promptParts = [{ text: analysisPrompt }];
    } else {
      return {
        analysis: `#### Error\nUnsupported file type: ${mimeType}. Please use a standard image format (JPG, PNG), CSV, or a plain text file (.txt). PDF analysis is temporarily unavailable.`,
      };
    }

    const { output } = await ai.generate({
        model: 'googleai/gemini-pro-vision',
        prompt: promptParts,
    });
    
    const analysis = output?.text;

    if (!analysis) {
      throw new Error('No text output from AI');
    }

    return { analysis };
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
