'use strict';
/**
 * middleware/validateRequest.js
 * Request body validation middleware factory.
 * Uses Zod schemas to validate req.body and returns 400 with clear errors on failure.
 */
const { z } = require('zod');

/**
 * Creates an express middleware that validates req.body against a Zod schema.
 * On success, attaches the parsed (coerced) body back to req.body.
 * On failure, responds 400 with { error: string, details: string[] }
 */
function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const details = result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
      return res.status(400).json({
        error: 'Request validation failed',
        details,
      });
    }
    req.body = result.data; // Attach coerced/defaults-filled body
    next();
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// Shared schemas — define the exact shapes the frontend sends
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Schema for POST /api/score/recommendation
 * Matches the citizen profile shape used in the frontend (App.jsx, ProfileInput.jsx)
 */
const scoreRecommendationSchema = z.object({
  userId: z.string().min(1, 'userId is required'),
  profile: z.object({
    age: z.union([z.string(), z.number()]).transform(String),
    gender: z.string().min(1),
    state: z.string().min(1),
    occupation: z.string().min(1),
    income: z.union([z.string(), z.number()]).transform(String),
    category: z.string().min(1),
    education: z.string().min(1),
    disability: z.string().optional().default('no'),
  }),
});

/**
 * Schema for POST /api/score/ocr-scan
 * Matches the payload in DocumentUpload.jsx
 */
const ocrScanSchema = z.object({
  image: z.string().min(1, 'base64 image is required'),
  documentType: z.string().min(1, 'documentType is required'),
  mimeType: z.string().optional().default('image/jpeg'),
});

module.exports = { validateBody, scoreRecommendationSchema, ocrScanSchema };
