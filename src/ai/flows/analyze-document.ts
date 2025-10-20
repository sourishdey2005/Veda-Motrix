
'use server';
/**
 * @fileOverview An AI flow that summarizes uploaded documents (e.g., CSV, PDF).
 */
import {ai} from '@/ai/genkit';
import {z} from 'zod';
import {
  AnalyzeDocumentInput,
  AnalyzeDocumentInputSchema,
  AnalyzeDocumentOutput,
  AnalyzeDocumentOutputSchema,
} from '@/ai/types';

// Define the document analysis flow using Genkit
const analyzeDocumentFlow = ai.defineFlow(
  {
    name: 'analyzeDocumentFlow',
    inputSchema: AnalyzeDocumentInputSchema,
    outputSchema: AnalyzeDocumentOutputSchema,
  },
  async (input: AnalyzeDocumentInput) => {
    // Generate content using the Gemini Pro Vision model for multi-modal input
    const llmResponse = await ai.generate({
      model: 'gemini-pro-vision',
      prompt: [
        {
          text: 'Summarize the following document, providing a concise overview of its key points and structure. If it is a CSV, describe the columns and provide a summary of the data.',
        },
        {
          media: {
            url: input.documentDataUri,
          },
        },
      ],
    });

    const analysisText = llmResponse.text;

    return {
      analysis:
        analysisText || 'Could not generate a summary for the document.',
    };
  }
);

/**
 * Executes the document analysis flow.
 * @param input The document data to analyze.
 * @returns A promise that resolves to the analysis output.
 */
export async function analyzeDocument(
  input: AnalyzeDocumentInput
): Promise<AnalyzeDocumentOutput> {
  try {
    return await analyzeDocumentFlow(input);
  } catch (error) {
    console.error('Error in analyzeDocument flow:', error);
    // Ensure a valid output structure is returned on error
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    return {
      analysis: `An unexpected error occurred during document analysis: ${errorMessage}`,
    };
  }
}
