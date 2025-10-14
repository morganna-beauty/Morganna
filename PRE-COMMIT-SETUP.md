# Pre-commit Hooks Configuration

## 🎯 Propósito

Este sistema de pre-commit hooks asegura que todo el código que se commitea cumpla con los estándares de calidad del proyecto ejecutando ESLint automáticamente antes de cada commit.

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

## 📋 Qué hace el pre-commit hook:

1. **Ejecuta lint-staged** en archivos modificados
2. **Frontend**: `npm run lint --fix` en archivos `.js`, `.jsx`, `.ts`, `.tsx`
3. **Backend**: `npm run lint` en archivos `.js`, `.ts`
4. **Agrega automáticamente** los archivos corregidos al commit
5. **Verifica** que no queden errores de ESLint
6. **Permite el commit** solo si todo está correcto

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

## 🔍 Configuración de lint-staged:

```json
{
  "lint-staged": {
    "frontend/**/*.{js,jsx,ts,tsx}": [
      "bash -c 'cd frontend && npm run lint -- --fix --max-warnings 0'",
      "git add"
    ],
    "backend/**/*.{js,ts}": [
      "bash -c 'cd backend && npm run lint'",
      "git add"
    ]
  }
}
```

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