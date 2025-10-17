
'use server';

/**
 * @fileOverview An AI agent to analyze uploaded documents (CSV, PDF).
 *
 * - analyzeDocument - A function that analyzes the content of a file based on a user prompt.
 * - AnalyzeDocumentInput - The input type for the analyzeDocument function.
 * - AnalyzeDocumentOutput - The return type for the analyzeDocument function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {z} from 'genkit';

const AnalyzeDocumentInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "The content of the document as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  prompt: z
    .string()
    .describe('The user\'s prompt directing the analysis of the document.'),
});
export type AnalyzeDocumentInput = z.infer<typeof AnalyzeDocumentInputSchema>;

const AnalyzeDocumentOutputSchema = z.object({
  analysis: z
    .string()
    .describe('The resulting analysis of the document, formatted as Markdown.'),
});
export type AnalyzeDocumentOutput = z.infer<
  typeof AnalyzeDocumentOutputSchema
>;

export async function analyzeDocument(
  input: AnalyzeDocumentInput
): Promise<AnalyzeDocumentOutput> {
  return analyzeDocumentFlow(input);
}

const analyzeDocumentFlow = ai.defineFlow(
  {
    name: 'analyzeDocumentFlow',
    inputSchema: AnalyzeDocumentInputSchema,
    outputSchema: AnalyzeDocumentOutputSchema,
  },
  async ({ documentDataUri, prompt }) => {
    const model = googleAI.model('gemini-1.5-flash');

    const result = await ai.generate({
      model,
      prompt: [
        {
          text: `You are an expert data analyst. Analyze the following document based on the user's request. Provide a clear, concise, and well-structured answer in Markdown format.

User Prompt: ${prompt}`
        },
        { media: { url: documentDataUri } },
      ],
      output: {
        format: 'markdown',
        schema: AnalyzeDocumentOutputSchema,
      },
    });

    const output = result.output();
    if (!output) {
      throw new Error("Analysis failed to produce an output.");
    }
    return output;
  }
);
