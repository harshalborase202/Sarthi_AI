'use strict';
/**
 * controllers/scanController.js
 * Handles POST /api/scan/yojana-ad
 *
 * Features:
 *   - 5MB file size limit check
 *   - Magic byte MIME verification (JPEG, PNG, WEBP only)
 *   - Gemini Vision AI ad & pamphlet analysis
 *   - Fuse.js fuzzy string matching against verified scheme database
 *   - Red flag & scam detection
 *   - Privacy-preserving logging (SHA-256 image hash logged, raw image bytes discarded)
 */
const crypto = require('crypto');
const Fuse = require('fuse.js');
const { analyzeYojanaAd } = require('../services/geminiService');
const logger = require('../utils/logger');

// Verified Yojanas database (mirrors frontend & Python backend)
const VERIFIED_SCHEMES = [
  {
    id: "pm-vidyalaxmi",
    name: "PM Vidyalaxmi Scheme",
    officialUrl: "https://pmvidyalaxmi.ac.in/",
    shortDescription: "Collateral-free educational loans up to ₹7.5 Lakhs with 3% interest subvention for meritorious students.",
    keywords: ["vidyalaxmi", "vidya lakshmi", "education loan", "interest subvention", "higher education", "विद्यालक्ष्मी", "शिक्षण कर्ज"]
  },
  {
    id: "mh-post-matric",
    name: "Maharashtra Post-Matric Scholarship",
    officialUrl: "https://mahadbt.maharashtra.gov.in/",
    shortDescription: "Tuition fee waiver and monthly allowance for SC/ST/OBC/EWS students in Maharashtra.",
    keywords: ["mahadbt", "post matric", "maharashtra scholarship", "caste scholarship", "महाडीबीटी", "पोस्ट मॅट्रिक", "शिष्यवृत्ती"]
  },
  {
    id: "aicte-pragati",
    name: "AICTE Pragati Scholarship for Girls",
    officialUrl: "https://scholarships.gov.in/",
    shortDescription: "Scholarship of ₹50,000 per annum for female technical degree/diploma students.",
    keywords: ["aicte", "pragati", "girl scholarship", "technical education", "female student", "प्रगती", "मुलींसाठी शिष्यवृत्ती"]
  },
  {
    id: "pm-kisan",
    name: "PM-KISAN Samman Nidhi",
    officialUrl: "https://pmkisan.gov.in/",
    shortDescription: "Direct income support of ₹6,000 per year in 3 equal installments to landholding farmer families.",
    keywords: ["pm kisan", "kisan samman", "farmer 6000", "agriculture dbt", "kisan nidhi", "पंतप्रधान किसान", "किसान सन्मान निधी"]
  },
  {
    id: "pm-svanidhi",
    name: "PM SVANidhi Scheme",
    officialUrl: "https://pmsvanidhi.mohua.gov.in/",
    shortDescription: "Collateral-free working capital loan up to ₹50,000 for street vendors and micro-entrepreneurs.",
    keywords: ["svanidhi", "street vendor loan", "vendor credit", "collateral free loan", "स्वनिधी", "पथविक्रेता कर्ज"]
  },
  {
    id: "ladki-bahin",
    name: "Mukhyamantri Majhi Ladki Bahin Yojana",
    officialUrl: "https://ladkibahin.maharashtra.gov.in/",
    shortDescription: "Monthly financial assistance of ₹1,500 directly transferred to eligible women in Maharashtra aged 21 to 65.",
    keywords: ["ladki bahin", "majhi ladki bahin", "maharashtra women 1500", "ladki bahin yojana", "लाडकी बहीण", "माझी लाडकी बहीण"]
  },
  {
    id: "pm-vishwakarma",
    name: "PM Vishwakarma Yojana",
    officialUrl: "https://pmvishwakarma.gov.in/",
    shortDescription: "₹15,000 toolkit grant + ₹3.0 Lakh collateral-free loan @ 5% interest for traditional artisans & craftspeople.",
    keywords: ["vishwakarma", "artisan loan", "craftsman toolkit", "traditional trades", "vishwakarma yojana", "विश्वकर्मा", "कारागीर योजना"]
  },
  {
    id: "pm-surya-ghar",
    name: "PM Surya Ghar: Muft Bijli Yojana",
    officialUrl: "https://pmsuryaghar.gov.in/",
    shortDescription: "Rooftop solar installation subsidy up to ₹78,000 providing up to 300 units of free monthly electricity.",
    keywords: ["surya ghar", "muft bijli", "rooftop solar subsidy", "free electricity 300 units", "solar yojana", "सूर्य घर", "मोफत वीज"]
  },
  {
    id: "ayushman-bharat",
    name: "Ayushman Bharat PM-JAY",
    officialUrl: "https://pmjay.gov.in/",
    shortDescription: "Cashless health insurance coverage up to ₹5.0 Lakhs per family per year for hospital treatment.",
    keywords: ["ayushman", "pmjay", "health card 5 lakh", "cashless treatment", "ayushman bharat", "आयुष्मान भारत", "आरोग्य कार्ड"]
  }
];

// Configure Fuse.js for fuzzy string matching on suggestedSchemeName only
// Keep threshold tight (0.4) — we only feed Gemini's clean scheme name, not raw OCR text
const fuse = new Fuse(VERIFIED_SCHEMES, {
  keys: ['name', 'id', 'keywords'],
  threshold: 0.4,
  includeScore: true,
});

