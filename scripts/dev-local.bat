@echo off
REM Start local development environment

echo 🚀 Starting Morganna Local Development Environment
echo ==================================================

REM Start database
echo 🗄️  Starting PostgreSQL database...
docker-compose -f docker-compose.db-only.yml up -d

REM Wait for database
echo ⏳ Waiting for database to initialize...
timeout /t 8 /nobreak >nul

REM Check if we need to install dependencies
if not exist "backend\node_modules" (
    echo 📦 Installing backend dependencies...
    cd backend && npm install && cd ..
)

if not exist "frontend\node_modules" (
    echo 📦 Installing frontend dependencies...
    cd frontend && npm install && cd ..
)

echo 🎯 Starting applications...
echo 📊 Database: http://localhost:5432
echo 🔧 Backend API: http://localhost:3001/api
echo 🌐 Frontend: http://localhost:3000
echo.
echo 💡 Tip: Each service will restart automatically when you make changes!
echo 🛑 To stop: Press Ctrl+C and run 'npm run stop:local'
echo.

REM Start backend and frontend concurrently
npx concurrently ^
  --names "BACKEND,FRONTEND" ^
  --prefix-colors "blue,green" ^
  "cd backend && npm run start:dev" ^
  "cd frontend && npm run dev"