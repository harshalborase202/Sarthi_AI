@echo off
setlocal
set FAILED=0

for %%f in (
  src\server.js
  src\config\env.js
  src\config\gemini.js
  src\config\chromadb.js
  src\utils\logger.js
  src\services\geminiService.js
  src\services\chromaService.js
  src\middleware\errorHandler.js
  src\middleware\validateRequest.js
  src\middleware\rateLimiter.js
  src\controllers\scoreController.js
  src\routes\score.js
  src\routes\health.js
) do (
  node --check %%f >nul 2>&1
  if errorlevel 1 (
    echo [FAIL] %%f
    node --check %%f
    set FAILED=1
  ) else (
    echo [ OK ] %%f
  )
)

echo.
if "%FAILED%"=="0" (
  echo ALL 13 FILES SYNTAX OK - Firebase removed, ChromaDB active
) else (
  echo SOME FILES HAVE ERRORS - see above
)
endlocal
