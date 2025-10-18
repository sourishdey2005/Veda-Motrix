
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
import pdf from 'pdf-parse';

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

async function getDocumentText(dataUri: string): Promise<string> {
    const parts = dataUri.split(',');
    const meta = parts[0];
    const base64Content = parts[1];

    if (!base64Content || !meta) {
        throw new Error('Invalid document data URI format.');
    }
    
    const buffer = Buffer.from(base64Content, 'base64');

    if (meta.includes('application/pdf')) {
        const pdfData = await pdf(buffer);
        return pdfData.text;
    } else {
        // For CSV, TXT, etc.
        return buffer.toString('utf-8');
    }
}


export async function analyzeDocument(
  input: AnalyzeDocumentInput
): Promise<AnalyzeDocumentOutput> {
  try {
    const documentText = await getDocumentText(input.documentDataUri);
    
    const systemPrompt = `You are a professional document analysis AI. Analyze the following document text based on the user's request. Provide a concise, well-structured analysis in Markdown format.

Use headings, bold text, and bullet points to structure your response for clarity.

**Original User Prompt**: ${input.prompt}
---
**Document Text**:
${documentText.substring(0, 30000)}
---
`;

    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-4o',
      messages: [
        { role: 'user', content: systemPrompt },
      ],
    });

    const analysis = completion.choices[0].message?.content;
    if (!analysis) {
      throw new Error('AI failed to generate an analysis.');
    }

    return { analysis };

  } catch (error: any) {
      console.error("[Document Analysis Error]", error);
      // Re-throw a more user-friendly error
      throw new Error(`Failed to process document: ${error.message}`);
  }
}
