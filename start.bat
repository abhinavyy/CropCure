@echo off
REM Unified start script for Windows
echo.
echo 🌱 CropCure - Starting Application...
echo.

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python not found. Please install Python 3.8+
    exit /b 1
)

REM Check if frontend dependencies are installed
if not exist "frontend\node_modules" (
    echo ⚠️  Frontend dependencies not installed. Installing...
    cd frontend
    call npm install
    cd ..
)

REM Check and install backend dependencies
echo Checking backend dependencies...
cd backend
python check_dependencies.py
if errorlevel 1 (
    echo Installing backend dependencies...
    pip install -r requirements.txt
)
cd ..

REM Start both servers
echo 🚀 Starting Backend Server (Flask)...
start "CropCure Backend" cmd /k "cd backend && python app.py"

timeout /t 3 /nobreak >nul

echo 🚀 Starting Frontend Server (Vite)...
start "CropCure Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ✅ Both servers are starting!
echo    Backend: http://127.0.0.1:10000
echo    Frontend: http://localhost:5173 (or check terminal)
echo.
echo Press Ctrl+C in each terminal window to stop the servers.

pause
