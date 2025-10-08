# Solución de Problemas con Docker - Morganna

## 🐳 Problemas con Docker Desktop

### Error: "Docker daemon is not running"

**Síntomas:**
```
error during connect: this error may indicate that the docker daemon is not running
```

**Solución:**
1. **Iniciar Docker Desktop:**
   - Windows: Buscar "Docker Desktop" en el menú inicio y ejecutar
   - Esperar a que aparezca "Docker Desktop is running" en la bandeja del sistema

2. **Verificar que Docker está funcionando:**
   ```bash
   docker --version
   docker ps
   ```

3. **Si Docker Desktop no está instalado:**
   - Descargar desde: https://www.docker.com/products/docker-desktop
   - Instalar y reiniciar el sistema
   - Ejecutar Docker Desktop por primera vez

### Error: "Port 5432 is already in use"

**Síntomas:**
```
Error starting userland proxy: listen tcp4 0.0.0.0:5432: bind: address already in use
```

**Solución:**
1. **Ver qué está usando el puerto:**
   ```powershell
   netstat -ano | findstr :5432
   ```

2. **Detener PostgreSQL local si está ejecutándose:**
   ```powershell
   # Detener servicio de PostgreSQL
   net stop postgresql-x64-13  # o la versión que tengas
   ```

3. **Matar el proceso que usa el puerto:**
   ```powershell
   # Encontrar el PID y matarlo
   taskkill /PID <número_del_pid> /F
   ```

4. **O usar un puerto diferente:**
   - Cambiar `"5432:5432"` por `"5433:5432"` en `docker-compose.db-only.yml`
   - Actualizar la configuración del backend en `.env.local`: `DATABASE_PORT=5433`

### Error: "No space left on device"

**Síntomas:**
```
no space left on device
```

**Solución:**
1. **Limpiar imágenes y contenedores Docker:**
   ```bash
   docker system prune -a
   docker volume prune
   ```

2. **Limpiar específicamente el proyecto:**
   ```bash
   npm run db:reset
   docker system prune
   ```

## 🗄️ Problemas con PostgreSQL

### Base de datos no se conecta

**Verificaciones:**
1. **Contenedor ejecutándose:**
   ```bash
   docker ps | grep morganna-postgres-local
   ```

2. **Ver logs del contenedor:**
   ```bash
   npm run db:logs
   # o
   docker logs morganna-postgres-local
   ```

3. **Probar conexión directa:**
   ```bash
   # Usar psql si está instalado
   psql -h localhost -p 5432 -U postgres -d morganna_db
   
   # O usar docker exec
   docker exec -it morganna-postgres-local psql -U postgres -d morganna_db
   ```

### Datos perdidos después de reiniciar

**Causa:** El volumen Docker fue eliminado

**Solución:**
1. **Verificar volúmenes:**
   ```bash
   docker volume ls | grep morganna
   ```

2. **Recrear base de datos:**
   ```bash
   npm run db:reset
   npm run db:start
   ```

## 🚀 Scripts de Solución Rápida

### Para Windows (PowerShell)

**Reinicio completo:**
```powershell
# Detener todo
npm run db:stop
docker system prune -f

# Iniciar de nuevo
npm run db:start:windows
```

**Verificación del estado:**
```powershell
# Ver contenedores ejecutándose
docker ps

# Ver logs de la base de datos
npm run db:logs

# Probar conexión
telnet localhost 5432
```

### Comandos útiles

| Comando | Descripción |
|---------|-------------|
| `npm run db:start:windows` | Iniciar BD con verificaciones (Windows) |
| `npm run db:logs` | Ver logs de la base de datos |
| `docker ps` | Ver contenedores ejecutándose |
| `docker system df` | Ver uso de espacio Docker |
| `docker system prune` | Limpiar Docker |

## 📋 Lista de Verificación

Antes de reportar un problema, verificar:

- [ ] Docker Desktop está ejecutándose
- [ ] Puerto 5432 está disponible  
- [ ] Hay espacio suficiente en disco
- [ ] No hay contenedores conflictivos ejecutándose
- [ ] Los logs no muestran errores específicos

## 🆘 Soporte Adicional

Si los problemas persisten:

1. **Ejecutar diagnóstico completo:**
   ```bash
   docker --version
   docker-compose --version
   docker system info
   npm run db:logs
   ```

2. **Capturar información del sistema:**
   ```powershell
   # Windows
   systeminfo | findstr /B /C:"OS Name" /C:"OS Version"
   ```

3. **Logs completos:**
   ```bash
   docker logs morganna-postgres-local > db-logs.txt
   ```