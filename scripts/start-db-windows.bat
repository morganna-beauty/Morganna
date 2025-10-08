@echo off
echo 🚀 Iniciando Base de Datos Local para Morganna
echo =============================================

REM Verificar si Docker está ejecutándose
docker version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: Docker Desktop no está ejecutándose
    echo.
    echo 📋 Para solucionar esto:
    echo 1. Abrir Docker Desktop
    echo 2. Esperar a que aparezca "Docker Desktop is running"
    echo 3. Volver a ejecutar este comando
    echo.
    echo 💡 Si no tienes Docker Desktop instalado:
    echo    - Descargar desde: https://www.docker.com/products/docker-desktop
    echo.
    pause
    exit /b 1
)

echo ✅ Docker está ejecutándose
echo.

echo 🗄️  Iniciando PostgreSQL en Docker...
docker-compose -f docker-compose.db-only.yml up -d

if %errorlevel% neq 0 (
    echo ❌ Error iniciando la base de datos
    echo 💡 Posibles soluciones:
    echo    - Verificar que el puerto 5432 no esté ocupado
    echo    - Ejecutar: docker-compose -f docker-compose.db-only.yml down
    echo    - Intentar de nuevo
    pause
    exit /b 1
)

echo.
echo ⏳ Esperando a que la base de datos esté lista...
timeout /t 5 /nobreak >nul

REM Verificar si el contenedor está ejecutándose
docker ps | findstr morganna-postgres-local >nul
if %errorlevel% neq 0 (
    echo ❌ La base de datos no se inició correctamente
    echo 📋 Ver logs: docker logs morganna-postgres-local
    pause
    exit /b 1
)

echo ✅ ¡Base de datos PostgreSQL lista!
echo.
echo 📊 Información de conexión:
echo    Host: localhost
echo    Puerto: 5432
echo    Usuario: postgres
echo    Contraseña: postgres
echo    Base de datos: morganna_db
echo    URL: postgresql://postgres:postgres@localhost:5432/morganna_db
echo.
echo 🔍 Comandos útiles:
echo    - Ver logs: docker logs morganna-postgres-local
echo    - Detener: npm run db:stop
echo    - Reiniciar: npm run db:reset
echo.
echo 🎯 Ahora puedes iniciar el backend y frontend:
echo    - Backend: cd backend ^&^& npm run start:dev
echo    - Frontend: cd frontend ^&^& npm run dev