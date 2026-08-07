import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { GoogleGenAI } from '@google/genai';

function ocrServerPlugin() {
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
            const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

            if (!apiKey) {
              // Return structured fallback response if API key is not configured in env
              const fallbackDocType = data.documentType || 'Aadhaar Card';
              const mockResult = {
                success: true,
                extractedData: {
                  docType: fallbackDocType,
                  fullName: "Abhishek Sharma",
                  identifierNumber: "XXXX-XXXX-4829",
                  issueDate: "2022-05-14",
                  address: "Mumbai, Maharashtra, India",
                  authority: "Unique Identification Authority of India (UIDAI)",
                  confidenceScore: 0.96,
                  isMocked: true,
                  notice: "Server running in fallback mode. Add GEMINI_API_KEY to environment for live Gemini OCR."
                }
              };
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify(mockResult));
            }

            // Call Gemini API server-side using GoogleGenAI SDK
            const ai = new GoogleGenAI({ apiKey });
            const prompt = `You are a specialized OCR parser for Indian Government Documents (Aadhaar, Income Certificate, Domicile, Marksheets, Ration Cards, etc.). 
Extract structured fields as a valid JSON object only with these exact keys:
- docType (string e.g. "Aadhaar Card", "Income Certificate", "Domicile Certificate", "12th Marksheet")
- fullName (string)
- identifierNumber (string e.g. Aadhaar number, Certificate no, Roll no)
- issueDate (string e.g. YYYY-MM-DD or DD/MM/YYYY)
- address (string or null)
- authority (string e.g. "UIDAI", "Tehsildar Office", "State Board")
- confidenceScore (number between 0.8 and 0.99)

Return strictly raw JSON without markdown codeblocks or extra commentary.`;

            const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: [
                {
                  role: 'user',
                  parts: [
                    { text: prompt },
                    {
                      inlineData: {
                        mimeType: mimeType,
                        data: base64Data
                      }
                    }
                  ]
                }
              ]
            });

            const textOutput = response.text ? response.text.trim().replace(/^```json\s*/, '').replace(/\s*```$/, '') : '{}';
            const parsedData = JSON.parse(textOutput);

            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({
              success: true,
              extractedData: {
                ...parsedData,
                isMocked: false
              }
            }));

          } catch (err) {
            console.error("OCR API error:", err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({
              success: false,
              error: err.message || "Failed to process OCR document"
            }));
          }
        });
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), ocrServerPlugin()],
  server: {
    port: 3000,
    open: true
  }
});
