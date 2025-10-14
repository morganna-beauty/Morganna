#!/bin/bash

echo "🧪 Probando el sistema de pre-commit hooks..."
echo ""

# Verificar que husky está configurado
if [ -f ".husky/pre-commit" ]; then
    echo "✅ Husky pre-commit hook encontrado"
else
    echo "❌ Husky pre-commit hook no encontrado"
    exit 1
fi

# Verificar que lint-staged está configurado
if grep -q "lint-staged" package.json; then
    echo "✅ Configuración de lint-staged encontrada"
else
    echo "❌ Configuración de lint-staged no encontrada"
    exit 1
fi

# Probar lint-staged
echo ""
echo "🔍 Ejecutando lint-staged..."
npx lint-staged --dry-run

echo ""
echo "✅ Sistema de pre-commit configurado correctamente!"
echo ""
echo "📝 Para probar manualmente:"
echo "   npm run test:precommit"
echo ""
echo "🚀 El pre-commit se ejecutará automáticamente en cada commit"