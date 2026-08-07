"""
POST /api/search — Semantic search across government schemes using ChromaDB.
"""
from fastapi import APIRouter
from models.schemas import SearchRequest, SearchResponse, SearchResult
from services.chroma import semantic_search

router = APIRouter(prefix="/api", tags=["Search"])


@router.post("/search", response_model=SearchResponse, summary="Semantic scheme search")
async def search(body: SearchRequest):
    """
    Performs semantic (embedding-based) search across all government schemes.
    Accepts natural language queries like 'scholarship for SC girl student in Maharashtra'.
    Returns ranked results from ChromaDB by cosine similarity.
    """
    results = semantic_search(body.query, n_results=body.n_results)
    
    return SearchResponse(
        results=[SearchResult(**r) for r in results],
        query=body.query,
    )
