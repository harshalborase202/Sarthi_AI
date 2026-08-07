'use strict';
/**
 * routes/scan.js
 * Yojana Ad & Pamphlet Scam Detector API endpoints.
 *
 * POST /api/scan/yojana-ad — multipart file upload (image)
 */
const { Router } = require('express');
const multer = require('multer');
const { ocrRateLimiter } = require('../middleware/rateLimiter');
const { scanYojanaAd } = require('../controllers/scanController');

const router = Router();

// Multer memory storage — 5MB limits
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (_req, file, cb) => {
    // Basic extension check before buffer magic byte validation
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, WEBP) are allowed.'));
    }
  },
});

// Middleware error wrapper for Multer limits
function handleMulterUpload(req, res, next) {
  upload.single('image')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size exceeds 5MB limit' });
      }
      return res.status(400).json({ error: err.message || 'Invalid file upload' });
    }
    next();
  });
}

// POST /api/scan/yojana-ad
router.post('/yojana-ad', ocrRateLimiter, handleMulterUpload, scanYojanaAd);

module.exports = router;
