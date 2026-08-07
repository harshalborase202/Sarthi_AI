"""
Pydantic schemas for Sarthi AI backend.
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import datetime


# ─── Profile ──────────────────────────────────────────────────────────────────

class UserProfile(BaseModel):
    age: str = Field(..., example="22")
    gender: str = Field(..., example="female")
    state: str = Field(..., example="Maharashtra")
    occupation: str = Field(..., example="student")
    income: str = Field(..., example="250000")
    category: str = Field(..., example="sc")
    education: str = Field(..., example="graduate")
    disability: Optional[str] = Field("no", example="no")


# ─── Evaluate ─────────────────────────────────────────────────────────────────

class FailedCriterion(BaseModel):
    ruleName: str
    userValue: str
    requiredValue: str
    gap: str


class DocumentItem(BaseModel):
    id: str
    name: str
    required: bool


class DecisionNode(BaseModel):
    id: str
    label: str
    status: str
    detail: str


class DecisionTree(BaseModel):
    nodes: List[DecisionNode]


class SchemeBase(BaseModel):
    id: str
    name: str
    govtLevel: str
    ministry: str
    category: str
    shortDesc: str
    badge: str
    officialUrl: str
    targetGroup: str
    benefitAmount: str
    maxIncome: int
    minAge: int
    maxAge: int
    allowedStates: List[str]
    allowedGender: List[str]
    allowedCategory: List[str]
    allowedOccupation: List[str]
    whyQualify: List[str]
    documents: List[DocumentItem]
    decisionTree: DecisionTree


class EligibleScheme(SchemeBase):
    matchScore: int


class IneligibleScheme(SchemeBase):
    failedCriteria: List[FailedCriterion]


class EvaluateResponse(BaseModel):
    eligible: List[EligibleScheme]
    ineligible: List[IneligibleScheme]


# ─── Memory ───────────────────────────────────────────────────────────────────

MemoryStatus = Literal["until_delete", "30_days", "session_only", "never_stored"]


class MemoryCreateRequest(BaseModel):
    title: str
    speechBubble: str
    iconName: str = "ShieldCheck"
    status: MemoryStatus = "until_delete"
    dataKey: Optional[str] = None
    dataValue: Optional[str] = None


class MemoryUpdateRequest(BaseModel):
    status: MemoryStatus


class MemoryItem(BaseModel):
    id: str
    title: str
    speechBubble: str
    iconName: str
    status: MemoryStatus
    badgeText: str
    badgeStyle: str
    dataKey: Optional[str]
    dataValue: Optional[str]
    createdAt: str
    updatedAt: str


# ─── Chat ─────────────────────────────────────────────────────────────────────

class ChatMessage(BaseModel):
    role: Literal["user", "model"]
    content: str


class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []
    profile: Optional[UserProfile] = None
    language: str = "EN"


class ChatResponse(BaseModel):
    reply: str
    sources: Optional[List[str]] = []


# ─── Search ───────────────────────────────────────────────────────────────────

class SearchRequest(BaseModel):
    query: str
    n_results: int = 5
    profile: Optional[UserProfile] = None


class SearchResult(BaseModel):
    id: str
    name: str
    shortDesc: str
    score: float
    category: str


class SearchResponse(BaseModel):
    results: List[SearchResult]
    query: str


# ─── Reasoning ────────────────────────────────────────────────────────────────

class ReasoningRequest(BaseModel):
    profile: UserProfile
    language: str = "EN"
