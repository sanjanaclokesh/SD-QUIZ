@echo off
echo ========================================================
echo   Launching ArchIQ - System Design Quiz Platform
echo ========================================================
echo.
echo Starting Backend API Server (Node.js + SQLite on port 5000)...
start "ArchIQ Backend API" cmd /k "cd server && node index.js"

timeout /t 2 /nobreak > nul

echo Starting Frontend Dev Server (Vite + React on port 5173)...
start "ArchIQ Frontend" cmd /k "cd client && npm.cmd run dev"

timeout /t 3 /nobreak > nul

echo Opening browser at http://localhost:5173 ...
start http://localhost:5173

echo.
echo Both servers are running!
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
pause
