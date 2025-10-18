
'use server';

/**
 * @fileOverview An AI agent to analyze uploaded documents (CSV, PDF, TXT).
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
  // Extract the Base64 content from the data URI
  const base64Content = input.documentDataUri.split(',')[1];
  if (!base64Content) {
    throw new Error('Invalid document data URI: No Base64 content found.');
  }

  // Decode the Base64 content to a string
  const documentText = Buffer.from(base64Content, 'base64').toString('utf-8');
  
  const systemPrompt = `You are a professional document analysis AI. Analyze the following document text based on the user's request. Provide a concise, well-structured analysis in Markdown format.

Use headings, bold text, and bullet points to structure your response for clarity.

Document Text:
---
${documentText}
---
`;

  const completion = await openai.chat.completions.create({
    model: 'openai/gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: input.prompt },
    ],
  });

  const analysis = completion.choices[0].message?.content;
  if (!analysis) {
    throw new Error('AI failed to generate an analysis.');
  }

  return { analysis };
}
