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
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)

    class Meta:
        table_name = "memory_items"


class SessionModel(BaseModel):
    """Stores user sessions for traceability"""
    id = CharField(primary_key=True)
    profile_json = TextField()  # JSON string of the submitted profile
    evaluation_json = TextField()  # JSON string of eligible/ineligible result
    created_at = DateTimeField(default=datetime.utcnow)

    class Meta:
        table_name = "sessions"


def init_db():
    """Create tables if they don't exist."""
    with db:
        db.create_tables([MemoryItemModel, SessionModel], safe=True)
