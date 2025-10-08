@echo off
echo 🔍 Verificando estado de Docker...
echo.

REM Verificar si Docker está instalado
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker no está instalado
    echo 💡 Descargar desde: https://www.docker.com/products/docker-desktop
    goto :end
)

echo ✅ Docker está instalado

REM Verificar si Docker está ejecutándose
docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Desktop no está ejecutándose
    echo 💡 Iniciar Docker Desktop y esperar a que esté listo
    goto :end
)

echo ✅ Docker Desktop está ejecutándose

REM Verificar puerto 5432
netstat -an | findstr :5432 >nul
if %errorlevel% equ 0 (
    echo ⚠️  Puerto 5432 está en uso
    echo 💡 Puede que PostgreSQL ya esté ejecutándose
    netstat -ano | findstr :5432
) else (
    echo ✅ Puerto 5432 está disponible
)

REM Verificar si nuestro contenedor ya está ejecutándose
docker ps | findstr morganna-postgres-local >nul
if %errorlevel% equ 0 (
    echo ✅ Base de datos Morganna ya está ejecutándose
    docker ps | findstr morganna-postgres-local
) else (
    echo ℹ️  Base de datos Morganna no está ejecutándose
)

echo.
echo 📊 Estado del sistema:
docker system df 2>nul

:end
echo.
pause