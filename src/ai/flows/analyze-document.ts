
'use server';
/**
 * @fileoverview An AI flow that analyzes a document (CSV, TXT, image).
 */
import {
  AnalyzeDocumentInput,
  AnalyzeDocumentInputSchema,
  AnalyzeDocumentOutput,
  AnalyzeDocumentOutputSchema,
} from '@/ai/types';
import {ai} from '@/ai/genkit';
import {z} from 'zod';

const CHUNK_SIZE = 8000; // Increased chunk size for Gemini

export async function analyzeDocument(
  input: AnalyzeDocumentInput
): Promise<AnalyzeDocumentOutput> {
  const analysisFlow = ai.defineFlow(
    {
      name: 'documentAnalysisFlow',
      inputSchema: AnalyzeDocumentInputSchema,
      outputSchema: AnalyzeDocumentOutputSchema,
    },
    async ({documentDataUri, prompt}) => {
      const dataUriMatch = documentDataUri.match(/^data:(.+?);base64,(.*)$/);
      if (!dataUriMatch) {
        throw new Error('Invalid data URI');
      }
      const mimeType = dataUriMatch[1];

      if (mimeType.startsWith('image/')) {
        const llmResponse = await ai.generate({
          model: 'gemini-1.5-flash-latest',
          prompt: [
            {
              text: `You are an expert data analyst AI. A user has provided an image and a prompt. Analyze the image to answer the user's prompt. Provide a clear, well-structured analysis in Markdown format.

User Prompt: "${prompt}"`,
            },
            {media: {url: documentDataUri, contentType: mimeType}},
          ],
        });
        return {analysis: llmResponse.text()};
      } else {
        const documentContent = Buffer.from(
          dataUriMatch[2],
          'base64'
        ).toString('utf8');

        if (documentContent.length < CHUNK_SIZE * 1.5) {
          // Document is small enough, process directly
          const llmResponse = await ai.generate({
            model: 'gemini-1.5-flash-latest',
            prompt: `You are an expert data analyst AI. A user has provided a document's text content and a prompt. Analyze the text content to answer the prompt. Provide a clear, well-structured analysis in Markdown format.

User Prompt: "${prompt}"

Document Content:
\`\`\`
${documentContent}
\`\`\`
`,
          });
          return {analysis: llmResponse.text()};
        } else {
          // Document is large, use map-reduce sequentially
          const chunks: string[] = [];
          for (let i = 0; i < documentContent.length; i += CHUNK_SIZE) {
            chunks.push(documentContent.substring(i, i + CHUNK_SIZE));
          }

          const chunkSummarizer = ai.defineFlow(
            {
              name: 'chunkSummarizer',
              inputSchema: z.string(),
              outputSchema: z.string(),
            },
            async chunkText => {
              const llmResponse = await ai.generate({
                model: 'gemini-1.5-flash-latest',
                prompt: `Summarize the key points from this specific document chunk that are relevant to the user's overall prompt: "${prompt}". Be concise and focus only on the information present in this chunk. Do not provide a final answer, only a summary of this piece.

Here is the document chunk:
\`\`\`
${chunkText}
\`\`\`
`,
              });
              return llmResponse.text();
            }
          );

          const summaries: string[] = [];
          for (const chunk of chunks) {
            const summary = await chunkSummarizer(chunk);
            summaries.push(summary);
          }

          const finalSynthesizer = ai.defineFlow(
            {
              name: 'finalSynthesizer',
              inputSchema: z.array(z.string()),
              outputSchema: z.string(),
            },
            async summaries => {
              const llmResponse = await ai.generate({
                model: 'gemini-1.5-flash-latest',
                prompt: `You are an expert data analyst AI. A large document was split into several chunks, and each chunk was summarized. Your task is to synthesize these summaries into a single, final, and coherent analysis that directly answers the user's original prompt.

User's Original Prompt: "${prompt}"

Here are the summaries of the document chunks in order:
---
${summaries.join('\n\n---\n\n')}
---

Based on these summaries, provide a clear, well-structured, and final analysis in Markdown format that answers the user's prompt. Do not mention the chunking or summarization process in your final output.`,
              });
              return llmResponse.text();
            }
          );

          const finalAnalysis = await finalSynthesizer(summaries);
          return {analysis: finalAnalysis};
        }
      }
    }
  );

  try {
    return await analysisFlow(input);
  } catch (error: any) {
    console.error('Error in document analysis flow:', error);
    let errorMessage = `An unexpected error occurred while analyzing the document. It might be corrupted or in an unsupported format.\n\nDetails: ${error.message}`;
    if (error.message?.includes('429')) {
      errorMessage = `The document analysis process is being rate-limited by the AI provider. Please wait a moment and try again.\n\nDetails: ${error.message}`;
    }
    if (error.message?.includes('Invalid data URI')) {
      errorMessage =
        'The uploaded file could not be read. It might be corrupted or in a format the system cannot process.';
    }
    if (error.message?.includes('context length')) {
      errorMessage = `The document is too large to be analyzed, even after attempting to split it into smaller parts. Please try with a smaller document. \n\nDetails: ${error.message}`;
    }
    return {
      analysis: `#### Error\n${errorMessage}`,
    };
  }
}
