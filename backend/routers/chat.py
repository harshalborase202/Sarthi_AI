"""
POST /api/chat — AI chat endpoint powered by Gemini.
"""
from fastapi import APIRouter
from models.schemas import ChatRequest, ChatResponse
from services.gemini import chat_with_gemini

router = APIRouter(prefix="/api", tags=["Chat"])


@router.post("/chat", response_model=ChatResponse, summary="Chat with Sarthi AI")
async def chat(body: ChatRequest):
    """
    Sends a message to Gemini AI with optional user profile context.
    Returns an AI-generated response about government schemes.
    """
    profile_dict = body.profile.model_dump() if body.profile else None
    history = [h.model_dump() for h in body.history] if body.history else []
    
    reply = await chat_with_gemini(
        message=body.message,
        history=history,
        profile=profile_dict,
        language=body.language,
    )
    
    return ChatResponse(reply=reply, sources=[])
