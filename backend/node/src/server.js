'use strict';
/**
 * server.js — Sarthi AI Node.js Backend
 *
 * Startup order:
 *  1. Load + validate env vars (crashes fast if missing)
 *  2. Init Gemini client + run startup key verification
 *  3. Init ChromaDB client + get-or-create collection
 *  4. Start Express app
 *  5. Register process-level crash guards
 */

// ── 1. Env validation ─────────────────────────────────────────────────────────
const env = require('./config/env');

// ── 2. Logger ─────────────────────────────────────────────────────────────────
const logger = require('./utils/logger');

// ── 3. Gemini + ChromaDB init ─────────────────────────────────────────────────
const { initGemini, testGeminiConnection } = require('./config/gemini');
const { initChroma, testChromaConnection } = require('./config/chromadb');

// ── 4. Express setup ──────────────────────────────────────────────────────────
const express = require('express');
const cors = require('cors');

const scoreRouter = require('./routes/score');
const healthRouter = require('./routes/health');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// CORS — only allow FRONTEND_ORIGIN, not wildcard
app.use(
  cors({
    origin: env.FRONTEND_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Body parser — 1mb limit to reject huge payloads
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));

// Request logger — method + path + status + duration
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    logger.info(
      { method: req.method, path: req.path, status: res.statusCode, duration: `${Date.now() - start}ms` },
      'request'
    );
  });
  next();
});

// ── 5. Mount routes ───────────────────────────────────────────────────────────
app.use('/', healthRouter);
app.use('/api/score', scoreRouter);

// Also mount OCR at /api/ocr-scan to match frontend's direct fetch('/api/ocr-scan')
const { ocrRateLimiter } = require('./middleware/rateLimiter');
const { validateBody, ocrScanSchema } = require('./middleware/validateRequest');
const { ocrScan } = require('./controllers/scoreController');
app.post('/api/ocr-scan', ocrRateLimiter, validateBody(ocrScanSchema), ocrScan);

// 404
app.use((_req, res) => res.status(404).json({ error: 'Endpoint not found' }));

// ── 6. Global error handler (MUST be last app.use) ───────────────────────────
app.use(errorHandler);

// ── 7. Process-level crash guards ─────────────────────────────────────────────
process.on('uncaughtException', (err) => {
  logger.fatal({ err: err.message, stack: err.stack }, '[CRASH] Uncaught exception — process exiting');
  setTimeout(() => process.exit(1), 100);
});

process.on('unhandledRejection', (reason) => {
  logger.error({ reason: String(reason) }, '[WARNING] Unhandled promise rejection — check for missing await/catch');
});

// ── 8. Start server ───────────────────────────────────────────────────────────
async function startServer() {
  // Init Gemini — crashes on invalid API key
  initGemini();
  logger.info('[Startup] Verifying Gemini API key...');
  const geminiOk = await testGeminiConnection();
  logger.info(geminiOk ? '[Startup] ✓ Gemini connected' : '[Startup] ⚠ Gemini check failed (transient)');

  // Init ChromaDB — crashes if server unreachable
  logger.info({ url: env.CHROMA_URL }, '[Startup] Connecting to ChromaDB...');
  try {
    await initChroma();
    const chromaOk = await testChromaConnection();
    logger.info(chromaOk ? '[Startup] ✓ ChromaDB connected' : '[Startup] ⚠ ChromaDB check failed');
  } catch (err) {
    logger.fatal(
      { err: err.message, url: env.CHROMA_URL },
      '[Startup] FATAL: Cannot connect to ChromaDB server. ' +
        'Start it with: chromadb run --path ./chroma_db --port 8001'
    );
    process.exit(1);
  }

  // Start Express
  const server = app.listen(env.PORT, () => {
    logger.info(
      { port: env.PORT, env: env.NODE_ENV, chromaUrl: env.CHROMA_URL, collection: env.CHROMA_COLLECTION },
      `[Startup] ✓ Sarthi AI Node backend running → http://localhost:${env.PORT}`
    );
  });

  // Graceful shutdown
  const shutdown = (signal) => {
    logger.info(`[Shutdown] ${signal} received`);
    server.close(() => {
      logger.info('[Shutdown] Server closed');
      process.exit(0);
    });
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

startServer().catch((err) => {
  logger.fatal({ err: err.message, stack: err.stack }, '[FATAL] Server failed to start');
  process.exit(1);
});
