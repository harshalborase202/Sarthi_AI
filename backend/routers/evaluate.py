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
    Returns both eligible schemes (with match scores) and ineligible schemes (with failed criteria audit).
    """
    result = evaluate_profile(profile.model_dump())
    return result
