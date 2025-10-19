
'use server';
/**
 * @fileoverview A Genkit flow that analyzes a document (PDF, CSV, TXT, image) based on a user's prompt.
 */
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { AnalyzeDocumentInput, AnalyzeDocumentOutput } from '@/ai/types';
import pdf from 'pdf-parse';
import { parse } from 'csv-parse/sync';

const apiKey = process.env.GEMINI_API_KEY;

function fileToGenerativePart(data: string, mimeType: string) {
  return {
    inlineData: {
      data,
      mimeType,
    },
  };
}

async function extractTextFromPdf(base64Data: string): Promise<string> {
    const pdfBuffer = Buffer.from(base64Data, 'base64');
    const data = await pdf(pdfBuffer);
    return data.text;
}

async function extractTextFromCsv(base64Data: string): Promise<string> {
    const csvBuffer = Buffer.from(base64Data, 'base64');
    const records = parse(csvBuffer, {
        columns: true,
        skip_empty_lines: true,
    });
    return JSON.stringify(records, null, 2);
}

export async function analyzeDocument(input: AnalyzeDocumentInput): Promise<AnalyzeDocumentOutput> {
    if (!apiKey) {
      return { analysis: '#### Error\nAI service is not configured. Missing API key.' };
    }
    const genAI = new GoogleGenAI(apiKey);

    try {
        const dataUriMatch = input.documentDataUri.match(/^data:(.+?);base64,(.*)$/);
        if (!dataUriMatch) {
            return { analysis: '#### Error\nInvalid file format. Could not read the uploaded file.' };
        }

        const [, mimeType, base64Data] = dataUriMatch;
        let documentContent: any;
        let modelName = 'gemini-1.5-flash';
        let promptParts: any[] = [];

        if (mimeType.startsWith('image/')) {
            modelName = 'gemini-1.5-flash'; // Vision model
            promptParts = [
                { text: `You are a professional document analysis AI. Analyze the document image provided based on the user's request.\n\nUser Prompt: "${input.prompt}"` },
                fileToGenerativePart(base64Data, mimeType),
            ];
        } else {
             modelName = 'gemini-1.5-flash';
            let textContent = '';
            if (mimeType === 'application/pdf') {
                try {
                    textContent = await extractTextFromPdf(base64Data);
                } catch (e: any) {
                    console.error("PDF Parsing Error:", e);
                    return { analysis: `#### Error\nFailed to parse PDF document. The file might be corrupted or password-protected.\n\nDetails: ${e.message}` };
                }
            } else if (mimeType === 'text/csv') {
                try {
                    textContent = await extractTextFromCsv(base64Data);
                } catch (e: any) {
                    console.error("CSV Parsing Error:", e);
                    return { analysis: `#### Error\nFailed to parse CSV document. The file might be malformed.\n\nDetails: ${e.message}` };
                }
            } else if (mimeType.startsWith('text/')) {
                textContent = Buffer.from(base64Data, 'base64').toString('utf-8');
            } else {
                return { analysis: `#### Error\nUnsupported file type: \`${mimeType}\`. Please upload a supported document format like PDF, CSV, TXT, or an image (JPG, PNG).` };
            }
            
            promptParts = [
                { text: `You are an expert data analyst AI. A user has uploaded a document with the following content. Your task is to analyze it based on their prompt.
                
First, identify the type of document (e.g., "Invoice", "Service Log", "Financial Report", "Image of a car part").
Then, perform the user's request and provide a clear, well-structured analysis in Markdown format.

---
User Prompt: "${input.prompt}"
---
Document Content:
${textContent}
---

Your analysis:`
                },
            ];
        }

        const model = genAI.getGenerativeModel({ model: modelName });
        
        const result = await model.generateContent({
            contents: [{ role: "user", parts: promptParts }],
            generationConfig: {
                maxOutputTokens: 2048,
            },
        });
        
        const response = result.response;
        const analysisText = response.text();

        return { analysis: analysisText };

    } catch (e: any) {
        console.error('Error analyzing document:', e);
        if (e.message?.includes('unsupported content type') || e.message?.includes('Invalid MIME type')) {
            return {
                analysis: `#### Error\nUnsupported file type. The AI model cannot process this file. Please try a standard image format (JPG, PNG), PDF, CSV, or a plain text file (.txt).`,
            };
        }
        return {
            analysis: `#### Error\nAn unexpected error occurred while analyzing the document. It might be corrupted or in an unsupported format.\n\nDetails: ${e.message}`,
        };
    }
}
