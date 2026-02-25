import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { VertexAI } from '@google-cloud/vertexai';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Dual-mode initialization: Try Gemini API Key first, fallback to Vertex AI
const apiKey = process.env.GEMINI_API_KEY;
const projectId = process.env.GCP_PROJECT_ID;
const location = 'us-central1';
const keyFilePath = path.join(__dirname, '../google_cloud_credentials.json');

let genAI;
let vertexAI;
let useVertexAI = false;

// Try Gemini API Key first (simpler, more portable)
if (apiKey) {
  console.log(`✅ Gemini AI initializing with API Key`);
  genAI = new GoogleGenerativeAI(apiKey);
  useVertexAI = false;
}
// Fallback to Vertex AI with service account
else if (projectId) {
  console.log(`✅ Vertex AI initializing with project: ${projectId}`);
  try {
    vertexAI = new VertexAI({ project: projectId, location: location, keyFilename: keyFilePath });
    useVertexAI = true;
  } catch (e) {
    console.warn('⚠️ Vertex AI with keyfile failed, trying system auth...');
    try {
      vertexAI = new VertexAI({ project: projectId, location: location });
      useVertexAI = true;
    } catch (e2) {
      console.error('❌ Vertex AI initialization failed:', e2.message);
    }
  }
} else {
  console.error("❌ Error: Neither GEMINI_API_KEY nor GCP_PROJECT_ID found in environment variables.");
}

// Model name - gemini-2.0-flash-001 is available in us-central1
export const modelName = "gemini-2.0-flash-001";

const systemInstructionText = `You are AI-AUTO , the internal intelligent sales and operations assistant developed for the AI-AUTO Builder Platform.

AI-AUTO is a builder-focused Sales & Operations Operating System designed to manage:
- Leads (Hot / Warm / Cold)
- Site Visits
- Project Inventory
- Sales Team Activities
- Notifications & Alerts

Your Purpose:
You assist builders, project managers, and sales teams in managing sales operations efficiently.

Core Capabilities:
- Analyze lead data and provide insights
- Suggest follow-up actions
- Identify high-priority leads
- Highlight inactive or risky leads
- Provide inventory awareness
- Summarize project performance
- Generate operational recommendations
- Draft professional internal messages

Response Guidelines:
- Keep answers concise and structured
- Focus on builder-side insights only
- Use simple, professional language
- Provide clear recommendations
- Avoid unnecessary technical explanations

Output Structure (when analyzing data):
1. Summary
2. Key Alerts
3. Recommended Actions
4. Risk Indicators
5. Optimization Suggestions

Restrictions:
- Do not discuss buyers directly unless required
- Do not provide unrelated information
- Do not claim emotions or personal experiences
- Do not provide harmful or illegal guidance
- If information is incomplete, request clarification

Tone:
- Professional
- Business-oriented
- Clear and actionable
- Supportive but not casual

Primary Objective:
Help builders improve lead conversion, site visit efficiency, and inventory movement through intelligent operational guidance.`;

// Create generative model based on available initialization
export const generativeModel = useVertexAI
  ? vertexAI.preview.getGenerativeModel({
    model: modelName,
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
    ],
    generationConfig: { maxOutputTokens: 4096 },
    systemInstruction: systemInstructionText,
  })
  : genAI.getGenerativeModel({
    model: modelName,
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
    ],
    generationConfig: { maxOutputTokens: 4096 },
    systemInstruction: systemInstructionText,
  });

// Export genAI instance for multi-model support in chatRoutes
export const genAIInstance = useVertexAI
  ? {
    getGenerativeModel: (options) => vertexAI.preview.getGenerativeModel(options)
  }
  : genAI;

// Export vertexAI for compatibility (mock if using Gemini API)
export { vertexAI };