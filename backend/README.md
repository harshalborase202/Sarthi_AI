# Sarthi AI — Backend

FastAPI backend for the Sarthi AI Government Scheme Navigator.

## Setup

### 1. Prerequisites
- Python 3.11+
- pip

### 2. Create a virtual environment
```bash
cd backend
python -m venv venv
venv\Scripts\activate    # Windows
# source venv/bin/activate  # Mac/Linux
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure environment
Copy `.env.example` to `.env` and add your Gemini API key:
```
GEMINI_API_KEY=your_actual_gemini_api_key_here
```
Get your key at: https://aistudio.google.com/apikey

### 5. Run the server
```bash
uvicorn main:app --reload --port 8000
```

The server starts at: **http://localhost:8000**

## API Documentation

Visit **http://localhost:8000/docs** for interactive Swagger UI.

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/evaluate` | Evaluate profile against all schemes |
| GET | `/api/schemes` | List all government schemes |
| GET | `/api/schemes/{id}` | Get single scheme by ID |
| GET | `/api/memory` | List all memory items |
| POST | `/api/memory` | Create new memory item |
| PUT | `/api/memory/{id}` | Update memory retention preference |
| DELETE | `/api/memory/{id}` | Delete one memory item |
| DELETE | `/api/memory/forget-all` | Forget all memories |
| POST | `/api/reasoning/stream` | SSE stream of AI reasoning steps |
| POST | `/api/chat` | Chat with Gemini AI about schemes |
| POST | `/api/search` | Semantic search via ChromaDB |
| GET | `/api/documents/{id}` | Document checklist for a scheme |
| GET | `/health` | Health check |

## Architecture

```
backend/
├── main.py              # FastAPI app, CORS, router registration
├── requirements.txt     # Python dependencies
├── .env                 # API keys (not committed)
├── routers/
│   ├── evaluate.py      # POST /api/evaluate
│   ├── schemes.py       # GET /api/schemes
│   ├── memory.py        # CRUD /api/memory
│   ├── reasoning.py     # SSE /api/reasoning/stream
│   ├── chat.py          # POST /api/chat
│   ├── search.py        # POST /api/search
│   └── documents.py     # GET /api/documents
├── services/
│   ├── gemini.py        # Gemini AI chat + streaming
│   └── chroma.py        # ChromaDB semantic search
├── models/
│   ├── db.py            # SQLite ORM (Peewee)
│   └── schemas.py       # Pydantic schemas
└── data/
    └── schemes_db.py    # All schemes + eligibility engine
```
