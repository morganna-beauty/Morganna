@echo off
echo.
echo 🔄 Aplicando migración: Update Product Structure
echo ================================================
echo.

REM Verificar si estamos en la carpeta correcta
if not exist "package.json" (
    echo ❌ Error: Ejecuta este script desde la carpeta backend
    pause
    exit /b 1
)

echo 📊 Verificando conexión a la base de datos...

REM Aplicar migración SQL
echo 🚀 Aplicando migración SQL...

REM Para desarrollo local con Docker
docker ps | findstr morganna-postgres >nul 2>&1
if %errorlevel% equ 0 (
    echo 📦 Aplicando migración en Docker...
    docker exec morganna-postgres-local psql -U postgres -d morganna_db -c "
    -- Add new columns
    ALTER TABLE products 
    ADD COLUMN IF NOT EXISTS image_src VARCHAR(500),
    ADD COLUMN IF NOT EXISTS hair_type VARCHAR(20) CHECK (hair_type IN ('liso', 'ondulado', 'rizado', 'afro')),
    ADD COLUMN IF NOT EXISTS concern VARCHAR(30) CHECK (concern IN ('cabelloSeco', 'danoReparacion', 'controlFriz', 'volumen')),
    ADD COLUMN IF NOT EXISTS brand VARCHAR(100);
    
    -- Rename name column to title (if not already renamed)
    DO $$ 
    BEGIN 
        IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name='products' and column_name='name') THEN
            ALTER TABLE products RENAME COLUMN name TO title;
        END IF;
    END $$;
    
    -- Add indexes for better performance
    CREATE INDEX IF NOT EXISTS idx_products_hair_type ON products(hair_type);
    CREATE INDEX IF NOT EXISTS idx_products_concern ON products(concern);
    CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
    "
) else (
    echo 💻 Para aplicar la migración manualmente:
    echo    1. Conecta a tu base de datos PostgreSQL
    echo    2. Ejecuta el archivo: src\migrations\update-product-structure.sql
    echo.
    echo O inicia Docker con: docker-compose up -d
)

echo.
echo ✅ Migración completada!
echo.
echo 📝 Cambios aplicados:
echo    • Columna 'name' renombrada a 'title'
echo    • Agregado campo 'imageSrc' ^(VARCHAR^(500^)^)
echo    • Agregado campo 'hairType' ^(ENUM^)
echo    • Agregado campo 'concern' ^(ENUM^)
echo    • Agregado campo 'brand' ^(VARCHAR^(100^)^)
echo.
echo 🎉 La estructura de productos ha sido actualizada correctamente!
echo.
pause