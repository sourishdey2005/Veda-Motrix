
'use server';

/**
 * @fileOverview An AI agent to analyze uploaded documents (CSV, PDF, TXT).
 *
 * - analyzeDocument - A function that analyzes the content of a file based on a user prompt.
 * - AnalyzeDocumentInput - The input type for the analyzeDocument function.
 * - AnalyzeDocumentOutput - The return type for the analyzeDocument function.
 */

import { openai } from '@/ai/client';
import { z } from 'zod';
import { fromPath } from 'pdf-parse/lib/pdf-parse';
import * as fs from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';

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

async function extractTextFromDataUri(dataUri: string): Promise<string> {
    const [header, base64Data] = dataUri.split(',');
    if (!header || !base64Data) {
        throw new Error('Invalid data URI format');
    }
    
    const mimeType = header.split(':')[1].split(';')[0];
    const buffer = Buffer.from(base64Data, 'base64');
    
    if (mimeType === 'application/pdf') {
        const tempFilePath = join(tmpdir(), `doc-${Date.now()}.pdf`);
        await fs.writeFile(tempFilePath, buffer);
        const data = await fromPath(tempFilePath);
        await fs.unlink(tempFilePath); // Clean up the temp file
        return data.text;
    } else if (mimeType === 'text/csv' || mimeType === 'text/plain') {
        return buffer.toString('utf-8');
    } else {
        throw new Error(`Unsupported file type: ${mimeType}`);
    }
}


export async function analyzeDocument(
  input: AnalyzeDocumentInput
): Promise<AnalyzeDocumentOutput> {
    const { documentDataUri, prompt } = input;
    
    let documentText = '';
    try {
        documentText = await extractTextFromDataUri(documentDataUri);
    } catch (error) {
         console.error('Error extracting text:', error);
         return { analysis: `#### Error\nCould not read the content of the file. It might be corrupted or in an unsupported format.` };
    }

    if (!documentText.trim()) {
        return { analysis: `#### Analysis Result\nThe document appears to be empty or could not be read.` };
    }

    const systemPrompt = `You are a professional document analysis AI. Analyze the following document content based on the user's request. Provide a concise, well-structured analysis in Markdown format.
If the document text appears to be garbled or unreadable, please state that you were unable to parse the content of the file.
Use headings, bold text, and bullet points to structure your response for clarity.`;
    
    const userPrompt = `**Original User Prompt:** "${prompt}"\n\n**Document Content:**\n\n---\n\n${documentText.substring(0, 15000)}`; // Limit content size to avoid exceeding token limits

    const completion = await openai.chat.completions.create({
        model: 'openrouter/auto',
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
        ],
    });

    const analysis = completion.choices[0].message?.content;
     if (!analysis) {
        throw new Error('AI failed to generate a response.');
    }

    return { analysis };
}
