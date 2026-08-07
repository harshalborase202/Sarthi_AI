'use strict';
/**
 * controllers/scoreController.js
 * Handles POST /api/score/recommendation and POST /api/score/ocr-scan.
 * All errors are passed to next(err) — no unhandled rejections, no process crashes.
 */
const { generateScoreAndRecommendation, ocrScanDocument } = require('../services/geminiService');
const { saveScoreRecommendation } = require('../services/chromaService');
const logger = require('../utils/logger');

/**
 * POST /api/score/recommendation
 * Body (validated): { userId: string, profile: { age, gender, state, occupation, income, category, education, disability } }
 */
async function getRecommendation(req, res, next) {
  const { userId, profile } = req.body;

  logger.info({ userId, state: profile.state }, '[ScoreController] Generating recommendation');

  try {
    // 1. Call Gemini to generate score + recommendation
    const { score, recommendation, rawGeminiResponse } = await generateScoreAndRecommendation(profile);

    // 2. Save to ChromaDB with Gemini embedding
    const saved = await saveScoreRecommendation({
      userId,
      input: profile,
      score,
      recommendation,
      rawGeminiResponse,
      status: 'success',
    });

    logger.info({ userId, score, id: saved.id }, '[ScoreController] Recommendation saved to ChromaDB');

    return res.status(201).json({
      id: saved.id,
      userId: saved.userId,
      score: saved.score,
      recommendation: saved.recommendation,
      createdAt: saved.createdAt,
      status: saved.status,
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * POST /api/score/ocr-scan
 * Body: { image: string (base64), documentType: string, mimeType?: string }
 */
async function ocrScan(req, res, next) {
  const { image, documentType, mimeType } = req.body;
  logger.info({ documentType }, '[ScoreController] Starting OCR scan');

  try {
    const extractedData = await ocrScanDocument(image, mimeType, documentType);
    return res.status(200).json({ success: true, extractedData });
  } catch (err) {
    return next(err);
  }
}

module.exports = { getRecommendation, ocrScan };
