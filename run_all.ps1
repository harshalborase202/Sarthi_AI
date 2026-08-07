Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "         Launching Sarthi AI (BharatAI) System" -ForegroundColor Saffron
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/2] Launching FastAPI Backend (Port 8000)..." -ForegroundColor Green
Start-Process cmd -ArgumentList "/k cd /d `"$PSScriptRoot\backend`" && pip install -r requirements.txt && uvicorn main:app --reload --port 8000"

Write-Host "[2/2] Launching React Vite Frontend (Port 5173)..." -ForegroundColor Green
Start-Process cmd -ArgumentList "/k cd /d `"$PSScriptRoot`" && npm install && npm run dev"

Write-Host ""
Write-Host "Both servers started in separate windows!" -ForegroundColor Yellow
Write-Host "Backend Docs: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "Frontend App: http://localhost:5173" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
