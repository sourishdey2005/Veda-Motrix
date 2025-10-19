
'use server';
/**
 * @fileoverview A Genkit flow that analyzes a document (CSV, TXT, image).
 * PDF analysis has been temporarily removed due to an unstable dependency.
 */
import {
  AnalyzeDocumentInput,
  AnalyzeDocumentInputSchema,
  AnalyzeDocumentOutput,
  AnalyzeDocumentOutputSchema,
} from '@/ai/types';
import { ai } from '@/ai/genkit';

const analyzeDocumentPrompt = ai.definePrompt(
  {
    name: 'analyzeDocumentPrompt',
    input: { schema: AnalyzeDocumentInputSchema },
    output: { schema: AnalyzeDocumentOutputSchema },
    model: 'googleai/gemini-1.5-flash-latest',
    prompt: `You are an expert data analyst AI. A user has provided a document and a prompt. Analyze the document's content to answer the user's prompt. 
    
The document is provided in the 'document' field. It will be either text content or an image.
Provide a clear, well-structured analysis in Markdown format.

User Prompt: "{{prompt}}"

Document: {{media url=documentDataUri}}
`,
  },
);

const analyzeDocumentFlow = ai.defineFlow(
  {
    name: 'analyzeDocumentFlow',
    inputSchema: AnalyzeDocumentInputSchema,
    outputSchema: AnalyzeDocumentOutputSchema,
  },
  async (input) => {
    const { output } = await analyzeDocumentPrompt(input);
    if (!output) {
      throw new Error('Analysis failed: AI did not return a response.');
    }
    return output;
  }
);

export async function analyzeDocument(
  input: AnalyzeDocumentInput
): Promise<AnalyzeDocumentOutput> {
  try {
     const dataUriMatch = input.documentDataUri.match(/^data:(.+?);base64,(.*)$/);
    if (!dataUriMatch) {
      throw new Error('Invalid data URI');
    }
    const mimeType = dataUriMatch[1];
    
    // PDF support is temporarily removed.
    if (mimeType === 'application/pdf') {
       return {
        analysis: `#### Error\nUnsupported file type: ${mimeType}. PDF analysis is temporarily unavailable. Please use a standard image format (JPG, PNG), CSV, or a plain text file (.txt).`,
      };
    }
    
    return await analyzeDocumentFlow(input);

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
