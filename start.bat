@echo off
echo Starting Morganna Full-Stack Application...
echo.

REM Check if Docker is running
docker version >nul 2>&1
if errorlevel 1 (
    echo Docker is not running or not installed.
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo Docker is running. Starting services...
echo.

REM Start the application
docker-compose up --build

echo.
echo Application stopped.
pause
