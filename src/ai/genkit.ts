
import MistralClient from '@mistralai/mistralai';

const token = process.env["GITHUB_TOKEN"];
const endpoint = "https://models.github.ai/inference";

if (!token) {
  throw new Error("GITHUB_TOKEN is not set in the environment variables.");
}

export const aiClient = new MistralClient({apiKey: token, serverURL: endpoint});

export const textModel = "mistral-ai/mistral-small-2503";
export const visionModel = "mistral-ai/mistral-small-2503"; // Using text model for doc summary
