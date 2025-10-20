
'use server';
/**
 * @fileOverview An AI flow that summarizes uploaded documents (e.g., CSV, PDF).
 */
import { aiClient, visionModel } from '@/ai/genkit';
import { isUnexpected } from '@azure-rest/ai-inference';
import {
  AnalyzeDocumentInput,
  AnalyzeDocumentOutput,
} from '@/ai/types';

/**
 * Executes the document analysis flow.
 * @param input The document data to analyze.
 * @returns A promise that resolves to the analysis output.
 */
export async function analyzeDocument(
  input: AnalyzeDocumentInput
): Promise<AnalyzeDocumentOutput> {
  try {
    const prompt = 'Summarize the following document, providing a concise overview of its key points and structure. If it is a CSV, describe the columns and provide a summary of the data.';
    
    const response = await aiClient.path("/chat/completions").post({
      body: {
        model: visionModel, // Use a vision-capable model
        messages: [
          { 
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: input.documentDataUri } }
            ]
          }
        ],
        temperature: 0.2,
        top_p: 1,
        max_tokens: 1024,
      }
    });

    if (isUnexpected(response)) {
      const errorBody = response.body as any;
      const errorMessage = errorBody?.error?.message || 'An unexpected response was received from the server.';
      // Ensure we return a structured error, not throw
      return {
        analysis: `Error: ${errorMessage}`,
      };
    }

    const analysisText = response.body.choices[0]?.message?.content;

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
