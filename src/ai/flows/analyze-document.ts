
'use server';

import openai from '@/ai/client';
import { ChatCompletionContentPart } from 'openai/resources/chat';

export interface AnalyzeDocumentInput {
  documentDataUri: string;
  prompt: string;
}

export interface AnalyzeDocumentOutput {
  analysis: string;
}

export async function analyzeDocument(
  input: AnalyzeDocumentInput
): Promise<AnalyzeDocumentOutput> {
  try {
    const messages: ChatCompletionContentPart[] = [
        {
            type: "text",
            text: `You are a professional document analysis AI. Analyze the document provided based on the user's request.

            If the document seems unreadable or empty, state that you were unable to parse the content. Otherwise, provide a concise, well-structured analysis in Markdown format, using headings, bold text, and bullet points for clarity.

            User Prompt: "${input.prompt}"`
        },
    ];
    
    // Check if it's an image
    if (input.documentDataUri.startsWith('data:image')) {
         messages.push({
            type: "image_url",
            image_url: {
                url: input.documentDataUri,
            },
        });
    } else {
        // For non-image files, we'll try to add it as text context
        try {
            const base64Data = input.documentDataUri.split(',')[1];
            const decodedContent = Buffer.from(base64Data, 'base64').toString('utf8');
            
            // Heuristic to check if content is mostly readable text
            // This is not perfect but can prevent passing large binary gibberish
            const isLikelyText = !/[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(decodedContent.substring(0, 500));

            if (isLikelyText) {
                messages.push({
                    type: "text",
                    text: `\n\nDocument Content:\n---\n${decodedContent}\n---`
                });
            } else {
                 return { analysis: "#### Error\nBinary file format (like PDF) is not supported for text-based analysis. Please upload a plain text file, CSV, or an image." };
            }
        } catch (e) {
            return { analysis: "#### Error\nCould not decode the file content. It might be a binary format that is not supported for text analysis. Please upload a plain text file, CSV, or an image." };
        }
    }


    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-4o',
      messages: [
        {
          role: 'user',
          content: messages
        }
      ]
    });

    const analysis = completion.choices[0].message?.content;
    if (!analysis) {
      return { analysis: '#### Error\nAI failed to generate a response.' };
    }

    return { analysis };
  } catch (error: any) {
    console.error('Error in document analysis flow:', error);
    if (error.message.includes('unsupported content type')) {
      return {
        analysis:
          '#### Error\nUnsupported file type. Please upload a supported document format like PDF, JPG, PNG, or plain text.',
      };
    }
    return {
      analysis:
        '#### Error\nAn unexpected error occurred while analyzing the document. It might be corrupted or in an unsupported format.',
    };
  }
}
