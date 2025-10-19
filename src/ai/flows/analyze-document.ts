
'use server';
/**
 * @fileoverview A Genkit flow that analyzes a document (CSV, TXT, image).
 * PDF analysis has been temporarily removed due to an unstable dependency.
 */
import {
  AnalyzeDocumentInput,
  AnalyzeDocumentOutput,
  AnalyzeDocumentOutputSchema,
} from '@/ai/types';
import { GoogleGenerativeAI, Part } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY environment variable not set.");
}
const genAI = new GoogleGenerativeAI(apiKey);

// Helper function to parse Data URI
const parseDataUri = (dataUri: string) => {
  const match = dataUri.match(/^data:(.+?);base64,(.*)$/);
  if (!match) {
    throw new Error('Invalid data URI');
  }
  return {
    mimeType: match[1],
    content: match[2],
  };
};

export async function analyzeDocument(
  input: AnalyzeDocumentInput
): Promise<AnalyzeDocumentOutput> {
  try {
    const { mimeType, content } = parseDataUri(input.documentDataUri);
    const buffer = Buffer.from(content, 'base64');
    
    let parts: Part[] = [];
    
    if (mimeType.startsWith('image/')) {
        parts = [
            { inlineData: { mimeType, data: content } },
            { text: `User Prompt: "${input.prompt}"` },
        ];
    } else if (mimeType.startsWith('text/')) {
        const textContent = buffer.toString('utf-8');
        parts = [
             { text: `Document Content:\n\`\`\`\n${textContent}\n\`\`\`` },
             { text: `User Prompt: "${input.prompt}"` },
        ];
    } else if (mimeType === 'application/pdf') {
        return {
          analysis: `#### Error\nUnsupported file type: PDF processing is temporarily unavailable. Please try a standard image format (JPG, PNG), CSV, or a plain text file (.txt).`,
        };
    } else {
        return {
          analysis: `#### Error\nUnsupported file type: ${mimeType}. Please use a standard image format (JPG, PNG), CSV, or a plain text file (.txt).`,
        };
    }
    
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

    const systemInstruction = `You are an expert data analyst AI. A user has provided a document and a prompt.

Your task is to analyze the document based on their prompt.
- If it's an image, describe the contents and answer the prompt.
- If it's text (from a CSV or TXT file), analyze the content to answer the prompt.

Provide a clear, well-structured analysis in Markdown format.
---
`;

    const result = await model.generateContent([systemInstruction, ...parts]);
    const response = await result.response;
    const analysis = response.text();

    return { analysis };

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
