
import OpenAI from "openai";

const token = process.env["GITHUB_TOKEN"];
const endpoint = "https://models.github.ai/inference";

if (!token) {
  throw new Error("GITHUB_TOKEN is not set in the environment variables.");
}

export const aiClient = new OpenAI({ baseURL: endpoint, apiKey: token });

export const textModel = "openai/gpt-4o-mini";
export const visionModel = "openai/gpt-4o";
