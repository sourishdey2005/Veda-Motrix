
'use server';
/**
 * @fileOverview An AI flow that summarizes uploaded documents (e.g., CSV, PDF).
 */
import { aiClient, visionModel } from '@/ai/genkit';
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
    // Since we are using a text model, we extract text content.
    // A true multi-modal implementation would pass the data URI differently.
    const decodedContent = Buffer.from(input.documentDataUri.split(',')[1], 'base64').toString('utf8');

    const prompt = `Summarize the following document content, providing a concise overview of its key points and structure. If it is a CSV, describe the columns and provide a summary of the data.

Document Content:
---
${decodedContent.substring(0, 4000)}... 
---
`;
    
    const response = await aiClient.chat.completions.create({
      model: visionModel, 
      messages: [
        { 
          role: 'user',
          content: prompt,
        }
      ],
      temperature: 0.2,
      top_p: 1,
      max_tokens: 1024,
    });


    const analysisText = response.choices[0]?.message?.content;

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
