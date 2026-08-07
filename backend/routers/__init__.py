"""
Routers package for Sarthi AI backend.
"""
from .evaluate import router as evaluate_router
from .schemes import router as schemes_router
from .memory import router as memory_router
from .reasoning import router as reasoning_router
from .chat import router as chat_router
from .search import router as search_router
from .documents import router as documents_router
from .ocr import router as ocr_router

__all__ = [
    "evaluate_router",
    "schemes_router",
    "memory_router",
    "reasoning_router",
    "chat_router",
    "search_router",
    "documents_router",
    "ocr_router",
]
