'use strict';
/**
 * services/geminiService.js
 * ALL Gemini API calls live here — nowhere else.
 *
 * Features:
 *  - 15s timeout on every call (AbortController)
 *  - Retry with exponential backoff (max 2 retries) for 429/503 only
 *  - Distinct error messages for 401, 429, malformed response
 *  - Defensive JSON extraction (strips ```json fences before parse)
 */
'use strict';

const { getGenAI } = require('../config/gemini');
const logger = require('../utils/logger');

const TIMEOUT_MS = 15_000;
const MAX_RETRIES = 2;

// Gemini errors we should retry on (transient)
const RETRYABLE_STATUS_CODES = new Set([429, 503]);

/**
 * Strips markdown code fences from a Gemini response string.
 * Gemini sometimes wraps JSON in ```json ... ``` or ``` ... ```
 */
function stripMarkdownFences(text) {
  return text
    .replace(/^```(?:json)?\s*/im, '')
    .replace(/\s*```\s*$/im, '')
    .trim();
}

/**
 * Maps Gemini error to a human-readable message and HTTP status code.
 */
function classifyGeminiError(err) {
  const msg = err?.message ?? String(err);
  const status = err?.status ?? err?.httpStatus ?? null;

  if (status === 401 || msg.includes('API_KEY_INVALID') || msg.includes('API key not valid')) {
    return { httpStatus: 401, error: 'Invalid or expired Gemini API key. Contact the system administrator.' };
  }
  if (status === 429 || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('quota')) {
    return { httpStatus: 429, error: 'Gemini API rate limit exceeded. Please try again in a few seconds.' };
  }
  if (status === 503) {
    return { httpStatus: 503, error: 'Gemini AI service is temporarily unavailable. Please retry shortly.' };
  }
  if (msg.includes('timeout') || msg.includes('aborted')) {
    return { httpStatus: 504, error: 'Gemini AI request timed out (>15s). Please try again.' };
  }
  return { httpStatus: 502, error: `Gemini AI error: ${msg}` };
}

/**
 * Creates an AbortSignal that times out after TIMEOUT_MS.
 */
function makeTimeoutSignal() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  // Clean up timer if request completes before timeout
  return { signal: controller.signal, clearTimer: () => clearTimeout(timer) };
}

/**
 * Core internal: generates content from Gemini with retry + timeout.
 * @param {string} prompt - The prompt to send
 * @param {object} options - { model, maxOutputTokens }
 * @returns {string} - Raw Gemini response text
 * @throws {object} - { httpStatus, error } on failure
 */
async function generateWithRetry(prompt, options = {}) {
  const modelName = options.model ?? process.env.GEMINI_MODEL_NAME ?? 'gemini-flash-latest';
  const maxOutputTokens = options.maxOutputTokens ?? 1024;
  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({ model: modelName });

  let lastError = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const { signal, clearTimer } = makeTimeoutSignal();

    try {
      const result = await model.generateContent(
        {
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens },
        },
        { signal }
      );

      clearTimer();
      const text = result.response?.text?.() ?? '';
      if (!text) {
        throw Object.assign(new Error('Gemini returned an empty response'), { httpStatus: 502 });
      }
      return text;
    } catch (err) {
      clearTimer();
      lastError = err;

      const classified = classifyGeminiError(err);
      const isRetryable = RETRYABLE_STATUS_CODES.has(classified.httpStatus);

      if (!isRetryable || attempt >= MAX_RETRIES) {
        // Not retryable, or exhausted retries — throw classified error
        logger.error(
          { attempt, httpStatus: classified.httpStatus, err: err.message },
          '[GeminiService] Non-retryable Gemini error'
        );
        throw classified;
      }

      // Exponential backoff before retry: 1s, 2s
      const backoffMs = 1000 * Math.pow(2, attempt);
      logger.warn(
        { attempt, backoffMs, httpStatus: classified.httpStatus },
        '[GeminiService] Transient Gemini error — retrying'
      );
      await new Promise((resolve) => setTimeout(resolve, backoffMs));
    }
  }

  // Should never reach here, but guard
  throw classifyGeminiError(lastError);
}

/**
 * Generates a score (0-100) + recommendation string from a citizen profile.
 * Returns { score: number, recommendation: string, rawGeminiResponse: string }
 * @throws {object} { httpStatus, error } on failure
 */
async function generateScoreAndRecommendation(profileInput) {
  const prompt = `You are Sarthi AI, an expert in Indian government welfare schemes.

Analyze the following citizen profile and return ONLY a JSON object (no explanation, no markdown fences):
{
  "score": <integer 0-100 representing overall eligibility strength>,
  "recommendation": "<1-3 sentence actionable recommendation for this citizen>"
}

Citizen Profile:
${JSON.stringify(profileInput, null, 2)}

Requirements:
- score must be an integer between 0 and 100
- recommendation must be practical, specific, and mention 1-2 relevant government scheme categories
- Response must be ONLY valid JSON, nothing else`;

  const rawText = await generateWithRetry(prompt, { maxOutputTokens: 512 });

  // Defensively strip markdown fences before parsing
  const cleanText = stripMarkdownFences(rawText);

  let parsed;
  try {
    parsed = JSON.parse(cleanText);
  } catch (parseErr) {
    logger.error(
      { rawText: rawText.slice(0, 500), parseErr: parseErr.message },
      '[GeminiService] Failed to parse Gemini JSON response'
    );
    throw {
      httpStatus: 502,
      error:
        'Gemini returned a malformed response. Please retry. If this persists, check the model output format.',
    };
  }

  // Validate parsed shape
  const score = Number(parsed.score);
  const recommendation = String(parsed.recommendation ?? '');

  if (isNaN(score) || score < 0 || score > 100) {
    throw {
      httpStatus: 502,
      error: 'Gemini response contained an invalid score value. Please retry.',
    };
  }
  if (!recommendation) {
    throw {
      httpStatus: 502,
      error: 'Gemini response was missing the recommendation field. Please retry.',
    };
  }

  return { score: Math.round(score), recommendation, rawGeminiResponse: rawText };
}

