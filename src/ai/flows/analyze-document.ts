
'use server';
/**
 * @fileoverview An AI flow that analyzes a document (CSV, TXT, image).
 */
import type {
  AnalyzeDocumentInput,
  AnalyzeDocumentOutput,
} from '@/ai/types';
import { openAiClient } from '@/ai/genkit';
import type { OpenAI } from 'openai';

const CHUNK_SIZE = 8000;

export async function analyzeDocument(
  input: AnalyzeDocumentInput
): Promise<AnalyzeDocumentOutput> {
  try {
    const { documentDataUri, prompt } = input;
    const dataUriMatch = documentDataUri.match(/^data:(.+?);base64,(.*)$/);
    if (!dataUriMatch) {
      throw new Error('Invalid data URI');
    }
    const mimeType = dataUriMatch[1];

    if (mimeType.startsWith('image/')) {
      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `You are an expert data analyst AI. A user has provided an image and a prompt. Analyze the image to answer the user's prompt. Provide a clear, well-structured analysis in Markdown format.

User Prompt: "${prompt}"`,
            },
            {
              type: 'image_url',
              image_url: {
                url: documentDataUri,
              },
            },
          ],
        },
      ];
      
      const analysis = await openAiClient({
        prompt: messages,
        model: 'nvidia/neva-22b', // Vision-capable model
      });

      return { analysis: analysis as string };
    } else {
      const documentContent = Buffer.from(dataUriMatch[2], 'base64').toString('utf8');

      if (documentContent.length < CHUNK_SIZE * 1.5) {
        // Document is small enough, process directly
        const analysis = await openAiClient({
          prompt: `You are an expert data analyst AI. A user has provided a document's text content and a prompt. Analyze the text content to answer the prompt. Provide a clear, well-structured analysis in Markdown format.

User Prompt: "${prompt}"

Document Content:
\`\`\`
${documentContent}
\`\`\`
`,
        });
        return { analysis: analysis as string };
      } else {
        // Document is large, use map-reduce sequentially
        const chunks: string[] = [];
        for (let i = 0; i < documentContent.length; i += CHUNK_SIZE) {
          chunks.push(documentContent.substring(i, i + CHUNK_SIZE));
        }

        const summaries: string[] = [];
        for (const chunk of chunks) {
          // Await each summary sequentially to avoid rate limiting
          const summary = await openAiClient({
            prompt: `Summarize the key points from this specific document chunk that are relevant to the user's overall prompt: "${prompt}". Be concise and focus only on the information present in this chunk. Do not provide a final answer, only a summary of this piece.

Here is the document chunk:
\`\`\`
${chunk}
\`\`\`
`,
          });
          if (typeof summary === 'string') {
            summaries.push(summary);
          }
          await new Promise(resolve => setTimeout(resolve, 500)); // Add a small delay
        }

        const finalAnalysis = await openAiClient({
          prompt: `You are an expert data analyst AI. A large document was split into several chunks, and each chunk was summarized. Your task is to synthesize these summaries into a single, final, and coherent analysis that directly answers the user's original prompt.

User's Original Prompt: "${prompt}"

Here are the summaries of the document chunks in order:
---
${summaries.join('\n\n---\n\n')}
---

Based on these summaries, provide a clear, well-structured, and final analysis in Markdown format that answers the user's prompt. Do not mention the chunking or summarization process in your final output.`,
        });

        return { analysis: finalAnalysis as string };
      }
    }
  } catch (error: unknown) {
    console.error('Error in document analysis flow:', error);
    let errorMessage = 'An unexpected error occurred while analyzing the document. Please try again.';

    if (error instanceof Error) {
        errorMessage = `An unexpected error occurred: ${error.message}`;
        if (error.message?.includes('429')) {
          errorMessage = `The document analysis process is being rate-limited by the AI provider. Please wait a moment and try again. Details: ${error.message}`;
        }
        if (error.message?.includes('Invalid data URI')) {
          errorMessage = 'The uploaded file could not be read. It might be corrupted or in a format the system cannot process.';
        }
    } else if (typeof error === 'string') {
        errorMessage = error;
    }

    return {
      analysis: `#### Error\n${errorMessage}`,
    };
  }
}
