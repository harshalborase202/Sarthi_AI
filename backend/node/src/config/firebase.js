'use strict';
/**
 * config/firebase.js
 * Firebase Admin SDK initialization.
 * Called once at startup — subsequent requires return the cached instance.
 */
const admin = require('firebase-admin');
const env = require('./env');
const logger = require('../utils/logger');

let db = null;

function initFirebase() {
  if (admin.apps.length > 0) {
    // Already initialized — return existing app
    db = admin.firestore();
    return db;
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: env.FIREBASE_PROJECT_ID,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        privateKey: env.FIREBASE_PRIVATE_KEY,
      }),
    });

    db = admin.firestore();
    logger.info({ projectId: env.FIREBASE_PROJECT_ID }, '[Firebase] Admin SDK initialized');
    return db;
  } catch (err) {
    logger.error({ err: err.message }, '[Firebase] FATAL: Failed to initialize Firebase Admin SDK');
    process.exit(1);
  }
}

/**
 * Test Firestore connectivity by listing collections.
 * Returns true if reachable, false otherwise — does NOT throw.
 */
async function testFirestoreConnection() {
  try {
    await db.listCollections();
    return true;
  } catch (err) {
    logger.warn({ err: err.message }, '[Firebase] Firestore connectivity check failed');
    return false;
  }
}

function getDb() {
  if (!db) {
    throw new Error('Firebase not initialized. Call initFirebase() first.');
  }
  return db;
}

module.exports = { initFirebase, getDb, testFirestoreConnection };
