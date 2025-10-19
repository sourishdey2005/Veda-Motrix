
'use server';

import openai from '@/ai/client';
import { ChatCompletionContentPart } from 'openai/resources/chat';
import pdf from 'pdf-parse';

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
    const base64Data = dataUriParts[2];
    const buffer = Buffer.from(base64Data, 'base64');


    if (mimeType.startsWith('image/')) {
      messages.push({
        type: 'image_url',
        image_url: {
          url: input.documentDataUri,
        },
      });
    } else if (mimeType === 'application/pdf') {
        try {
            const pdfData = await pdf(buffer);
            messages.push({
                type: 'text',
                text: `\n\n--- Document Content (from PDF) ---\n${pdfData.text}\n--- End Document ---`,
            });
        } catch (pdfError) {
             console.error('Error parsing PDF:', pdfError);
             return {
                analysis: '#### Error\nFailed to parse the PDF document. It might be corrupted or password-protected.',
             };
        }
    } else if (mimeType.startsWith('text/')) {
        const decodedContent = buffer.toString('utf8');
        messages.push({
            type: 'text',
            text: `\n\n--- Document Content ---\n${decodedContent}\n--- End Document ---`,
        });
    } else {
        return {
            analysis: `#### Error\nUnsupported file type: \`${mimeType}\`. Please upload a supported document format like PDF, JPG, PNG, or plain text.`,
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
          '#### Error\nUnsupported file type. Please upload a supported document format like PDF, JPG, PNG, or plain text.',
      };
    }
    return {
      analysis:
        '#### Error\nAn unexpected error occurred while analyzing the document. It might be corrupted or in an unsupported format.',
    };
  }
}
