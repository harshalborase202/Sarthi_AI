'use strict';
/**
 * utils/logger.js
 * Structured JSON logger using pino.
 * - In development: pretty-prints to stdout with colors
 * - In production: emits JSON lines (pipe to log aggregator)
 * NEVER logs raw secrets or stack traces to the client.
 */
const pino = require('pino');
const env = require('../config/env');

let logger;

if (env.IS_PRODUCTION) {
  // Production: plain JSON to stdout
  logger = pino({
    level: 'info',
    redact: {
      paths: ['req.headers.authorization', 'GEMINI_API_KEY', 'FIREBASE_PRIVATE_KEY'],
      censor: '[REDACTED]',
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  });
} else {
  // Development: pretty-print using transport (pino v9+ API)
  logger = pino({
    level: 'debug',
    redact: {
      paths: ['req.headers.authorization', 'GEMINI_API_KEY', 'FIREBASE_PRIVATE_KEY'],
      censor: '[REDACTED]',
    },
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname',
      },
    },
  });
}

module.exports = logger;
