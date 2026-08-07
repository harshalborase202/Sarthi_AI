'use strict';
/**
 * config/chromadb.js
 * ChromaDB / Vector Store connection manager.
 *
 * Supports dual mode:
 * 1. External ChromaDB server (if CHROMA_URL is reachable)
 * 2. Embedded Vector Store with vector_cache.json persistence (zero external server required)
 */
const { ChromaClient } = require('chromadb');
const env = require('./env');
const logger = require('../utils/logger');

let client = null;
let collection = null;
let isServerMode = false;

async function initChroma() {
  if (env.CHROMA_URL && env.CHROMA_URL !== 'embedded') {
    try {
      client = new ChromaClient({ path: env.CHROMA_URL });
      await client.heartbeat();
      collection = await client.getOrCreateCollection({
        name: env.CHROMA_COLLECTION,
        metadata: { 'hnsw:space': 'cosine' },
      });
      isServerMode = true;
      logger.info({ chromaUrl: env.CHROMA_URL }, '[ChromaDB] Connected to external ChromaDB server');
      return collection;
    } catch (err) {
      logger.warn(
        { err: err.message, chromaUrl: env.CHROMA_URL },
        '[ChromaDB] External server not reachable — falling back to Embedded Persistent Vector Store'
      );
    }
  }

  isServerMode = false;
  logger.info('[ChromaDB] Using Embedded Persistent Vector Store (vector_cache.json)');
  return null;
}

async function testChromaConnection() {
  if (isServerMode && client) {
    try {
      await client.heartbeat();
      return true;
    } catch {
      return false;
    }
  }
  // Embedded mode is always connected
  return true;
}

function getCollection() {
  return collection;
}

function isChromaServerMode() {
  return isServerMode;
}

module.exports = { initChroma, testChromaConnection, getCollection, isChromaServerMode };
