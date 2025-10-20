/**
 * @fileoverview This file initializes the Google Generative AI client.
 * It exports a single `genAI` object that is used throughout the application to
 * interact with the generative AI models.
 */
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set in the environment variables.");
}

export const genAI = new GoogleGenerativeAI(apiKey);
