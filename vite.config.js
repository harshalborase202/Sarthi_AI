import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

function getApiKey(mode) {
  const env = loadEnv(mode, process.cwd(), '');
  if (env.GEMINI_API_KEY) return env.GEMINI_API_KEY;
  if (env.VITE_GEMINI_API_KEY) return env.VITE_GEMINI_API_KEY;
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;

  // Fallback: parse root .env directly
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      const match = content.match(/GEMINI_API_KEY=(.+)/);
      if (match && match[1].trim()) return match[1].trim();
    }
  } catch (err) {
    console.error('[OCR Plugin] Error reading .env file:', err);
  }
  return null;
}

function ocrServerPlugin(envMode) {
  return {
    name: 'ocr-server-plugin',
    configureServer(server) {
      server.middlewares.use('/api/ocr-scan', async (req, res, next) => {
        if (req.method !== 'POST') {
          return next();
        }

        let body = '';
        req.on('data', (chunk) => {
          body += chunk.toString();
        });

        req.on('end', async () => {
          try {
            const data = JSON.parse(body);
            const base64Data = data.image ? data.image.replace(/^data:image\/\w+;base64,/, '') : '';
            const mimeType = data.mimeType || 'image/jpeg';
            const apiKey = getApiKey(envMode);

            if (!apiKey) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({
                success: false,
                error: 'GEMINI_API_KEY is not configured. Add it to your .env file at project root.'
              }));
            }

            // Call Gemini API server-side using GoogleGenAI SDK
            const ai = new GoogleGenAI({ apiKey });
            const prompt = `Extract document data from this ${data.documentType || 'government document'}. 
Return ONLY valid JSON matching this schema:
{
  "docType": "Document Name",
  "fullName": "Full Name",
  "identifierNumber": "ID Number or Masked ID",
  "issueDate": "YYYY-MM-DD or null",
  "address": "Address or null",
  "authority": "Issuing Authority",
  "confidenceScore": 0.95
}`;

            const modelName = process.env.GEMINI_MODEL_NAME || 'gemini-flash-latest';
            const response = await ai.models.generateContent({
              model: modelName,
              contents: [
                {
                  inlineData: {
                    mimeType,
                    data: base64Data,
                  },
                },
                prompt,
              ],
            });

            const text = response.text || '';
            const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const extractedData = JSON.parse(cleanedText);

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, extractedData }));
          } catch (err) {
            console.error('OCR Processing Error:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: err.message }));
          }
        });
      });
    },
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), ocrServerPlugin(mode)],
  server: {
    port: 5173,
    open: true,
  },
}));
