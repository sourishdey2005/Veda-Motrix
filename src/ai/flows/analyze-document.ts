
'use server';

/**
 * @fileOverview An AI agent to analyze uploaded documents (CSV, PDF).
 *
 * - analyzeDocument - A function that analyzes the content of a file based on a user prompt.
 * - AnalyzeDocumentInput - The input type for the analyzeDocument function.
 * - AnalyzeDocumentOutput - The return type for the analyzeDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

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
  async (input) => {
    // This is a simplified approach to handle documents for reliability in the prototype.
    // It extracts the base64 content and sends it as text to a powerful text model.
    const b64Data = input.documentDataUri.substring(input.documentDataUri.indexOf(',') + 1);
    
    // For a prototype, we will assume the data is text-decodable (like CSV or text-based PDF).
    // In a real application, you would use a library like pdf-parse or csv-parse.
    const documentText = Buffer.from(b64Data, 'base64').toString('utf8');

    const result = await ai.generate({
      model: googleAI.model('gemini-pro'),
      prompt: `You are an expert data analyst. Analyze the following document content based on the user's request. Provide a clear, concise, and well-structured answer in Markdown format.

User Prompt: ${input.prompt}

Document Content:
---
${documentText.substring(0, 5000)}... 
---
`,
    });

    const analysis = result.text;
    if (!analysis) {
        throw new Error("Analysis failed to produce an output.");
    }
    
    return { analysis };
  }
);
