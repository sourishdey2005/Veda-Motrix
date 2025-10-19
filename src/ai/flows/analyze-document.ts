
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
        type: 'text',
        text: `You are a professional document analysis AI. Analyze the document provided based on the user's request.

            User Prompt: "${input.prompt}"`,
      },
    ];

    const dataUriParts = input.documentDataUri.match(/^data:(.+?);base64,(.*)$/);
    if (!dataUriParts) {
      return {
        analysis: '#### Error\nInvalid document format. Could not read the uploaded file.',
      };
    }
    
    const mimeType = dataUriParts[1];

    if (mimeType.startsWith('image/')) {
      messages.push({
        type: 'image_url',
        image_url: {
          url: input.documentDataUri,
        },
      });
    } else if (mimeType === 'application/pdf') {
        // PDF text extraction is complex and was causing server errors.
        // For now, inform the user it's not supported in this way.
        return {
            analysis: `#### Feature Not Available\nText extraction from PDF files is not currently supported. Please try uploading an image (JPG, PNG) of the document or a plain text (.txt) file instead.`,
        };
    } else if (mimeType.startsWith('text/')) {
        const base64Data = dataUriParts[2];
        const buffer = Buffer.from(base64Data, 'base64');
        const decodedContent = buffer.toString('utf8');
        messages.push({
            type: 'text',
            text: `\n\n--- Document Content ---\n${decodedContent}\n--- End Document ---`,
        });
    } else {
        return {
            analysis: `#### Error\nUnsupported file type: \`${mimeType}\`. Please upload a supported document format like an image (JPG, PNG) or plain text file (.txt).`,
        };
    }

    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-4o',
      messages: [
        {
          role: 'user',
          content: messages,
        },
      ],
    });

    const analysis = completion.choices[0].message?.content;
    if (!analysis) {
      return { analysis: '#### Error\nAI failed to generate a response after processing the document.' };
    }

    return { analysis };
  } catch (error: any) {
    console.error('Error in document analysis flow:', error);
    if (error.message.includes('unsupported content type')) {
      return {
        analysis:
          '#### Error\nUnsupported file type. Please upload a supported document format like JPG, PNG, or plain text.',
      };
    }
    return {
      analysis:
        '#### Error\nAn unexpected error occurred while analyzing the document. It might be corrupted or in an unsupported format.',
    };
  }
}
