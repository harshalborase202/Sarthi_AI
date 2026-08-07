"""
GET /api/schemes          — List all schemes
GET /api/schemes/{id}     — Get single scheme by ID
"""
from fastapi import APIRouter, HTTPException
from data.schemes_db import SCHEMES_DATABASE

router = APIRouter(prefix="/api/schemes", tags=["Schemes"])


@router.get("", summary="List all government schemes")
async def list_schemes():
    """Returns the full list of government schemes in the database."""
    return {"schemes": SCHEMES_DATABASE, "total": len(SCHEMES_DATABASE)}


@router.get("/{scheme_id}", summary="Get scheme by ID")
async def get_scheme(scheme_id: str):
    """Returns detailed information for a specific scheme by its ID."""
    scheme = next((s for s in SCHEMES_DATABASE if s["id"] == scheme_id), None)
    if not scheme:
        raise HTTPException(status_code=404, detail=f"Scheme '{scheme_id}' not found.")
    return scheme
