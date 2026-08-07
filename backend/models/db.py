"""
SQLite database models using Peewee ORM.
"""
import os
from datetime import datetime
from peewee import (
    SqliteDatabase,
    Model,
    CharField,
    TextField,
    DateTimeField,
    BooleanField,
)
from dotenv import load_dotenv

load_dotenv()

DB_PATH = os.getenv("DATABASE_PATH", "./sarthi_ai.db")
db = SqliteDatabase(DB_PATH)


class BaseModel(Model):
    class Meta:
        database = db


class MemoryItemModel(BaseModel):
    """Persisted memory / profile preference cards shown in MemoryCenter.jsx"""
    id = CharField(primary_key=True)
    title = CharField()
    speech_bubble = TextField()
    icon_name = CharField(default="ShieldCheck")
    status = CharField(default="until_delete")  # until_delete | 30_days | session_only | never_stored
    data_key = CharField(null=True)
    data_value = TextField(null=True)
    expiry_date = CharField(null=True)
    created_at = DateTimeField(default=datetime.now)
    updated_at = DateTimeField(default=datetime.now)

    class Meta:
        table_name = "memory_items"


class DocumentVerificationModel(BaseModel):
    """Uploaded/scanned document verification records"""
    id = CharField(primary_key=True)
    doc_type = CharField()
    full_name = CharField(null=True)
    identifier_number = CharField(null=True)
    issue_date = CharField(null=True)
    authority = CharField(null=True)
    retention_choice = CharField(default="use_once")
    confidence_score = CharField(default="0.95")
    verified_at = DateTimeField(default=datetime.now)

    class Meta:
        table_name = "document_verifications"


def init_db():
    db.connect(reuse_if_open=True)
    db.create_tables([MemoryItemModel, DocumentVerificationModel], safe=True)
