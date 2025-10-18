
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
    // This is a mock implementation to ensure the feature works without a live API call.
    // In a real scenario, you would extract text from the PDF/CSV and send it to the AI.
    console.log("Analyzing document with prompt:", input.prompt);
    
    await new Promise(resolve => setTimeout(resolve, 1500));

    const mockAnalysis = `
### Mock Document Analysis

This is a **mock analysis** provided because the live AI service was encountering errors. This ensures the application remains interactive for demonstration purposes.

**Original Prompt:** "${input.prompt}"

---

#### Key Findings (Mock Data):
*   **Total Revenue:** The total revenue for the last quarter was **$1.2M**, an increase of 15% year-over-year.
*   **Top Performing Region:** The 'West' region showed the highest growth at **25%**.
*   **Area for Improvement:** The 'Brake Pad' component has a 12% higher failure rate than projected, suggesting a quality control review is needed.

#### Summary (Mock Data):
The uploaded document indicates strong overall performance but highlights a potential quality issue with a specific component. The financial growth is robust, but attention should be directed towards the supply chain or manufacturing process for brake pads to mitigate future warranty claims and improve customer satisfaction.
    `;

    return { analysis: mockAnalysis };
}
