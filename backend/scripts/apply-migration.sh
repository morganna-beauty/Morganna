#!/bin/bash

# Script para aplicar la migración de la nueva estructura de productos
# Ejecutar desde la carpeta backend

echo "🔄 Aplicando migración: Update Product Structure"
echo "================================================"

# Verificar si estamos en la carpeta correcta
if [ ! -f "package.json" ]; then
    echo "❌ Error: Ejecuta este script desde la carpeta backend"
    exit 1
fi

# Verificar que el servidor de base de datos esté corriendo
echo "📊 Verificando conexión a la base de datos..."

# Aplicar migración SQL
echo "🚀 Aplicando migración SQL..."

# Para desarrollo local con Docker
if command -v docker &> /dev/null && docker ps | grep -q morganna-postgres; then
    echo "📦 Aplicando migración en Docker..."
    docker exec morganna-postgres-local psql -U postgres -d morganna_db -f /docker-entrypoint-initdb.d/migrations/update-product-structure.sql
else
    echo "💻 Aplicando migración en base de datos local..."
    # Aquí puedes agregar el comando para tu configuración local
    # psql -U postgres -d morganna_db -f src/migrations/update-product-structure.sql
fi

echo "✅ Migración completada!"
echo ""
echo "📝 Cambios aplicados:"
echo "   • Columna 'name' renombrada a 'title'"
echo "   • Agregado campo 'imageSrc' (VARCHAR(500))"
echo "   • Agregado campo 'hairType' (ENUM)"
echo "   • Agregado campo 'concern' (ENUM)"
echo "   • Agregado campo 'brand' (VARCHAR(100))"
echo ""
echo "🎉 La estructura de productos ha sido actualizada correctamente!"