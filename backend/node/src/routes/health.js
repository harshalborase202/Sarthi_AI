'use strict';
/**
 * routes/health.js
 * GET /health — liveness + dependency connectivity check.
 * Reports { status, geminiConnected, chromaConnected }
 */
const { Router } = require('express');
const { isGeminiConnected } = require('../config/gemini');
const { testChromaConnection } = require('../config/chromadb');

const router = Router();

router.get('/health', async (_req, res) => {
  const chromaOk = await testChromaConnection();
  const geminiOk = isGeminiConnected();

  const status = geminiOk && chromaOk ? 'ok' : 'degraded';
  const httpStatus = status === 'ok' ? 200 : 503;

  return res.status(httpStatus).json({
    status,
    geminiConnected: geminiOk,
    chromaConnected: chromaOk,
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
