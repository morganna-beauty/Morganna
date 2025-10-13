@echo off
echo Starting Morganna Docker Services...
echo.

REM Check if Docker is running
docker version >nul 2>&1
if errorlevel 1 (
    echo Docker is not running or not installed.
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo Docker is running. Starting only Docker services...
echo.

REM Start Docker services defined in docker-compose.yml without frontend/backend local scripts
docker-compose up --build

echo.
echo Docker services stopped.
pause