/**
 * Direct keyword scan — checks if any of a scheme's specific keywords
 * appear as a substring in the given text.
 * IMPORTANT: Only call this with Gemini's suggestedSchemeName or confidenceReasoning —
 * NEVER with raw extractedText (too noisy, causes false positives).
 */
function directKeywordMatch(text) {
  if (!text) return null;
  const lower = text.toLowerCase();
  for (const scheme of VERIFIED_SCHEMES) {
    for (const kw of scheme.keywords) {
      // Match keyword as substring (supports Devanagari via exact Unicode match)
      if (lower.includes(kw.toLowerCase()) || text.includes(kw)) {
        return scheme;
      }
    }
  }
  return null;
}

/**
 * Validate image buffer using magic bytes (header signature inspection)
 */
function validateImageMagicBytes(buffer) {
  if (!buffer || buffer.length < 4) return false;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
    return 'image/jpeg';
  }
  // PNG: 89 50 4E 47
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
    return 'image/png';
  }
  // WEBP: RIFF header (52 49 46 46)
  if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46) {
    return 'image/webp';
  }

  return null;
}

/**
 * POST /api/scan/yojana-ad
 */
async function scanYojanaAd(req, res, next) {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: 'Image file is required under "image" field' });
    }

    const buffer = req.file.buffer;

    // 1. File size check (5MB limit)
    if (buffer.length > 5 * 1024 * 1024) {
      return res.status(400).json({ error: 'File size exceeds 5MB limit' });
    }

    // 2. Magic byte validation
    const detectedMimeType = validateImageMagicBytes(buffer);
    if (!detectedMimeType) {
      logger.warn({ originalName: req.file.originalname, mime: req.file.mimetype }, '[ScanController] Magic byte validation failed');
      return res.status(400).json({
        error: 'File is not a valid image format. Only JPEG, PNG, and WEBP images are supported.',
      });
    }

    // 3. Privacy: Hash image for log registration (raw image is NEVER saved)
    const imageHash = crypto.createHash('sha256').update(buffer).digest('hex');

    logger.info({ imageHash: imageHash.slice(0, 12), sizeKB: Math.round(buffer.length / 1024) }, '[ScanController] Starting ad vision analysis');

    // 4. Send image to Gemini Vision AI
    const analysis = await analyzeYojanaAd(buffer, detectedMimeType);

    // 5. Match Gemini's identified scheme name against the verified database.
    //
    // STRATEGY: Only use Gemini's `suggestedSchemeName` + `confidenceReasoning` for matching.
    // NEVER use raw `extractedText` — it contains noisy OCR text (e.g. 'Maharashtra', 'महिला')
    // that would cause false positives across schemes.
    //
    // Gemini already does the hard work of scheme identification — we just need to
    // verify its answer against our database.
    const geminiSchemeHint = [
      analysis.suggestedSchemeName || '',
      analysis.confidenceReasoning || '',
    ].join(' ').trim();

    let matchFound = false;
    let confidence = 'low';
    let matchedScheme = null;

    logger.info({ suggestedSchemeName: analysis.suggestedSchemeName, hint: geminiSchemeHint.slice(0, 120) }, '[ScanController] Gemini scheme hint for matching');

    // Pass 1: Direct keyword/substring scan on Gemini's scheme name (handles Devanagari)
    const directMatch = directKeywordMatch(geminiSchemeHint);
    if (directMatch) {
      matchFound = true;
      matchedScheme = {
        id: directMatch.id,
        name: directMatch.name,
        officialUrl: directMatch.officialUrl,
        shortDescription: directMatch.shortDescription,
      };
      confidence = analysis.redFlags.length === 0 ? 'high' : 'medium';
      logger.info({ schemeId: directMatch.id }, '[ScanController] Matched via direct keyword scan on suggestedSchemeName');
    }

    // Pass 2: Fuse.js fuzzy match on Gemini's scheme name (handles partial/misspelled English)
    if (!matchFound && geminiSchemeHint) {
      const fuseResults = fuse.search(geminiSchemeHint);
      if (fuseResults.length > 0) {
        const bestMatch = fuseResults[0];
        // Fuse score: lower is better (0.0 = perfect match)
        if (bestMatch.score <= 0.4) {
          matchFound = true;
          matchedScheme = {
            id: bestMatch.item.id,
            name: bestMatch.item.name,
            officialUrl: bestMatch.item.officialUrl,
            shortDescription: bestMatch.item.shortDescription,
          };
          confidence = bestMatch.score <= 0.25 && analysis.redFlags.length === 0 ? 'high' : 'medium';
          logger.info({ schemeId: bestMatch.item.id, score: bestMatch.score }, '[ScanController] Matched via Fuse on suggestedSchemeName');
        }
      }
    }

    // 6. Privacy Logging (hash + metadata only, 0 raw image bytes saved)
    logger.info(
      {
        imageHash: imageHash.slice(0, 12),
        matchFound,
        confidence,
        matchedSchemeId: matchedScheme?.id || null,
        redFlagsCount: analysis.redFlags.length,
      },
      '[ScanController] Yojana ad scan logged'
    );

    // 7. Structured Response
    return res.status(200).json({
      matchFound,
      confidence,
      matchedScheme,
      extractedText: analysis.extractedText,
      redFlags: analysis.redFlags,
      disclaimer: 'This is an automated match. Always verify on the official government portal before sharing personal information or making any payment.',
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { scanYojanaAd };
