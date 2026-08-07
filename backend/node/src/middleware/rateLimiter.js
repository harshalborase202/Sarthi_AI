'use strict';
/**
 * middleware/rateLimiter.js
 * Rate limiters for API endpoints that call paid services (Gemini).
 */
const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');

/**
 * Rate limiter for the score/recommendation endpoint.
 * Max 20 requests per IP per minute — prevents abuse of paid Gemini API.
 */
const scoreRateLimiter = rateLimit({
  windowMs: 60 * 1000,     // 1 minute window
  max: 20,                  // max 20 requests per IP per window
  standardHeaders: true,    // Return rate limit info in RateLimit-* headers
  legacyHeaders: false,
  message: {
    error: 'Too many requests. You have exceeded the 20 requests/min limit. Please wait before retrying.',
  },
  handler: (req, res, _next, options) => {
    logger.warn({ ip: req.ip, path: req.path }, '[RateLimit] Rate limit exceeded');
    res.status(429).json(options.message);
  },
  keyGenerator: (req) => req.ip, // Rate limit by IP address
});

/**
 * Stricter rate limiter for OCR scan endpoint (vision API is expensive).
 * Max 10 requests per IP per minute.
 */
const ocrRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many OCR scan requests. Limit: 10 per minute per IP.',
  },
  handler: (req, res, _next, options) => {
    logger.warn({ ip: req.ip, path: req.path }, '[RateLimit] OCR rate limit exceeded');
    res.status(429).json(options.message);
  },
});

module.exports = { scoreRateLimiter, ocrRateLimiter };