/**
 * Runs a lightweight Gemini call (for OCR document scanning).
 * Accepts a base64 image and document type, returns extracted text fields.
 */
async function ocrScanDocument(base64Image, mimeType, documentType) {
  const genAI = getGenAI();
  const modelName = process.env.GEMINI_MODEL_NAME || 'gemini-flash-latest';
  const model = genAI.getGenerativeModel({ model: modelName });

  const { signal, clearTimer } = makeTimeoutSignal();

  try {
    const result = await model.generateContent(
      {
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType: mimeType || 'image/jpeg',
                  data: base64Image.replace(/^data:[^;]+;base64,/, ''),
                },
              },
              {
                text: `Extract text fields from this ${documentType} document. Return ONLY a JSON object with keys: fullName, identifierNumber, issueDate, expiryDate (null if not present), docType. No markdown, no explanation.`,
              },
            ],
          },
        ],
        generationConfig: { maxOutputTokens: 512 },
      },
      { signal }
    );

    clearTimer();
    const rawText = result.response?.text?.() ?? '';
    const cleanText = stripMarkdownFences(rawText);

    let extracted;
    try {
      extracted = JSON.parse(cleanText);
    } catch {
      throw { httpStatus: 502, error: 'OCR extraction returned malformed JSON. Please retry.' };
    }

    return extracted;
  } catch (err) {
    clearTimer();
    if (err.httpStatus) throw err; // already classified
    throw classifyGeminiError(err);
  }
}

/**
 * Analyzes an advertisement / pamphlet image using Gemini Vision AI.
 * Extracts text, identifies potential government scheme name, and flags scam indicators.
 * @param {Buffer} imageBuffer - Raw image buffer
 * @param {string} mimeType - e.g. 'image/jpeg'
 * @returns {Promise<object>} Parsed structured JSON result
 */
async function analyzeYojanaAd(imageBuffer, mimeType) {
  const genAI = getGenAI();
  const modelName = process.env.GEMINI_MODEL_NAME || 'gemini-flash-latest';
  const model = genAI.getGenerativeModel({ model: modelName });

  const { signal, clearTimer } = makeTimeoutSignal();

  const prompt = `You are a government welfare & consumer protection expert analyzing an advertisement image or pamphlet.

Your task:
1. Extract ALL visible text from the image (scheme name, amounts, URLs, phone numbers, contact info).
2. Identify the most likely real Indian government scheme (Yojana) referenced in this ad (e.g. PM-KISAN, PM Surya Ghar, PM Vishwakarma, Ladki Bahin, Ayushman Bharat, PM SVANidhi, PM Vidyalaxmi, etc.). If the image is completely unrelated to government schemes or not an ad, set suggestedSchemeName to null.
3. Flag common scam / fraudulent indicators if present in the image:
   - Requests for upfront registration/processing fee or money transfer
   - Fake urgency / limited-time claims ("Apply in next 24 hours or lose grant")
   - Non-government website domains (.xyz, .online, .top, bit.ly, free blogspot, etc. instead of .gov.in or .nic.in)
   - WhatsApp-only or personal mobile number contact
   - 100% guaranteed approval claims
   - Spelling variations or distorted logos of official schemes

Return ONLY a JSON object (no markdown, no prose, no code fences):
{
  "extractedText": "<full text read from the image>",
  "suggestedSchemeName": "<likely real Indian scheme name or null if unrelated>",
  "redFlags": [
    "<string description of red flag 1 if any>"
  ],
  "confidenceReasoning": "<1-2 sentence explanation of why this ad seems genuine or suspicious>"
}`;

  try {
    const base64Data = imageBuffer.toString('base64');
    const result = await model.generateContent(
      {
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType: mimeType || 'image/jpeg',
                  data: base64Data,
                },
              },
              { text: prompt },
            ],
          },
        ],
        generationConfig: { maxOutputTokens: 1024 },
      },
      { signal }
    );

    clearTimer();
    const rawText = result.response?.text?.() ?? '';
    const cleanText = stripMarkdownFences(rawText);

    let parsed;
    try {
      parsed = JSON.parse(cleanText);
    } catch {
      throw { httpStatus: 502, error: 'Gemini Vision returned malformed JSON response. Please retry.' };
    }

    return {
      extractedText: String(parsed.extractedText || ''),
      suggestedSchemeName: parsed.suggestedSchemeName ? String(parsed.suggestedSchemeName) : null,
      redFlags: Array.isArray(parsed.redFlags) ? parsed.redFlags.map(String) : [],
      confidenceReasoning: String(parsed.confidenceReasoning || ''),
    };
  } catch (err) {
    clearTimer();
    if (err.httpStatus) throw err;
    throw classifyGeminiError(err);
  }
}

module.exports = { generateScoreAndRecommendation, ocrScanDocument, analyzeYojanaAd };

