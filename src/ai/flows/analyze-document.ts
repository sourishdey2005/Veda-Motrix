
'use server';

import { GoogleGenAI } from "@google/genai";
import {
  type AnalyzeDocumentInput,
  type AnalyzeDocumentOutput,
} from '@/ai/types';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable not set.");
}
const genAI = new GoogleGenAI(apiKey);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function analyzeDocument(
  input: AnalyzeDocumentInput
): Promise<AnalyzeDocumentOutput> {
  const dataUriParts = input.documentDataUri.match(/^data:(.+?);base64,(.*)$/);
  if (!dataUriParts) {
    return {
      analysis: '#### Error\nInvalid document format. Could not read the uploaded file.',
    };
  }
  
  const mimeType = dataUriParts[1];
  const base64Data = dataUriParts[2];
  
  if (mimeType.startsWith('image/')) {
    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: mimeType,
      },
    };

    const prompt = [
        input.prompt,
        imagePart,
    ];

    try {
        const result = await model.generateContent({ contents: [{ role: 'user', parts: prompt.map(p => typeof p === 'string' ? { text: p } : p) }]});
        const response = result.response;
        return { analysis: response.text() };
    } catch(e: any) {
        console.error("Error analyzing image document:", e);
        if (e.message?.includes('unsupported content type')) {
           return {
                analysis: `#### Error\nUnsupported file type: \`${mimeType}\`. The AI model cannot process this file. Please try a standard image format like JPG or PNG.`,
            };
        }
        return {
          analysis: "#### Error\nAn unexpected error occurred while analyzing the image. It might be corrupted or in an unsupported format.",
        };
    }

  } else if (mimeType.startsWith('text/')) {
     const textContent = Buffer.from(base64Data, 'base64').toString('utf-8');
     const prompt = `You are a professional document analysis AI. Analyze the document provided based on the user's request.

      User Prompt: "${input.prompt}"

      --- Document Content ---
      ${textContent}
      --- End Document ---
      `;

      try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        return { analysis: response.text() };
      } catch (e) {
        console.error("Error analyzing text document:", e);
        return {
          analysis: "#### Error\nAn unexpected error occurred while analyzing the text document.",
        };
      }
  } else {
    return {
      analysis: `#### Error\nUnsupported file type: \`${mimeType}\`. Please upload a supported document format like an image (JPG, PNG) or plain text file (.txt).\n\nPDF analysis is not currently supported.`,
    };
  }
}
