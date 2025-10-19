
'use server';
/**
 * @fileoverview A Genkit flow that analyzes a document (PDF, CSV, TXT, image) based on a user's prompt.
 */
import {ai} from '@/ai/genkit';
import {
  AnalyzeDocumentInput,
  AnalyzeDocumentInputSchema,
  AnalyzeDocumentOutput,
  AnalyzeDocumentOutputSchema,
} from '@/ai/types';
import {z} from 'zod';

const analysisPrompt = ai.definePrompt(
  {
    name: 'documentAnalysisPrompt',
    input: {
      schema: z.object({
        prompt: z.string(),
        documentDataUri: z.string(),
      }),
    },
    output: {
      schema: AnalyzeDocumentOutputSchema,
    },
    prompt: `You are an expert data analyst AI. A user has uploaded a document and a prompt.

Your task is to analyze the document based on their prompt.
- If the document is an image, describe the contents of the image and answer the user's prompt.
- If the document is text-based (like CSV, TXT, or extracted text from a PDF), analyze the text content to answer the prompt.

Provide a clear, well-structured analysis in Markdown format.

---
User Prompt: "{{prompt}}"
---
Document Content:
{{media url=documentDataUri}}
---

Your analysis:`,
  },
  async (input) => {
    const {output} = await ai.generate({
      prompt: input,
      model: 'googleai/gemini-1.5-flash',
      config: {
        output: {
          format: 'json',
          schema: AnalyzeDocumentOutputSchema,
        },
      },
    });
    return output!;
  }
);


const analyzeDocumentFlow = ai.defineFlow(
  {
    name: 'analyzeDocumentFlow',
    inputSchema: AnalyzeDocumentInputSchema,
    outputSchema: AnalyzeDocumentOutputSchema,
  },
  async (input) => {
    try {
      const result = await analysisPrompt(input);
      return result;
    } catch (error: any) {
      console.error('Error in document analysis flow:', error);
      if (error.message?.includes('unsupported content type')) {
        return {
          analysis: `#### Error\nUnsupported file type. The AI model cannot process this file. Please try a standard image format (JPG, PNG), PDF, CSV, or a plain text file (.txt).`,
        };
      }
      return {
        analysis: `#### Error\nAn unexpected error occurred while analyzing the document. It might be corrupted or in an unsupported format.\n\nDetails: ${error.message}`,
      };
    }
  }
);


export async function analyzeDocument(
  input: AnalyzeDocumentInput
): Promise<AnalyzeDocumentOutput> {
  return analyzeDocumentFlow(input);
}
