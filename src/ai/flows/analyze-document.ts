
'use server';

/**
 * @fileOverview An AI agent to analyze uploaded documents (CSV, PDF, TXT).
 *
 * - analyzeDocument - A function that analyzes the content of a file based on a user prompt.
 * - AnalyzeDocumentInput - The input type for the analyzeDocument function.
 * - AnalyzeDocumentOutput - The return type for the analyzeDocument function.
 */

import {ai} from 'genkit';
import {z} from 'genkit/zod';

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

export async function analyzeDocument(
  input: AnalyzeDocumentInput
): Promise<AnalyzeDocumentOutput> {
  const llmResponse = await analyzeDocumentFlow(input);
  return {analysis: llmResponse};
}

const analyzeDocumentFlow = ai.defineFlow(
  {
    name: 'analyzeDocumentFlow',
    inputSchema: AnalyzeDocumentInputSchema,
    outputSchema: z.string(),
  },
  async ({documentDataUri, prompt}) => {
    const model = 'googleai/gemini-1.5-pro-latest';
    const llmResponse = await ai.generate({
      model: model,
      prompt: [
        {
          text: `You are a professional document analysis AI. Analyze the following document based on the user's request. Provide a concise, well-structured analysis in Markdown format.
If the document text appears to be garbled or unreadable, please state that you were unable to parse the content of the file.
Use headings, bold text, and bullet points to structure your response for clarity.
Original User Prompt: ${prompt}`,
        },
        {media: {url: documentDataUri}},
      ],
    });
    return llmResponse.text;
  }
);
