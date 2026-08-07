"""
GET    /api/memory           — List all memory items
POST   /api/memory           — Create a new memory item
PUT    /api/memory/{id}      — Update memory item retention status
DELETE /api/memory/{id}      — Delete one memory item
DELETE /api/memory/forget-all — Delete all memory items
"""
import uuid
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException
from models.db import MemoryItemModel, db
from models.schemas import MemoryCreateRequest, MemoryUpdateRequest, MemoryItem
from services.chroma import add_memory_to_vector_store, delete_memory_from_vector_store

router = APIRouter(prefix="/api/memory", tags=["Memory"])

STATUS_BADGE_MAP = {
    "until_delete": {
        "text": "Remembered Until Deleted",
        "style": "bg-primary/10 text-primary border-primary/20"
    },
    "30_days": {
        "text": "Remembered for 30 Days",
        "style": "bg-amber-50 text-amber-800 border-amber-200"
    },
    "session_only": {
        "text": "Session Only",
        "style": "bg-slate-100 text-slate-600 border-slate-200"
    },
    "never_stored": {
        "text": "Not Remembered",
        "style": "bg-rose-50 text-rose-700 border-rose-200"
    },
}


def _serialize(item: MemoryItemModel) -> dict:
    badge_info = STATUS_BADGE_MAP.get(item.status, STATUS_BADGE_MAP["until_delete"])
    return {
        "id": item.id,
        "title": item.title,
        "speechBubble": item.speech_bubble,
        "iconName": item.icon_name,
        "status": item.status,
        "badgeText": badge_info["text"],
        "badgeStyle": badge_info["style"],
        "dataKey": item.data_key,
        "dataValue": item.data_value,
        "createdAt": item.created_at.isoformat(),
        "updatedAt": item.updated_at.isoformat(),
    }


def _purge_expired():
    """Purge 30-day items that have exceeded their retention window."""
    cutoff = datetime.utcnow() - timedelta(days=30)
    expired = (
        MemoryItemModel
        .select()
        .where(
            (MemoryItemModel.status == "30_days") &
            (MemoryItemModel.created_at < cutoff)
        )
    )
    for item in expired:
        delete_memory_from_vector_store(item.id)
        item.delete_instance()


@router.get("", summary="List all memory items")
async def list_memory():
    """Returns all persisted memory/preference items shown in MemoryCenter."""
    with db:
        _purge_expired()
        items = list(MemoryItemModel.select().order_by(MemoryItemModel.created_at.desc()))
    return {"memories": [_serialize(i) for i in items], "total": len(items)}


@router.post("", summary="Create a memory item", status_code=201)
async def create_memory(body: MemoryCreateRequest):
    """Creates a new memory card (e.g., 'Age: 22 years — Remembered for 30 days')."""
    item_id = str(uuid.uuid4())
    now = datetime.utcnow()
    with db:
        item = MemoryItemModel.create(
            id=item_id,
            title=body.title,
            speech_bubble=body.speechBubble,
            icon_name=body.iconName,
            status=body.status,
            data_key=body.dataKey,
            data_value=body.dataValue,
            created_at=now,
            updated_at=now,
        )
    # Also index in ChromaDB for AI context retrieval
    if body.dataValue:
        add_memory_to_vector_store(item_id, body.title, body.dataValue)
    return _serialize(item)


@router.put("/{memory_id}", summary="Update memory retention preference")
async def update_memory(memory_id: str, body: MemoryUpdateRequest):
    """Updates the retention status of a memory item (e.g., change from 30_days to until_delete)."""
    with db:
        item = MemoryItemModel.get_or_none(MemoryItemModel.id == memory_id)
        if not item:
            raise HTTPException(status_code=404, detail="Memory item not found.")
        item.status = body.status
        item.updated_at = datetime.utcnow()
        item.save()
    return _serialize(item)


@router.delete("/forget-all", summary="Delete all memory items")
async def forget_all():
    """Deletes all memory items — used by the 'Forget Everything' button in MemoryCenter."""
    with db:
        all_items = list(MemoryItemModel.select())
        for item in all_items:
            delete_memory_from_vector_store(item.id)
        MemoryItemModel.delete().execute()
    return {"message": "All memories forgotten.", "deleted": len(all_items)}


@router.delete("/{memory_id}", summary="Delete a single memory item")
async def delete_memory(memory_id: str):
    """Deletes a specific memory item by ID."""
    with db:
        item = MemoryItemModel.get_or_none(MemoryItemModel.id == memory_id)
        if not item:
            raise HTTPException(status_code=404, detail="Memory item not found.")
        delete_memory_from_vector_store(memory_id)
        item.delete_instance()
    return {"message": f"Memory '{memory_id}' deleted."}
