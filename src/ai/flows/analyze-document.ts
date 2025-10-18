
'use server';

/**
 * @fileOverview An AI agent to analyze uploaded documents (CSV, PDF).
 *
 * - analyzeDocument - A function that analyzes the content of a file based on a user prompt.
 * - AnalyzeDocumentInput - The input type for the analyzeDocument function.
 * - AnalyzeDocumentOutput - The return type for the analyzeDocument function.
 */

import { z } from 'zod';
import { openai } from '@/ai/client';

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
    const base64Data = input.documentDataUri.split(',')[1];
    const documentContent = Buffer.from(base64Data, 'base64').toString('utf-8');

    const prompt = `You are an expert document analysis AI. A user has uploaded a document and wants you to analyze it.

    USER'S PROMPT:
    "${input.prompt}"

    DOCUMENT CONTENT:
    ---
    ${documentContent.substring(0, 20000)}
    ---

    Based on the user's prompt, analyze the document content and provide a detailed analysis formatted in Markdown. If the document is very long, your analysis should be based on the first 20,000 characters provided.`;

    const completion = await openai.chat.completions.create({
        model: 'openai/gpt-4o',
        messages: [{ role: 'user', content: prompt }],
    });

    const analysis = completion.choices[0].message?.content;
    if (!analysis) {
        throw new Error('AI failed to generate an analysis.');
    }

    return { analysis };
}
