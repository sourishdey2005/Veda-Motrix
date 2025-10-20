import ModelClient from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

const endpoint = "https://models.github.ai/inference";
const token = process.env.GITHUB_TOKEN;

if (!token) {
  throw new Error("GITHUB_TOKEN is not set in the environment variables.");
}

export const aiClient = ModelClient(
  endpoint,
  new AzureKeyCredential(token)
);

export const textModel = "openai/gpt-4o-mini";
export const visionModel = "openai/gpt-4o";
