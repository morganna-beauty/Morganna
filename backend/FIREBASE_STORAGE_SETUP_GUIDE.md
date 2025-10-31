# 🔧 Solución: Error "The specified bucket does not exist"

## 🚨 **Error encontrado:**
```json
{
  "error": {
    "code": 404,
    "message": "The specified bucket does not exist."
  }
}
```

## 💡 **Causa del problema:**
Firebase Storage no está habilitado en tu proyecto de Firebase Console.

## 🛠️ **Solución paso a paso:**

### **Paso 1: Habilitar Firebase Storage**

1. **Ir a Firebase Console:**
   - Visita: https://console.firebase.google.com
   - Selecciona tu proyecto `morganna-5e831`

2. **Habilitar Storage:**
   - En el menú lateral izquierdo, busca **"Storage"**
   - Haz clic en **"Get started"**
   - Acepta los términos y condiciones

3. **Configurar reglas de seguridad:**
   ```javascript
   // Para desarrollo - TEMPORAL
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /{allPaths=**} {
         allow read, write: if true;
       }
     }
   }
   ```
   
4. **Seleccionar ubicación:**
   - Recomendado: `us-central1` (Iowa)
   - O la ubicación más cercana a tu región

### **Paso 2: Verificar configuración**

Ahora puedes probar estos endpoints para diagnosticar:

```bash
# Verificar diagnósticos de Storage
GET http://localhost:3001/api/storage/diagnostics

# Probar conexión
GET http://localhost:3001/api/storage/test-connection
```

### **Paso 3: Reglas de seguridad para producción**

Una vez que funcione, cambiar a reglas más seguras:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Permitir lectura pública de imágenes
    match /images/{imageId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Solo usuarios autenticados pueden subir
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 🔍 **Verificación después de habilitar Storage:**

1. **Reinicia tu servidor:**
   ```bash
   npm run start:dev
   ```

2. **Verifica los logs:**
   Deberías ver:
   ```
   🔥 Firebase Storage initialized with bucket: morganna-5e831.appspot.com
   ✅ Storage bucket verified: morganna-5e831.appspot.com
   ```

3. **Prueba el endpoint de diagnósticos:**
   ```bash
   curl http://localhost:3001/api/storage/diagnostics
   ```

4. **Prueba subir una imagen:**
   ```bash
   POST http://localhost:3001/api/uploads/image
   # Con un archivo de imagen
   ```

## 🎯 **Configuración adicional opcional:**

### **Variables de entorno adicionales:**
```env
# En tu .env (opcional)
FIREBASE_STORAGE_BUCKET=morganna-5e831.appspot.com
```

### **Estructura recomendada de carpetas en Storage:**
```
morganna-5e831.appspot.com/
├── images/           # Imágenes de productos
├── migrated-images/  # Imágenes migradas
├── uploads/          # Uploads generales
└── temp/            # Archivos temporales
```

## ✅ **Una vez que Storage esté habilitado:**

- El error 404 desaparecerá
- Los uploads funcionarán correctamente
- Las URLs serán del tipo: `https://storage.googleapis.com/morganna-5e831.appspot.com/images/uuid-filename.jpg`

## 🚨 **Si el problema persiste:**

1. **Verifica que el proyecto ID sea correcto en tu .env**
2. **Asegúrate de que las credenciales tengan permisos de Storage**
3. **Revisa que Firebase Storage esté en la misma región que tu proyecto**
4. **Comprueba los logs del servidor para más detalles**

¡Una vez habilitado Firebase Storage, todo debería funcionar perfectamente! 🎉