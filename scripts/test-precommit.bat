@echo off
echo 🧪 Probando el sistema de pre-commit hooks...
echo.

REM Verificar que husky está configurado
if exist ".husky\pre-commit" (
    echo ✅ Husky pre-commit hook encontrado
) else (
    echo ❌ Husky pre-commit hook no encontrado
    exit /b 1
)

REM Verificar que lint-staged está configurado
findstr /c:"lint-staged" package.json >nul
if %errorlevel% equ 0 (
    echo ✅ Configuración de lint-staged encontrada
) else (
    echo ❌ Configuración de lint-staged no encontrada
    exit /b 1
)

REM Probar lint-staged
echo.
echo 🔍 Ejecutando lint-staged...
npx lint-staged --dry-run

echo.
echo ✅ Sistema de pre-commit configurado correctamente!
echo.
echo 📝 Para probar manualmente:
echo    npm run test:precommit
echo.
echo 🚀 El pre-commit se ejecutará automáticamente en cada commit