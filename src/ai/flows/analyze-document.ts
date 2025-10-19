
'use server';

/**
 * @fileOverview An AI agent to analyze uploaded documents (CSV, PDF, TXT).
 *
 * - analyzeDocument - A function that analyzes the content of a file based on a user prompt.
 * - AnalyzeDocumentInput - The input type for the analyzeDocument function.
 * - AnalyzeDocumentOutput - The return type for the analyzeDocument function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const AnalyzeDocumentInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "The content of the document as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  prompt: z
    .string()
    .describe("The user's prompt directing the analysis of the document."),
});
export type AnalyzeDocumentInput = z.infer<typeof AnalyzeDocumentInputSchema>;

export const AnalyzeDocumentOutputSchema = z.object({
  analysis: z
    .string()
    .describe('The resulting analysis of the document, formatted as Markdown.'),
});
export type AnalyzeDocumentOutput = z.infer<
  typeof AnalyzeDocumentOutputSchema
>;

const documentAnalysisPrompt = ai.definePrompt(
    {
        name: 'documentAnalysisPrompt',
        input: { schema: AnalyzeDocumentInputSchema },
        output: { schema: AnalyzeDocumentOutputSchema },
        prompt: `You are a professional document analysis AI. Analyze the document provided based on the user's request.

        If the document seems unreadable or empty, state that you were unable to parse the content. Otherwise, provide a concise, well-structured analysis in Markdown format, using headings, bold text, and bullet points for clarity.

        User Prompt: "{{{prompt}}}"
        Document: {{media url=documentDataUri}}
        `
    }
);

export const analyzeDocumentFlow = ai.defineFlow(
    {
        name: 'analyzeDocumentFlow',
        inputSchema: AnalyzeDocumentInputSchema,
        outputSchema: AnalyzeDocumentOutputSchema,
    },
    async (input) => {
        try {
            const { output } = await documentAnalysisPrompt(input);
            if (!output) {
                return { analysis: '#### Error\nAI failed to generate a response.' };
            }
            return output;
        } catch (error: any) {
            console.error('Error in document analysis flow:', error);
            if (error.message.includes('unsupported content type')) {
                 return { analysis: `#### Error\nUnsupported file type. Please upload a supported document format like PDF, JPG, PNG, or plain text.` };
            }
            return { analysis: `#### Error\nAn unexpected error occurred while analyzing the document. It might be corrupted or in an unsupported format.` };
        }
    }
);


export async function analyzeDocument(
  input: AnalyzeDocumentInput
): Promise<AnalyzeDocumentOutput> {
  return await analyzeDocumentFlow(input);
}
