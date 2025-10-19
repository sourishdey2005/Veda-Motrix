
'use server';
/**
 * @fileoverview A Genkit flow that analyzes a document (CSV, TXT, image) based on a user's prompt.
 * PDF analysis has been temporarily removed due to an unstable dependency.
 */
import {ai} from '@/ai/genkit';
import {
  AnalyzeDocumentInput,
  AnalyzeDocumentInputSchema,
  AnalyzeDocumentOutput,
  AnalyzeDocumentOutputSchema,
} from '@/ai/types';
import {z} from 'zod';

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

const analysisPrompt = ai.definePrompt(
  {
    name: 'documentAnalysisPrompt',
    input: {
      schema: z.object({
        prompt: z.string(),
        documentDataUri: z.string().optional(),
        textContent: z.string().optional(),
      }),
    },
    output: {
      schema: AnalyzeDocumentOutputSchema,
    },
    prompt: `You are an expert data analyst AI. A user has provided a document and a prompt.

Your task is to analyze the document based on their prompt.
- If it's an image, describe the contents and answer the prompt.
- If it's text (from a CSV or TXT file), analyze the content to answer the prompt.

Provide a clear, well-structured analysis in Markdown format.

---
User Prompt: "{{prompt}}"
---
Document Content:
{{#if documentDataUri}}
  {{media url=documentDataUri}}
{{else}}
  \`\`\`
  {{textContent}}
  \`\`\`
{{/if}}
---

Your analysis:`,
  },
);

const analyzeDocumentFlow = ai.defineFlow(
  {
    name: 'analyzeDocumentFlow',
    inputSchema: AnalyzeDocumentInputSchema,
    outputSchema: AnalyzeDocumentOutputSchema,
  },
  async (input: AnalyzeDocumentInput): Promise<AnalyzeDocumentOutput> => {
    try {
      const { mimeType, content } = parseDataUri(input.documentDataUri);
      const buffer = Buffer.from(content, 'base64');
      
      let promptInput: {
        prompt: string;
        documentDataUri?: string;
        textContent?: string;
      } = { prompt: input.prompt };
      
      if (mimeType.startsWith('image/')) {
        promptInput.documentDataUri = input.documentDataUri;
      } else if (mimeType.startsWith('text/')) {
        promptInput.textContent = buffer.toString('utf-8');
      } else if (mimeType === 'application/pdf') {
         return {
          analysis: `#### Error\nUnsupported file type: PDF processing is temporarily unavailable. Please try a standard image format (JPG, PNG), CSV, or a plain text file (.txt).`,
        };
      }
      else {
        return {
          analysis: `#### Error\nUnsupported file type: ${mimeType}. Please use a standard image format (JPG, PNG), CSV, or a plain text file (.txt).`,
        };
      }
      
      const { output } = await analysisPrompt(promptInput);
      return output || { analysis: 'Analysis could not be generated.'};

    } catch (error: any) {
      console.error('Error in document analysis flow:', error);
      
      let errorMessage = `An unexpected error occurred while analyzing the document. It might be corrupted or in an unsupported format.\n\nDetails: ${error.message}`;

      if (error.message?.includes('Invalid data URI')) {
        errorMessage = 'The uploaded file could not be read. It might be corrupted or in a format the system cannot process.';
      }
      if (error.message?.includes('unsupported content type')) {
        errorMessage = `Unsupported file type. The AI model cannot process this file. Please try a standard image format (JPG, PNG), CSV, or a plain text file (.txt).`;
      }
      if (error.name === 'UnsupportedContentError') {
        errorMessage = `Content Moderation: The document content was blocked by safety filters. Please try a different document.`;
      }
      
      return {
        analysis: `#### Error\n${errorMessage}`,
      };
    }
  }
);


export async function analyzeDocument(
  input: AnalyzeDocumentInput
): Promise<AnalyzeDocumentOutput> {
  return analyzeDocumentFlow(input);
}
