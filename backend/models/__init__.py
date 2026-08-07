"""
Models package for Sarthi AI backend.
Provides database models and Pydantic schemas.
"""
from .db import init_db, db, BaseModel, MemoryItemModel
from .schemas import (
    UserProfile,
    FailedCriterion,
    DocumentItem,
    DecisionNode,
    DecisionTree,
    SchemeBase,
    EligibleScheme,
    IneligibleScheme,
    EvaluateResponse,
    MemoryStatus,
    MemoryCreateRequest,
    MemoryUpdateRequest,
    MemoryItem,
    ChatMessage,
    ChatRequest,
    ChatResponse,
    SearchRequest,
    SearchResult,
)

__all__ = [
    "init_db",
    "db",
    "BaseModel",
    "MemoryItemModel",
    "UserProfile",
    "FailedCriterion",
    "DocumentItem",
    "DecisionNode",
    "DecisionTree",
    "SchemeBase",
    "EligibleScheme",
    "IneligibleScheme",
    "EvaluateResponse",
    "MemoryStatus",
    "MemoryCreateRequest",
    "MemoryUpdateRequest",
    "MemoryItem",
    "ChatMessage",
    "ChatRequest",
    "ChatResponse",
    "SearchRequest",
    "SearchResult",
]
