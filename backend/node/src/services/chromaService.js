'use strict';
/**
 * services/chromaService.js
 * Dual-mode Vector Store Service.
 *
 * Mode 1: External ChromaDB HTTP Server (when running)
 * Mode 2: Embedded Persistent Vector Store with JSON disk caching (vector_cache.json)
 *
 * Features:
 *   - Gemini text-embedding-004 vector embeddings (768 dims)
 *   - Cosine similarity vector search
 *   - Automatic disk persistence (zero external process required if pip install chromadb is skipped)
 *   - Filter by userId + semantic similarity search
 */
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { getCollection, isChromaServerMode } = require('../config/chromadb');
const env = require('../config/env');
const logger = require('../utils/logger');

const CACHE_FILE = path.resolve(__dirname, '../../vector_cache.json');
const EMBEDDING_MODEL = 'text-embedding-004';

let _embedClient = null;
function getEmbedClient() {
  if (!_embedClient) {
    _embedClient = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  }
  return _embedClient;
}

// In-memory store for embedded mode
let _localStore = [];
let _storeLoaded = false;

function loadLocalStore() {
  if (_storeLoaded) return;
  if (fs.existsSync(CACHE_FILE)) {
    try {
      const data = fs.readFileSync(CACHE_FILE, 'utf-8');
      _localStore = JSON.parse(data);
      logger.info({ count: _localStore.length }, '[VectorStore] Loaded records from vector_cache.json');
    } catch (err) {
      logger.warn({ err: err.message }, '[VectorStore] Cache load error, initializing fresh store');
      _localStore = [];
    }
  } else {
    _localStore = [];
  }
  _storeLoaded = true;
}

function saveLocalStore() {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(_localStore, null, 2), 'utf-8');
  } catch (err) {
    logger.error({ err: err.message }, '[VectorStore] Failed to save vector_cache.json');
  }
}

/**
 * Generate 768-dim embedding vector using Gemini text-embedding-004
 */
async function getEmbedding(text, taskType = 'RETRIEVAL_DOCUMENT') {
  const ai = getEmbedClient();
  const model = ai.getGenerativeModel({ model: EMBEDDING_MODEL });
  const result = await model.embedContent({
    content: { parts: [{ text }], role: 'user' },
    taskType,
  });
  return result.embedding.values;
}

/**
 * Cosine similarity between two float vectors
 */
function cosineSimilarity(a, b) {
  if (!a || !b || a.length !== b.length) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

function buildEmbeddingText(profile, recommendation) {
  return [
    `Age: ${profile.age}`,
    `Gender: ${profile.gender}`,
    `State: ${profile.state}`,
    `Occupation: ${profile.occupation}`,
    `Income: ${profile.income}`,
    `Category: ${profile.category}`,
    `Education: ${profile.education}`,
    `Disability: ${profile.disability || 'no'}`,
    `Recommendation: ${recommendation}`,
  ].join('. ');
}

/**
 * Save score recommendation to vector store
 */
async function saveScoreRecommendation(data) {
  const id = uuidv4();
  const createdAt = new Date().toISOString();

  const metadata = {
    userId: data.userId,
    score: data.score,
    recommendation: data.recommendation,
    status: data.status ?? 'success',
    createdAt,
    age: String(data.input.age ?? ''),
    gender: String(data.input.gender ?? ''),
    state: String(data.input.state ?? ''),
    occupation: String(data.input.occupation ?? ''),
    income: String(data.input.income ?? ''),
    category: String(data.input.category ?? ''),
    education: String(data.input.education ?? ''),
    disability: String(data.input.disability ?? 'no'),
    rawGeminiResponse: (data.rawGeminiResponse ?? '').slice(0, 500),
  };

  const embeddingText = buildEmbeddingText(data.input, data.recommendation);
  let embedding;
  try {
    embedding = await getEmbedding(embeddingText, 'RETRIEVAL_DOCUMENT');
  } catch (err) {
    logger.error({ err: err.message }, '[VectorStore] Embedding generation failed');
    throw new Error(`Failed to generate embedding: ${err.message}`);
  }

  if (isChromaServerMode()) {
    const col = getCollection();
    await col.add({
      ids: [id],
      documents: [embeddingText],
      embeddings: [embedding],
      metadatas: [metadata],
    });
  } else {
    loadLocalStore();
    _localStore.push({
      id,
      document: embeddingText,
      embedding,
      metadata,
    });
    saveLocalStore();
  }

  logger.info({ id, userId: data.userId, score: data.score }, '[VectorStore] Recommendation saved');

  return {
    id,
    userId: data.userId,
    score: data.score,
    recommendation: data.recommendation,
    createdAt,
    status: metadata.status,
  };
}

/**
 * Get score history by userId
 */
async function getScoresByUser(userId, limit = 50) {
  if (!userId || typeof userId !== 'string') {
    throw new Error('userId is required');
  }

  if (isChromaServerMode()) {
    const col = getCollection();
    const result = await col.get({
      where: { userId: { $eq: userId } },
      limit,
      include: ['metadatas', 'documents'],
    });

    const records = (result.ids ?? []).map((id, i) => ({
      id,
      ...result.metadatas[i],
    }));

    records.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return records;
  } else {
    loadLocalStore();
    const userRecords = _localStore
      .filter((item) => item.metadata?.userId === userId)
      .map((item) => ({
        id: item.id,
        ...item.metadata,
      }));

    userRecords.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return userRecords.slice(0, limit);
  }
}

/**
 * Semantic vector similarity search
 */
async function findSimilarProfiles(queryText, nResults = 5, filterUserId = null) {
  if (!queryText) throw new Error('queryText is required');

  let queryEmbedding;
  try {
    queryEmbedding = await getEmbedding(queryText, 'RETRIEVAL_QUERY');
  } catch (err) {
    logger.error({ err: err.message }, '[VectorStore] Query embedding failed');
    throw new Error(`Failed to embed query: ${err.message}`);
  }

  if (isChromaServerMode()) {
    const col = getCollection();
    const queryOptions = {
      queryEmbeddings: [queryEmbedding],
      nResults,
      include: ['metadatas', 'documents', 'distances'],
    };

    if (filterUserId) {
      queryOptions.where = { userId: { $eq: filterUserId } };
    }

    const result = await col.query(queryOptions);
    const ids = result.ids?.[0] ?? [];
    const metadatas = result.metadatas?.[0] ?? [];
    const distances = result.distances?.[0] ?? [];

    return ids.map((id, i) => ({
      id,
      ...metadatas[i],
      similarity: Math.round((1 - distances[i] / 2) * 100),
    }));
  } else {
    loadLocalStore();
    let candidates = _localStore;
    if (filterUserId) {
      candidates = candidates.filter((item) => item.metadata?.userId === filterUserId);
    }

    const scored = candidates.map((item) => {
      const sim = cosineSimilarity(queryEmbedding, item.embedding);
      return {
        id: item.id,
        ...item.metadata,
        similarity: Math.round(sim * 100),
      };
    });

    scored.sort((a, b) => b.similarity - a.similarity);
    return scored.slice(0, nResults);
  }
}

module.exports = { saveScoreRecommendation, getScoresByUser, findSimilarProfiles };
