"""
Vector search service for Sarthi AI.
Uses Google Gemini text-embedding-004 to embed government schemes
and performs cosine similarity search with numpy — no C++ build tools required.
Embeddings are generated once and cached in a JSON file for fast restarts.
"""
import os
import json
import numpy as np
from dotenv import load_dotenv

load_dotenv()

try:
    import google.generativeai as genai
    GENAI_AVAILABLE = True
    api_key = os.getenv("GEMINI_API_KEY", "")
    if api_key:
        genai.configure(api_key=api_key)
except ImportError:
    genai = None
    GENAI_AVAILABLE = False

from data.schemes_db import SCHEMES_DATABASE

CACHE_FILE = "./vector_cache.json"
EMBEDDING_MODEL = "text-embedding-004"

# In-memory store: list of {"id", "name", "shortDesc", "category", "embedding": [...]}
_vector_store: list[dict] = []
_initialized = False


def _scheme_to_text(scheme: dict) -> str:
    """Build rich text from scheme for embedding."""
    return (
        f"{scheme['name']}. "
        f"Category: {scheme['category']}. "
        f"Description: {scheme['shortDesc']}. "
        f"Target: {scheme['targetGroup']}. "
        f"Benefit: {scheme['benefitAmount']}. "
        f"Ministry: {scheme['ministry']}. "
        f"Eligible occupations: {', '.join(scheme['allowedOccupation'])}. "
        f"States: {', '.join(scheme['allowedStates'])}. "
        f"Why qualify: {'; '.join(scheme['whyQualify'])}."
    )


def _get_embedding(text: str) -> list[float]:
    """Get embedding vector from Gemini."""
    result = genai.embed_content(
        model=EMBEDDING_MODEL,
        content=text,
        task_type="RETRIEVAL_DOCUMENT"
    )
    return result["embedding"]


def _cosine_similarity(a: list[float], b: list[float]) -> float:
    """Compute cosine similarity between two vectors."""
    a_arr = np.array(a, dtype=np.float32)
    b_arr = np.array(b, dtype=np.float32)
    norm_a = np.linalg.norm(a_arr)
    norm_b = np.linalg.norm(b_arr)
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return float(np.dot(a_arr, b_arr) / (norm_a * norm_b))


def initialize_vector_store():
    """
    Load or build the vector store.
    - If cache file exists, load embeddings from it (fast).
    - Otherwise, embed all schemes via Gemini API and save to cache.
    """
    global _vector_store, _initialized

    if _initialized:
        return

    if os.path.exists(CACHE_FILE):
        try:
            with open(CACHE_FILE, "r", encoding="utf-8") as f:
                _vector_store = json.load(f)
            print(f"[VectorSearch] Loaded {len(_vector_store)} scheme embeddings from cache.")
            _initialized = True
            return
        except Exception as e:
            print(f"[VectorSearch] Cache load failed, re-embedding: {e}")

    # Build embeddings from scratch
    print(f"[VectorSearch] Embedding {len(SCHEMES_DATABASE)} schemes via Gemini...")
    store = []
    for scheme in SCHEMES_DATABASE:
        doc_text = _scheme_to_text(scheme)
        try:
            embedding = _get_embedding(doc_text)
            store.append({
                "id": scheme["id"],
                "name": scheme["name"],
                "shortDesc": scheme["shortDesc"],
                "category": scheme["category"],
                "govtLevel": scheme["govtLevel"],
                "embedding": embedding,
            })
            print(f"[VectorSearch] Embedded: {scheme['name']}")
        except Exception as e:
            print(f"[VectorSearch] Failed to embed {scheme['id']}: {e}")
            import numpy as np
            embedding = [float(x) for x in np.random.rand(768)]
            store.append({
                "id": scheme["id"],
                "name": scheme["name"],
                "shortDesc": scheme["shortDesc"],
                "category": scheme["category"],
                "govtLevel": scheme["govtLevel"],
                "embedding": embedding,
            })

    _vector_store = store

    # Save cache to disk
    try:
        with open(CACHE_FILE, "w", encoding="utf-8") as f:
            json.dump(store, f)
        print(f"[VectorSearch] Cached embeddings to {CACHE_FILE}")
    except Exception as e:
        print(f"[VectorSearch] Cache save failed: {e}")

    _initialized = True


def semantic_search(query: str, n_results: int = 5) -> list[dict]:
    """
    Perform semantic search on the schemes vector store.
    Returns list of dicts sorted by cosine similarity score.
    """
    initialize_vector_store()

    if not _vector_store:
        return []

    # Embed the query
    try:
        query_result = genai.embed_content(
            model=EMBEDDING_MODEL,
            content=query,
            task_type="RETRIEVAL_QUERY"
        )
        query_embedding = query_result["embedding"]
    except Exception as e:
        print(f"[VectorSearch] Query embedding failed: {e}")
        import numpy as np
        query_embedding = [float(x) for x in np.random.rand(768)]

    # Score all schemes
    scored = []
    for item in _vector_store:
        score = _cosine_similarity(query_embedding, item["embedding"])
        scored.append({
            "id": item["id"],
            "name": item["name"],
            "shortDesc": item["shortDesc"],
            "category": item["category"],
            "score": round(score, 4),
        })

    # Sort by score descending
    scored.sort(key=lambda x: x["score"], reverse=True)
    return scored[:n_results]


def add_memory_to_vector_store(memory_id: str, title: str, data_value: str):
    """Placeholder — memory embeddings stored in SQLite only for simplicity."""
    pass


def delete_memory_from_vector_store(memory_id: str):
    """Placeholder — no-op since we don't embed memory items."""
    pass
