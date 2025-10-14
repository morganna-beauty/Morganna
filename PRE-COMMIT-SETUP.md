# Pre-commit Hooks Configuration ✅ FUNCIONANDO

## 🎯 Propósito

Este sistema de pre-commit hooks asegura que todo el código que se commitea cumpla con los estándares de calidad del proyecto ejecutando ESLint automáticamente antes de cada commit.

**✅ ESTADO: COMPLETAMENTE CONFIGURADO Y FUNCIONAL**

## 🔧 Configuración

### Componentes instalados:
- **Husky**: Maneja los git hooks
- **Lint-staged**: Ejecuta comandos solo en archivos staged
- **ESLint**: Verificación y corrección automática de código

### Archivos de configuración:
- `.husky/pre-commit`: Hook que se ejecuta antes de cada commit
- `package.json`: Configuración de lint-staged y scripts

## 🚀 Funcionamiento

### Automático (en cada commit):
```bash
git add .
git commit -m "tu mensaje"
# El pre-commit hook se ejecuta automáticamente
```

### Manual (para pruebas):
```bash
# Probar lint-staged
npm run test:precommit

# Ejecutar lint en todo el proyecto
npm run lint

# Ejecutar lint con correcciones automáticas
npm run lint:fix
```

## 📋 Funcionamiento del pre-commit hook

El sistema ejecuta automáticamente las siguientes tareas en cada commit:

1. **Ejecuta lint-staged** en archivos modificados
2. **Frontend**: `next lint --fix .` en archivos `.js`, `.jsx`, `.ts`, `.tsx`
3. **Backend**: `npm run lint:fix` en archivos `.js`, `.ts`
4. **Corrige automáticamente** errores de formato y estilo
5. **Incluye las correcciones** en el commit actual
6. **Permite el commit** solo si no hay errores bloqueantes

## 🛠️ Scripts disponibles:

```json
{
  "lint": "Ejecuta lint en frontend y backend",
  "lint:fix": "Ejecuta lint con correcciones automáticas",
  "lint:frontend": "Ejecuta lint solo en frontend",
  "lint:backend": "Ejecuta lint solo en backend",
  "test:precommit": "Prueba el sistema de lint-staged"
}
```

## 🔍 Configuración actual de lint-staged

```json
{
  "lint-staged": {
    "frontend/**/*.{js,jsx,ts,tsx}": "npm run precommit:frontend",
    "backend/**/*.{js,ts}": "npm run precommit:backend"
  }
}
```

**Scripts de pre-commit configurados:**
- `precommit:frontend`: `cd frontend && npm run lint:fix .`
- `precommit:backend`: `cd backend && npm run lint:fix`

## ✅ Verificación:

Para verificar que el sistema está funcionando correctamente:

1. **Windows**: Ejecuta `scripts\test-precommit.bat`
2. **Linux/Mac**: Ejecuta `scripts/test-precommit.sh`
3. **Manual**: `npm run test:precommit`

## 🚫 Si el commit es rechazado:

1. **Revisa los errores** mostrados en la terminal
2. **Corrige manualmente** los problemas que no se pueden auto-corregir
3. **Ejecuta** `npm run lint:fix` para correcciones automáticas
4. **Vuelve a hacer commit** una vez corregidos los errores

## 🎨 Ventajas:

- ✅ **Código consistente** en todo el proyecto
- ✅ **Errores detectados** antes de llegar al repositorio
- ✅ **Correcciones automáticas** cuando es posible
- ✅ **Proceso transparente** para el desarrollador
- ✅ **Configuración una sola vez**

## 🔧 Personalización:

Para modificar qué archivos se verifican o qué comandos se ejecutan, edita la sección `lint-staged` en `package.json`.

---

**Nota**: Este sistema se ejecuta automáticamente. No requiere intervención manual una vez configurado.