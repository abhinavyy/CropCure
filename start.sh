#!/bin/bash
# Unified start script for Unix/Linux/Mac

echo ""
echo "🌱 CropCure - Starting Application..."
echo ""

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found. Please install Python 3.8+"
    exit 1
fi

# Check if frontend dependencies are installed
if [ ! -d "frontend/node_modules" ]; then
    echo "⚠️  Frontend dependencies not installed. Installing..."
    cd frontend
    npm install
    cd ..
fi

# Check and install backend dependencies
echo "Checking backend dependencies..."
cd backend
python3 check_dependencies.py
if [ $? -ne 0 ]; then
    echo "Installing backend dependencies..."
    pip3 install -r requirements.txt
fi
cd ..

# Start backend in background
echo "🚀 Starting Backend Server (Flask)..."
cd backend
python3 app.py &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🚀 Starting Frontend Server (Vite)..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Both servers are starting!"
echo "   Backend: http://127.0.0.1:10000"
echo "   Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Trap Ctrl+C
trap cleanup SIGINT SIGTERM

# Wait for processes
wait
