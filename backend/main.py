"""
Sarthi AI — FastAPI Backend Entry Point

Endpoints:
  POST /api/evaluate             — Profile eligibility evaluation
  GET  /api/schemes              — List all schemes
  GET  /api/schemes/{id}         — Scheme detail
  GET  /api/memory               — List memory items
  POST /api/memory               — Create memory item
  PUT  /api/memory/{id}          — Update memory retention
  DEL  /api/memory/{id}          — Delete memory item
  DEL  /api/memory/forget-all    — Forget all memories
  POST /api/reasoning/stream     — SSE AI reasoning stream
  POST /api/chat                 — Gemini chat
  POST /api/search               — ChromaDB semantic search
  GET  /api/documents/{id}       — Document checklist
  GET  /health                   — Health check
"""

import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from models.db import init_db
from services.chroma import initialize_vector_store

from routers import evaluate, schemes, memory, reasoning, chat, search, documents, ocr

load_dotenv()

CORS_ORIGIN = os.getenv("CORS_ORIGIN", "http://localhost:3000")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: initialize SQLite DB and seed ChromaDB."""
    print("[Sarthi AI] Starting up...")
    init_db()
    print("[Sarthi AI] SQLite initialized.")
    yield
    print("[Sarthi AI] Shutting down.")


app = FastAPI(
    title="Sarthi AI Backend",
    description=(
        "Backend API for Sarthi AI — an Explainable AI Government Scheme Navigator for Indian Citizens. "
        "Provides rule-based eligibility evaluation, ChromaDB semantic search, Gemini AI reasoning streams, "
        "and SQLite-persisted memory management."
    ),
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# ─────────────────────────────────────────────────────────────────────────────
# CORS Middleware
# ─────────────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[CORS_ORIGIN, "http://localhost:3001", "http://localhost:5173", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────────────────────────────────────
# Register Routers
# ─────────────────────────────────────────────────────────────────────────────
app.include_router(evaluate.router)
app.include_router(schemes.router)
app.include_router(memory.router)
app.include_router(reasoning.router)
app.include_router(chat.router)
app.include_router(search.router)
app.include_router(documents.router)
app.include_router(ocr.router)


# ─────────────────────────────────────────────────────────────────────────────
# Health Check
# ─────────────────────────────────────────────────────────────────────────────
@app.get("/health", tags=["Health"])
async def health():
    return {
        "status": "ok",
        "service": "Sarthi AI Backend",
        "version": "1.0.0",
    }


@app.get("/", tags=["Health"])
async def root():
    return {
        "message": "Welcome to Sarthi AI Backend. Visit /docs for the full API reference.",
        "docs": "/docs",
    }
