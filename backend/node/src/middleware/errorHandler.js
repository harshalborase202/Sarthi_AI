'use strict';
/**
 * middleware/errorHandler.js
 * Global error-handling middleware — MUST be the last app.use().
 *
 * Rules:
 * - Returns JSON { error: message } with correct status code
 * - NEVER leaks stack traces in production responses
 * - Logs full stack traces server-side for 5xx errors
 * - Handles both thrown errors and GeminiService classified errors { httpStatus, error }
 */
const logger = require('../utils/logger');
const env = require('../config/env');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // GeminiService throws classified objects: { httpStatus, error }
  if (err && typeof err === 'object' && 'httpStatus' in err && 'error' in err && !err.stack) {
    const status = err.httpStatus ?? 500;
    logger.warn({ method: req.method, path: req.path, status, error: err.error }, '[ErrorHandler] Classified API error');
    return res.status(status).json({ error: err.error });
  }

  // Standard Error objects
  const status = err.status ?? err.statusCode ?? 500;
  const message = err.message ?? 'Internal server error';

  // Log full stack for 5xx — server-side only
  if (status >= 500) {
    logger.error(
      {
        method: req.method,
        path: req.path,
        status,
        stack: err.stack,
        body: req.body,
      },
      '[ErrorHandler] 5xx Internal error'
    );
  } else {
    logger.warn({ method: req.method, path: req.path, status, message }, '[ErrorHandler] 4xx client error');
  }

  // Never expose stack traces in production responses
  res.status(status).json({
    error: message,
    ...(env.IS_PRODUCTION ? {} : { stack: err.stack }),
  });
}

module.exports = errorHandler;
