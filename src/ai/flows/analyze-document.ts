
'use server';
/**
 * @fileoverview An AI flow that analyzes a document (CSV, TXT, image).
 */
import {AnalyzeDocumentInput, AnalyzeDocumentOutput} from '@/ai/types';
import {openAiClient} from '@/ai/genkit';

const CHUNK_SIZE = 16000; // Max characters per chunk, safely below token limit

async function summarizeChunk(
  chunk: string,
  prompt: string,
  isFirstChunk: boolean,
  isLastChunk: boolean,
  totalChunks: number
): Promise<string> {
  const systemPrompt = `You are a part of a multi-stage document analysis pipeline. Your task is to process a single chunk of a larger document and extract key information relevant to the user's overall goal.
The user's final prompt is: "${prompt}"

This is chunk ${
    isFirstChunk ? '1' : 'a middle chunk'
  } of ${totalChunks} total chunks.
${
  isFirstChunk
    ? 'Focus on extracting the main topics, headers, and the overall structure.'
    : ''
}
${
  isLastChunk
    ? 'This is the final chunk. Focus on concluding points, summaries, or final data points.'
    : ''
}

Summarize the key points from this specific chunk that are relevant to the user's prompt. Be concise and focus only on the information present in this chunk. Do not provide a final answer, only a summary of this piece.

Here is the document chunk:
\`\`\`
${chunk}
\`\`\`
`;

  const messages = [
    {role: 'system' as const, content: systemPrompt},
  ];
  return openAiClient(messages);
}

async function synthesizeSummaries(
  summaries: string[],
  prompt: string
): Promise<string> {
  const userPrompt = `You are an expert data analyst AI. A large document was split into several chunks, and each chunk was summarized. Your task is to synthesize these summaries into a single, final, and coherent analysis that directly answers the user's original prompt.

User's Original Prompt: "${prompt}"

Here are the summaries of the document chunks in order:
---
${summaries.join('\n\n---\n\n')}
---

Based on these summaries, provide a clear, well-structured, and final analysis in Markdown format that answers the user's prompt. Do not mention the chunking or summarization process in your final output.
`;
  const messages = [
    {role: 'user' as const, content: userPrompt},
  ];
  const rawResponse = await openAiClient(messages);
  return rawResponse;
}

export async function analyzeDocument(
  input: AnalyzeDocumentInput
): Promise<AnalyzeDocumentOutput> {
  try {
    const dataUriMatch = input.documentDataUri.match(/^data:(.+?);base64,(.*)$/);
    if (!dataUriMatch) {
      throw new Error('Invalid data URI');
    }
    const mimeType = dataUriMatch[1];
    const base64Data = dataUriMatch[2];

    let analysis: string;

    if (mimeType.startsWith('image/')) {
      const messages = [
        {
          role: 'user' as const,
          content: [
            {
              type: 'text',
              text: `You are an expert data analyst AI. A user has provided an image and a prompt. Analyze the image to answer the user's prompt. Provide a clear, well-structured analysis in Markdown format.

User Prompt: "${input.prompt}"`,
            },
            {
              type: 'image_url',
              image_url: {url: input.documentDataUri},
            },
          ],
        },
      ];
      analysis = await openAiClient(messages);
    } else {
      const documentContent = Buffer.from(base64Data, 'base64').toString(
        'utf8'
      );

      if (documentContent.length < CHUNK_SIZE) {
        // Document is small enough, process directly
        const userPrompt = `You are an expert data analyst AI. A user has provided a document's text content and a prompt. Analyze the text content to answer the prompt. Provide a clear, well-structured analysis in Markdown format.

User Prompt: "${input.prompt}"

Document Content:
\`\`\`
${documentContent}
\`\`\`
`;
        const messages = [
          {role: 'user' as const, content: userPrompt},
        ];
        analysis = await openAiClient(messages);
      } else {
        // Document is large, use map-reduce sequentially
        const chunks: string[] = [];
        for (let i = 0; i < documentContent.length; i += CHUNK_SIZE) {
          chunks.push(documentContent.substring(i, i + CHUNK_SIZE));
        }

        const summaries: string[] = [];
        for (const [i, chunk] of chunks.entries()) {
          const summary = await summarizeChunk(
            chunk,
            input.prompt,
            i === 0,
            i === chunks.length - 1,
            chunks.length
          );
          summaries.push(summary);
          // Add a small delay to be respectful of free-tier rate limits
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        analysis = await synthesizeSummaries(summaries, input.prompt);
      }
    }

    return {analysis};
  } catch (error: any) {
    console.error('Error in document analysis flow:', error);
    let errorMessage = `An unexpected error occurred while analyzing the document. It might be corrupted or in an unsupported format.\n\nDetails: ${error.message}`;
    if (error.message?.includes('429')) {
      errorMessage = `The document analysis process is being rate-limited by the AI provider. Please wait a moment and try again.\n\nDetails: ${error.message}`;
    }
    if (error.message?.includes('Invalid data URI')) {
      errorMessage = 'The uploaded file could not be read. It might be corrupted or in a format the system cannot process.';
    }
    if (error.message?.includes('context length')) {
      errorMessage = `The document is too large to be analyzed, even after attempting to split it into smaller parts. Please try with a smaller document. \n\nDetails: ${error.message}`;
    }
    return {
      analysis: `#### Error\n${errorMessage}`,
    };
  }
}
