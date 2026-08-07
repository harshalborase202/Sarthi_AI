"""
POST /api/evaluate — Evaluate a citizen profile against all schemes.
Returns eligible and ineligible lists with detailed reasoning.
"""
from fastapi import APIRouter
from models.schemas import UserProfile, EvaluateResponse
from data.schemes_db import evaluate_profile

router = APIRouter(prefix="/api", tags=["Evaluate"])


@router.post("/evaluate", response_model=EvaluateResponse)
async def evaluate(profile: UserProfile):
    """
    Evaluates a citizen's profile against all government schemes in the database.
    Returns:
    - `eligible`: Schemes the user qualifies for, sorted by match score.
    - `ineligible`: Schemes the user doesn't qualify for, with exact failure reasons.
    """
    result = evaluate_profile(profile.model_dump())
    # Sort eligible by matchScore descending
    result["eligible"].sort(key=lambda x: x.get("matchScore", 0), reverse=True)
    return result
