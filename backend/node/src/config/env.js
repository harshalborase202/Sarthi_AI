'use strict';
/**
 * config/env.js
 * Loads and validates ALL required environment variables at startup.
 * If any required variable is missing or empty, the server crashes immediately
 * with a clear error — it NEVER boots into a broken state.
 */
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const REQUIRED_VARS = [
  'GEMINI_API_KEY',
  'CHROMA_URL',
  'FRONTEND_ORIGIN',
];

function validateEnv() {
  const missing = [];

  for (const varName of REQUIRED_VARS) {
    const val = process.env[varName];
    if (!val || val.trim() === '') {
      missing.push(varName);
    }
  }

  if (missing.length > 0) {
    console.error(
      '\n[STARTUP ERROR] Missing required environment variables:\n' +
        missing.map((v) => `  ✖  ${v}`).join('\n') +
        '\n\nPlease copy .env.example to .env and fill in all values.\n' +
        'Get GEMINI_API_KEY from: https://aistudio.google.com/app/apikey\n' +
        'CHROMA_URL: URL of your running ChromaDB server (e.g. http://localhost:8001)\n' +
        '  Start ChromaDB server: pip install chromadb && chromadb run --path ./chroma_db --port 8001\n'
    );
    process.exit(1);
  }
}

validateEnv();

module.exports = {
  PORT: parseInt(process.env.PORT || '4000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY, // Used only in config/gemini.js and chromaService.js — never logged raw
  CHROMA_URL: process.env.CHROMA_URL,
  CHROMA_COLLECTION: process.env.CHROMA_COLLECTION || 'score_recommendations',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
};
