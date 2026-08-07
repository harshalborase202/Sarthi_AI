"""
POST /api/reasoning/stream — Server-Sent Events stream of AI reasoning steps.
Used by AIReasoningModal.jsx to show live explainability animation.
"""
import json
import asyncio
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from models.schemas import ReasoningRequest
from services.gemini import stream_reasoning

router = APIRouter(prefix="/api/reasoning", tags=["Reasoning"])


@router.post("/stream", summary="Stream AI reasoning steps via SSE")
async def reasoning_stream(body: ReasoningRequest):
    """
    Returns a Server-Sent Events (SSE) stream.
    Each event is a JSON object: { "step": "...", "index": N }
    The frontend AIReasoningModal.jsx reads these events to animate the reasoning display.
    """
    async def event_generator():
        index = 0
        try:
            async for step_text in stream_reasoning(body.profile.model_dump(), body.language):
                payload = json.dumps({"step": step_text, "index": index})
                yield f"data: {payload}\n\n"
                index += 1
                await asyncio.sleep(0.3)
        except Exception as e:
            err_payload = json.dumps({"step": f"Reasoning stream fallback: {str(e)}", "index": index})
            yield f"data: {err_payload}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")
