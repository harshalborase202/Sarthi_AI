'use strict';
/**
 * services/firestoreService.js
 * All Firestore read/write operations.
 *
 * Collection: scoreRecommendations
 * Document schema (enforced before every write):
 * {
 *   userId:              string,
 *   input:               object,
 *   score:               number (integer 0-100),
 *   recommendation:      string,
 *   rawGeminiResponse:   string (optional, for debugging),
 *   createdAt:           Firestore ServerTimestamp,
 *   status:              "success" | "error"
 * }
 *
 * Index note: If querying by userId + createdAt (descending), create a composite index:
 *   Collection: scoreRecommendations
 *   Fields: userId (ASC), createdAt (DESC)
 *   Create at: Firebase Console → Firestore → Indexes → Add composite index
 */
const { getDb } = require('../config/firebase');
const { FieldValue } = require('firebase-admin/firestore');
const logger = require('../utils/logger');

const COLLECTION = 'scoreRecommendations';

/**
 * Validates the document shape before writing to Firestore.
 * Throws Error with a descriptive message if the shape is invalid.
 */
function validateDocument(doc) {
  const errors = [];

  if (typeof doc.userId !== 'string' || !doc.userId.trim()) {
    errors.push('userId must be a non-empty string');
  }
  if (typeof doc.input !== 'object' || doc.input === null || Array.isArray(doc.input)) {
    errors.push('input must be a plain object');
  }
  if (typeof doc.score !== 'number' || !Number.isInteger(doc.score) || doc.score < 0 || doc.score > 100) {
    errors.push('score must be an integer between 0 and 100');
  }
  if (typeof doc.recommendation !== 'string' || !doc.recommendation.trim()) {
    errors.push('recommendation must be a non-empty string');
  }
  if (!['success', 'error'].includes(doc.status)) {
    errors.push("status must be 'success' or 'error'");
  }

  if (errors.length > 0) {
    throw new Error(`Firestore document validation failed: ${errors.join('; ')}`);
  }
}

/**
 * Saves a score recommendation record to Firestore.
 * Uses auto-generated document ID and server timestamp.
 * Returns the saved document including its Firestore ID.
 *
 * @param {object} data - { userId, input, score, recommendation, rawGeminiResponse }
 * @returns {object} - Saved record with `id` field
 * @throws Error on validation failure or Firestore write error
 */
async function saveScoreRecommendation(data) {
  const docData = {
    userId: data.userId,
    input: data.input,
    score: data.score,
    recommendation: data.recommendation,
    rawGeminiResponse: data.rawGeminiResponse ?? null,
    createdAt: FieldValue.serverTimestamp(), // Always use server timestamp
    status: data.status ?? 'success',
  };

  // Validate BEFORE writing — never write partial/malformed objects
  validateDocument(docData);

  const db = getDb();
  const collectionRef = db.collection(COLLECTION);

  try {
    const docRef = await collectionRef.add(docData);
    logger.info({ docId: docRef.id, userId: data.userId, score: data.score }, '[Firestore] Score recommendation saved');

    return {
      id: docRef.id,
      ...docData,
      // Replace server timestamp sentinel with ISO string for response
      createdAt: new Date().toISOString(),
    };
  } catch (err) {
    logger.error({ err: err.message, userId: data.userId }, '[Firestore] Failed to save score recommendation');
    throw new Error(`Failed to persist result to Firestore: ${err.message}`);
  }
}

/**
 * Fetches all score recommendations for a given userId, ordered by createdAt DESC.
 * Requires composite index: userId (ASC) + createdAt (DESC) — see index note at top.
 */
async function getScoresByUser(userId) {
  if (!userId || typeof userId !== 'string') {
    throw new Error('userId is required');
  }

  const db = getDb();
  try {
    const snapshot = await db
      .collection(COLLECTION)
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(50) // Reasonable page size to avoid massive reads
      .get();

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    logger.error({ err: err.message, userId }, '[Firestore] Failed to fetch user scores');
    throw new Error(`Failed to fetch scores from Firestore: ${err.message}`);
  }
}

module.exports = { saveScoreRecommendation, getScoresByUser };
