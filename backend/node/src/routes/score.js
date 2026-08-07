'use strict';
/**
 * routes/score.js
 * Score & recommendation endpoints.
 *
 * POST /api/score/recommendation     — Gemini score + save to ChromaDB
 * POST /api/score/ocr-scan           — OCR via Gemini vision
 * GET  /api/score/history/:userId    — Exact userId records from ChromaDB
 * POST /api/score/similar            — Semantic similarity search in ChromaDB
 */
const { Router } = require('express');
const { scoreRateLimiter, ocrRateLimiter } = require('../middleware/rateLimiter');
const { validateBody, scoreRecommendationSchema, ocrScanSchema } = require('../middleware/validateRequest');
const { getRecommendation, ocrScan } = require('../controllers/scoreController');
const { getScoresByUser, findSimilarProfiles } = require('../services/chromaService');
const { z } = require('zod');

const router = Router();

// POST /api/score/recommendation
router.post(
  '/recommendation',
  scoreRateLimiter,
  validateBody(scoreRecommendationSchema),
  getRecommendation
);

// POST /api/score/ocr-scan
router.post(
  '/ocr-scan',
  ocrRateLimiter,
  validateBody(ocrScanSchema),
  ocrScan
);

// GET /api/score/history/:userId — exact match, sorted by createdAt DESC
router.get('/history/:userId', async (req, res, next) => {
  try {
    const userId = req.params.userId?.trim();
    if (!userId) return res.status(400).json({ error: 'userId param is required' });

    const records = await getScoresByUser(userId);
    return res.status(200).json({ userId, count: records.length, records });
  } catch (err) {
    return next(err);
  }
});

// POST /api/score/similar — semantic similarity search
// Body: { queryText: string, nResults?: number, filterUserId?: string }
const similarSchema = z.object({
  queryText: z.string().min(1, 'queryText is required'),
  nResults: z.number().int().min(1).max(20).optional().default(5),
  filterUserId: z.string().optional(),
});

router.post('/similar', scoreRateLimiter, async (req, res, next) => {
  const parsed = similarSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: 'Validation failed',
      details: parsed.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`),
    });
  }

  const { queryText, nResults, filterUserId } = parsed.data;

  try {
    const results = await findSimilarProfiles(queryText, nResults, filterUserId ?? null);
    return res.status(200).json({ count: results.length, results });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
