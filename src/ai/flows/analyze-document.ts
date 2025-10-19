
'use server';

import {ai} from '@/ai/genkit';
import {
  AnalyzeDocumentInputSchema,
  AnalyzeDocumentOutputSchema,
  type AnalyzeDocumentInput,
  type AnalyzeDocumentOutput,
} from '@/ai/types';

const prompt = ai.definePrompt(
  {
    name: 'documentAnalysisPrompt',
    input: {schema: AnalyzeDocumentInputSchema},
    output: {schema: AnalyzeDocumentOutputSchema},
    prompt: `You are a professional document analysis AI. Analyze the document provided based on the user's request.

User Prompt: "{{prompt}}"

--- Document Content ---
{{media url=documentDataUri}}
--- End Document ---
`,
  },
  async (input) => {
    return {
      model: 'googleai/gemini-1.5-flash',
    };
  }
);

const analyzeDocumentFlow = ai.defineFlow(
  {
    name: 'analyzeDocumentFlow',
    inputSchema: AnalyzeDocumentInputSchema,
    outputSchema: AnalyzeDocumentOutputSchema,
  },
  async (input) => {
    const dataUriParts = input.documentDataUri.match(/^data:(.+?);base64,(.*)$/);
    if (!dataUriParts) {
      return {
        analysis:
          '#### Error\nInvalid document format. Could not read the uploaded file.',
      };
    }

    const mimeType = dataUriParts[1];

    if (
      !mimeType.startsWith('image/') &&
      !mimeType.startsWith('text/')
    ) {
      return {
        analysis: `#### Error\nUnsupported file type: \`${mimeType}\`. Please upload a supported document format like an image (JPG, PNG) or plain text file (.txt).\n\nPDF analysis is not currently supported.`,
      };
    }

    try {
        const {output} = await prompt(input);
        if (!output) {
          return {
            analysis:
              '#### Error\nAI failed to generate a response after processing the document.',
          };
        }
        return output;
    } catch (error: any) {
        console.error("Error in document analysis flow:", error);
         if (error.message.includes('unsupported content type')) {
            return {
                analysis: '#### Error\nUnsupported file type. Please upload a supported document format like JPG, PNG, or plain text.',
            };
        }
        return {
            analysis: '#### Error\nAn unexpected error occurred while analyzing the document. It might be corrupted or in an unsupported format.',
        };
    }
  }
);

export async function analyzeDocument(
  input: AnalyzeDocumentInput
): Promise<AnalyzeDocumentOutput> {
  return analyzeDocumentFlow(input);
}
