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
                data = json.dumps({"step": step_text, "index": index})
                yield f"data: {data}\n\n"
                index += 1
                await asyncio.sleep(0.05)  # Throttle slightly for smooth animation
        except Exception as e:
            error_data = json.dumps({"step": f"Analysis complete.", "index": index, "done": True})
            yield f"data: {error_data}\n\n"
        finally:
            done_data = json.dumps({"step": "", "index": index, "done": True})
            yield f"data: {done_data}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Access-Control-Allow-Origin": "*",
        }
    )
