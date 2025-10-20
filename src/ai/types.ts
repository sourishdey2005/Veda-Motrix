
import {z} from 'zod';

// analyze-document
export const AnalyzeDocumentInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "The document to analyze, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeDocumentInput = z.infer<typeof AnalyzeDocumentInputSchema>;

export const AnalyzeDocumentOutputSchema = z.object({
  analysis: z
    .string()
    .describe('A concise summary of the provided document.'),
});
export type AnalyzeDocumentOutput = z.infer<typeof AnalyzeDocumentOutputSchema>;

// analyze-customer-feedback
export const AnalyzeCustomerFeedbackInputSchema = z.object({
  feedbackText: z.string(),
});
export type AnalyzeCustomerFeedbackInput = z.infer<
  typeof AnalyzeCustomerFeedbackInputSchema
>;

export const AnalyzeCustomerFeedbackOutputSchema = z.object({
  sentiment: z
    .string()
    .describe(
      'The sentiment of the customer feedback (e.g., positive, negative, neutral). Also include degree of sentiment (very positive, slightly negative, etc.).'
    ),
  keyAreas: z
    .string()
    .describe(
      'Key areas or topics mentioned in the feedback (e.g., service quality, staff friendliness, waiting time). Separate multiple areas with commas.'
    ),
  suggestions: z
    .string()
    .describe('Suggestions for improvement based on the customer feedback.'),
}).describe('Schema for the output of the customer feedback analysis AI agent.');
export type AnalyzeCustomerFeedbackOutput = z.infer<
  typeof AnalyzeCustomerFeedbackOutputSchema
>;

// analyze-vehicle-data
export const AnalyzeVehicleDataInputSchema = z.object({
  vehicleId: z.string(),
  sensorDataJson: z.string(),
  maintenanceLogs: z.string(),
});
export type AnalyzeVehicleDataInput = z.infer<
  typeof AnalyzeVehicleDataInputSchema
>;

export const AnalyzeVehicleDataOutputSchema = z.object({
  anomalies: z.array(z.string()),
  maintenanceNeeds: z.array(z.string()),
}).describe('Schema for the output of the vehicle data analysis AI agent.');
export type AnalyzeVehicleDataOutput = z.infer<
  typeof AnalyzeVehicleDataOutputSchema
>;

// detect-agent-anomalies
export const DetectAgentAnomaliesInputSchema = z.object({
  agentId: z.string(),
  agentActions: z.array(z.string()),
  anomalyThreshold: z.number(),
});
export type DetectAgentAnomaliesInput = z.infer<
  typeof DetectAgentAnomaliesInputSchema
>;

export const DetectAgentAnomaliesOutputSchema = z.object({
  isAnomalous: z.boolean(),
  anomalyScore: z.number(),
  explanation: z.string(),
}).describe('Schema for the output of the agent anomaly detection AI agent.');
export type DetectAgentAnomaliesOutput = z.infer<
  typeof DetectAgentAnomaliesOutputSchema
>;

// generate-executive-summary
export const GenerateExecutiveSummaryInputSchema = z.object({
  reportData: z.string(),
});
export type GenerateExecutiveSummaryInput = z.infer<
  typeof GenerateExecutiveSummaryInputSchema
>;

export const GenerateExecutiveSummaryOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A concise, well-structured executive summary of the provided data, formatted for a business audience.'
    ),
});
export type GenerateExecutiveSummaryOutput = z.infer<
  typeof GenerateExecutiveSummaryOutputSchema
>;

// generate-manufacturing-insights
export const GenerateManufacturingInsightsInputSchema = z.object({
  serviceData: z.string(),
});
export type GenerateManufacturingInsightsInput = z.infer<
  typeof GenerateManufacturingInsightsInputSchema
>;

export const GenerateManufacturingInsightsOutputSchema = z.object({
  improvementSuggestions: z.string(),
});
export type GenerateManufacturingInsightsOutput = z.infer<
  typeof GenerateManufacturingInsightsOutputSchema
>;

// handle-customer-enquiry
export const HandleCustomerEnquiryInputSchema = z.object({
  vehicleIssue: z.string(),
  recommendedMaintenance: z.string(),
  userName: z.string(),
});
export type HandleCustomerEnquiryInput = z.infer<
  typeof HandleCustomerEnquiryInputSchema
>;

export const HandleCustomerEnquiryOutputSchema = z.object({
  conversationSummary: z.string(),
});
export type HandleCustomerEnquiryOutput = z.infer<
  typeof HandleCustomerEnquiryOutputSchema
>;

// predict-vehicle-failures
export const PredictVehicleFailureInputSchema = z.object({
  vehicleId: z.string(),
  sensorDataJson: z.string(),
  maintenanceLogs: z.string(),
});
export type PredictVehicleFailureInput = z.infer<
  typeof PredictVehicleFailureInputSchema
>;

export const PredictedFailureSchema = z.object({
  component: z.string(),
  failureType: z.string(),
  priority: z.enum(['HIGH', 'MEDIUM', 'LOW']),
  confidence: z.number().min(0).max(1),
  suggestedActions: z.string(),
});
export type PredictedFailure = z.infer<typeof PredictedFailureSchema>;

export const PredictVehicleFailureOutputSchema = z.object({
  predictedFailures: z.array(PredictedFailureSchema),
}).describe('Schema for the output of the vehicle failure prediction AI agent.');
export type PredictVehicleFailureOutput = z.infer<
  typeof PredictVehicleFailureOutputSchema
>;

// vehicle-qna
const MessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'model']),
  content: z.string(),
});
export type Message = z.infer<typeof MessageSchema>;

export const AnswerQuestionInputSchema = z.object({
  question: z.string(),
  conversationHistory: z.array(MessageSchema),
});
export type AnswerQuestionInput = z.infer<typeof AnswerQuestionInputSchema>;

export const AnswerQuestionOutputSchema = z.object({
  answer: z.string(),
});
export type AnswerQuestionOutput = z.infer<typeof AnswerQuestionOutputSchema>;
