'use server';
/**
 * @fileOverview An AI flow that summarizes uploaded documents (e.g., CSV, PDF).
 */
import { genAI } from '@/ai/genkit';
import {
  AnalyzeDocumentInput,
  AnalyzeDocumentOutput,
} from '@/ai/types';

// Helper to convert data URI to GenerativePart
function fileToGenerativePart(dataUri: string) {
  const match = dataUri.match(/^data:(.+);base64,(.+)$/);
  if (!match) {
    throw new Error('Invalid data URI format');
  }
  const mimeType = match[1];
  const data = match[2];
  return {
    inlineData: {
      mimeType,
      data,
    },
  };
}

/**
 * Executes the document analysis flow.
 * @param input The document data to analyze.
 * @returns A promise that resolves to the analysis output.
 */
export async function analyzeDocument(
  input: AnalyzeDocumentInput
): Promise<AnalyzeDocumentOutput> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
    
    const imagePart = fileToGenerativePart(input.documentDataUri);
    const prompt = 'Summarize the following document, providing a concise overview of its key points and structure. If it is a CSV, describe the columns and provide a summary of the data.';
    
    const result = await model.generateContent([prompt, imagePart]);
    const response = result.response;
    const analysisText = response.text();

    return {
      analysis:
        analysisText || 'Could not generate a summary for the document.',
    };
  } catch (error) {
    console.error('Error in analyzeDocument flow:', error);
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    return {
      analysis: `An unexpected error occurred during document analysis: ${errorMessage}`,
    };
  }
}
