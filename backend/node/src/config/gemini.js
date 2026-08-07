'use strict';
/**
 * config/gemini.js
 * Initializes the Gemini client and runs a startup connectivity check.
 *
 * CRITICAL: This module logs ONLY whether the key is present/valid.
 *           The raw key value is NEVER logged anywhere.
 */
const { GoogleGenerativeAI } = require('@google/generative-ai');
const env = require('./env');
const logger = require('../utils/logger');

let genAI = null;
let _geminiConnected = false;

function initGemini() {
  genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  return genAI;
}

/**
 * Performs a lightweight real call to Gemini API to verify the key is valid.
 * Uses a minimal generateContent call — fast and cheap.
 * Sets the internal _geminiConnected flag.
 * Does NOT throw — failures are logged and reported via health check.
 */
async function testGeminiConnection() {
  try {
    if (!genAI) {
      throw new Error('Gemini client not initialized');
    }

    const modelName = process.env.GEMINI_MODEL_NAME || 'gemini-flash-latest';
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: 'ping' }] }],
      generationConfig: { maxOutputTokens: 5 },
    });

    // If we got here, the key is valid
    const responseText = result.response?.text?.() ?? '';
    if (typeof responseText === 'string') {
      _geminiConnected = true;
      logger.info('[Gemini] API key verified successfully — connection OK');
    }
  } catch (err) {
    _geminiConnected = false;

    // Distinguish key errors from transient errors
    const statusCode = err?.status ?? err?.httpStatus ?? null;
    const msg = err?.message ?? String(err);

    if (statusCode === 401 || msg.includes('API_KEY_INVALID') || msg.includes('API key not valid')) {
      logger.error(
        '[Gemini] STARTUP FAILURE: GEMINI_API_KEY is invalid or expired. ' +
          'Get a valid key from https://aistudio.google.com/app/apikey'
      );
      // Hard crash on invalid key at startup — do not silently boot broken
      process.exit(1);
    } else {
      // Transient error (network, quota) — warn but don't crash startup
      logger.warn({ statusCode, err: msg }, '[Gemini] Startup connectivity check failed (transient) — will retry on first request');
    }
  }

  return _geminiConnected;
}

function getGenAI() {
  if (!genAI) {
    throw new Error('Gemini client not initialized. Call initGemini() first.');
  }
  return genAI;
}

function isGeminiConnected() {
  return _geminiConnected;
}

module.exports = { initGemini, testGeminiConnection, getGenAI, isGeminiConnected };
