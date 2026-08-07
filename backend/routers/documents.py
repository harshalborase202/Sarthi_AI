"""
GET /api/documents/{scheme_id} — Document checklist for a specific scheme.
"""
from fastapi import APIRouter, HTTPException
from data.schemes_db import SCHEMES_DATABASE

router = APIRouter(prefix="/api/documents", tags=["Documents"])


@router.get("/{scheme_id}", summary="Get required documents for a scheme")
async def get_documents(scheme_id: str):
    """
    Returns the list of required documents for applying to a specific scheme.
    Used by the DocumentUpload.jsx component.
    """
    scheme = next((s for s in SCHEMES_DATABASE if s["id"] == scheme_id), None)
    if not scheme:
        raise HTTPException(status_code=404, detail=f"Scheme '{scheme_id}' not found.")
    
    return {
        "schemeId": scheme_id,
        "schemeName": scheme["name"],
        "officialUrl": scheme["officialUrl"],
        "documents": scheme["documents"],
        "totalRequired": sum(1 for d in scheme["documents"] if d["required"]),
        "totalOptional": sum(1 for d in scheme["documents"] if not d["required"]),
    }
