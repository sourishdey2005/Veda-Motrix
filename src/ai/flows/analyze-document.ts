
'use server';
/**
 * @fileoverview A Genkit flow that analyzes a document (CSV, TXT, image).
 * PDF analysis has been temporarily removed due to an unstable dependency.
 */
import {
  AnalyzeDocumentInput,
  AnalyzeDocumentOutput,
  AnalyzeDocumentOutputSchema,
} from '@/ai/types';
import { ai } from '@/ai/genkit';
import { z } from 'zod';

const DocumentAnalysisInputInternalSchema = z.object({
  prompt: z.string(),
  textContent: z.string().optional(),
  documentDataUri: z.string().optional(),
});

const analysisPrompt = ai.definePrompt(
  {
    name: 'documentAnalysis',
    input: { schema: DocumentAnalysisInputInternalSchema },
    output: { schema: AnalyzeDocumentOutputSchema },
    system: `You are an expert data analyst AI. A user has provided a document and a prompt.

Your task is to analyze the document based on their prompt.
- If it's an image, describe the contents and answer the prompt.
- If it's text (from a CSV or TXT file), analyze the content to answer the prompt.

Provide a clear, well-structured analysis in Markdown format.
---`,
    prompt: `User Prompt: "{{prompt}}"

{{#if textContent}}
Document Content:
\`\`\`
{{textContent}}
\`\`\`
{{/if}}

{{#if documentDataUri}}
{{media url=documentDataUri}}
{{/if}}
`,
  },
);


// Helper function to parse Data URI
const parseDataUri = (dataUri: string) => {
  const match = dataUri.match(/^data:(.+?);base64,(.*)$/);
  if (!match) {
    throw new Error('Invalid data URI');
  }
  return {
    mimeType: match[1],
    content: match[2],
  };
};

export async function analyzeDocument(
  input: AnalyzeDocumentInput
): Promise<AnalyzeDocumentOutput> {
  try {
    const { mimeType, content } = parseDataUri(input.documentDataUri);
    const buffer = Buffer.from(content, 'base64');
    
    let flowInput: z.infer<typeof DocumentAnalysisInputInternalSchema>;

    if (mimeType.startsWith('image/')) {
        flowInput = {
            prompt: input.prompt,
            documentDataUri: input.documentDataUri,
        };
    } else if (mimeType.startsWith('text/')) {
        const textContent = buffer.toString('utf-8');
        flowInput = {
            prompt: input.prompt,
            textContent: textContent,
        };
    } else if (mimeType === 'application/pdf') {
        return {
          analysis: `#### Error\nUnsupported file type: PDF processing is temporarily unavailable. Please try a standard image format (JPG, PNG), CSV, or a plain text file (.txt).`,
        };
    } else {
        return {
          analysis: `#### Error\nUnsupported file type: ${mimeType}. Please use a standard image format (JPG, PNG), CSV, or a plain text file (.txt).`,
        };
    }
    
    const result = await ai.run(analysisPrompt, flowInput);
    return result;

  } catch (error: any) {
      console.error('Error in document analysis flow:', error);
      let errorMessage = `An unexpected error occurred while analyzing the document. It might be corrupted or in an unsupported format.\n\nDetails: ${error.message}`;
      if (error.message?.includes('Invalid data URI')) {
        errorMessage = 'The uploaded file could not be read. It might be corrupted or in a format the system cannot process.';
      }
      return {
        analysis: `#### Error\n${errorMessage}`,
      };
  }
}
