
'use server';

/**
 * @fileOverview Generates an executive summary from a given JSON object of report data.
 */
import openai from '@/ai/client';

export interface GenerateExecutiveSummaryInput {
  reportData: string;
}

export interface GenerateExecutiveSummaryOutput {
  summary: string;
}

export async function generateExecutiveSummary(
  input: GenerateExecutiveSummaryInput
): Promise<GenerateExecutiveSummaryOutput> {
  const prompt = `You are an AI assistant specialized in creating executive summaries for business intelligence dashboards. Your task is to analyze the provided JSON data and generate a clear, concise, and insightful summary for a management audience.
    Focus on key takeaways, trends, and significant metrics.

    Analyze the following data:
    ${input.reportData}

    Generate a summary that highlights the most important findings. Structure it with a brief overview, followed by 2-3 bullet points on key areas (e.g., ROI, System Reliability, Cost Reduction).
    
    Return a JSON object with the following structure: { "summary": "string" }. The summary should be a concise, well-structured executive summary of the provided data, formatted for a business audience.
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const responseJson = completion.choices[0].message?.content;
    if (!responseJson) {
      throw new Error('AI failed to generate a response.');
    }
    return JSON.parse(responseJson) as GenerateExecutiveSummaryOutput;
  } catch (error) {
    console.error('Error in generateExecutiveSummary:', error);
    throw new Error('Failed to generate executive summary.');
  }
}
