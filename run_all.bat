@echo off
echo ========================================================
echo          Launching Sarthi AI (BharatAI) System
echo ========================================================
echo.

echo [1/2] Starting FastAPI Backend on port 8000...
start "Sarthi AI Backend" cmd /k "cd /d %~dp0backend && pip install -r requirements.txt && uvicorn main:app --reload --port 8000"

echo [2/2] Starting React Vite Frontend on port 5173...
start "Sarthi AI Frontend" cmd /k "cd /d %~dp0 && npm install && npm run dev"

echo.
echo Both servers started in separate terminal windows!
echo Backend API Docs: http://localhost:8000/docs
echo Frontend App:     http://localhost:5173
echo ========================================================
