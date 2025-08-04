# 🔗 Conexión a Base de Datos - Guía Completa

> **Última actualización**: Enero 31, 2025  
> **Estado**: ✅ Configurado y Funcional  
> **Provider**: Supabase PostgreSQL

## 📋 Resumen Ejecutivo

Guía completa para conectarse a la base de datos del proyecto **Archivos Paranormales**, incluyendo credenciales, herramientas de acceso, y configuración de entorno.

## 🏗️ Detalles de Conexión

### 📊 Información del Proyecto Supabase
```bash
Project Name: Archivos Paranormales
Project ID: rcznxhzstgclbgghnfeh
Project URL: https://rcznxhzstgclbgghnfeh.supabase.co
Dashboard: https://supabase.com/dashboard/project/rcznxhzstgclbgghnfeh
```

### 🎯 Parámetros de Conexión Directa
```bash
Host: db.rcznxhzstgclbgghnfeh.supabase.co
Port: 5432
Database: postgres
Username: postgres
Password: MGmG9BCIIYLsLtlA
SSL Mode: require
```

## 🔑 Variables de Entorno

### Para Desarrollo Local (.env.local)
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://rcznxhzstgclbgghnfeh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjem54aHpzdGdjbGJnZ2huZmVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NDU1ODEsImV4cCI6MjA2OTIyMTU4MX0.jXw_c7FxWcVoDZc6UR9fFSkpHYFfRw5-i6iWaQwdBPE
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjem54aHpzdGdjbGJnZ2huZmVoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzY0NTU4MSwiZXhwIjoyMDY5MjIxNTgxfQ.7gVYtNhDKknvf7uYtcjOzIPxnVouvpEl8RlVfZgNq3U

# Database URL (para herramientas externas)
DATABASE_URL=postgresql://postgres:MGmG9BCIIYLsLtlA@db.rcznxhzstgclbgghnfeh.supabase.co:5432/postgres
```

### Para Producción (Vercel)
Las mismas variables deben configurarse en el dashboard de Vercel en la sección Environment Variables.

## 🛠️ Herramientas de Acceso

### 1. **Command Line (psql)**
```bash
# Instalación psql (si no tienes PostgreSQL)
# Ubuntu/Debian
sudo apt-get install postgresql-client

# macOS
brew install postgresql

# Conectar a la base de datos
psql postgresql://postgres:MGmG9BCIIYLsLtlA@db.rcznxhzstgclbgghnfeh.supabase.co:5432/postgres

# Comandos útiles una vez conectado
\dt                    # Listar tablas
\d historias          # Describir estructura de tabla historias
SELECT COUNT(*) FROM historias;  # Contar registros
```

### 2. **pgAdmin 4 (GUI)**
```bash
# Configuración de nueva conexión
Server Name: Archivos Paranormales
Host: db.rcznxhzstgclbgghnfeh.supabase.co
Port: 5432
Maintenance Database: postgres
Username: postgres
Password: MGmG9BCIIYLsLtlA
SSL Mode: Require
```

### 3. **DBeaver (Multiplataforma)**
```bash
# Configuración de conexión PostgreSQL
Server: db.rcznxhzstgclbgghnfeh.supabase.co
Port: 5432
Database: postgres
Username: postgres
Password: MGmG9BCIIYLsLtlA
SSL: true
```

### 4. **VS Code Extensions**
```bash
# Extensiones recomendadas
PostgreSQL: ms-ossdata.vscode-postgresql
SQLTools: mtxr.sqltools
SQLTools PostgreSQL: mtxr.sqltools-driver-pg

# String de conexión para VS Code
postgresql://postgres:MGmG9BCIIYLsLtlA@db.rcznxhzstgclbgghnfeh.supabase.co:5432/postgres?sslmode=require
```

## 🔐 Roles y Permisos

### Roles Disponibles
| Rol | Descripción | Uso |
|-----|-------------|-----|
| `anon` | Usuario anónimo | Cliente público, respeta RLS |
| `authenticated` | Usuario autenticado | Operaciones de usuario logueado |
| `service_role` | Administrador completo | APIs admin, bypass RLS |
| `postgres` | Super usuario | Acceso directo completo |

### Configuración en Código
```typescript
// /src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Cliente público (respeta RLS)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Cliente administrativo (bypass RLS)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
```

## 📊 Estado de la Base de Datos

### Tablas Principales
```sql
-- Ver todas las tablas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' ORDER BY table_name;

-- Estadísticas rápidas
SELECT 
  'historias' as tabla, COUNT(*) as registros FROM historias
UNION ALL
SELECT 
  'ubicaciones' as tabla, COUNT(*) as registros FROM ubicaciones
UNION ALL
SELECT 
  'testigos' as tabla, COUNT(*) as registros FROM testigos;
```

### Constraints Activos
```sql
-- Ver constraints de la tabla historias
SELECT 
  constraint_name, 
  constraint_type 
FROM information_schema.table_constraints 
WHERE table_name = 'historias';
```

### RLS Policies
```sql
-- Ver políticas RLS activas
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles 
FROM pg_policies 
WHERE tablename = 'historias';
```

## 🚀 Backup y Restauración

### Backup Manual
```bash
# Backup completo
pg_dump postgresql://postgres:MGmG9BCIIYLsLtlA@db.rcznxhzstgclbgghnfeh.supabase.co:5432/postgres > backup_$(date +%Y%m%d).sql

# Backup solo datos
pg_dump --data-only postgresql://postgres:MGmG9BCIIYLsLtlA@db.rcznxhzstgclbgghnfeh.supabase.co:5432/postgres > data_backup_$(date +%Y%m%d).sql

# Backup solo schema
pg_dump --schema-only postgresql://postgres:MGmG9BCIIYLsLtlA@db.rcznxhzstgclbgghnfeh.supabase.co:5432/postgres > schema_backup_$(date +%Y%m%d).sql
```

### Restauración
```bash
# Restaurar desde backup
psql postgresql://postgres:MGmG9BCIIYLsLtlA@db.rcznxhzstgclbgghnfeh.supabase.co:5432/postgres < backup_file.sql
```

## 📈 Monitoreo y Performance

### Queries Útiles para Desarrollo
```sql
-- Historias más recientes
SELECT id, titulo_provisional, created_at 
FROM historias 
ORDER BY created_at DESC 
LIMIT 10;

-- Estadísticas por género
SELECT 
  genero_principal, 
  COUNT(*) as cantidad,
  AVG(ponderacion_impacto) as impacto_promedio
FROM historias 
GROUP BY genero_principal;

-- Verificar RLS policies
SELECT * FROM historias; -- Como anon (debería filtrar)
```

### Dashboard de Supabase
- **URL**: https://supabase.com/dashboard/project/rcznxhzstgclbgghnfeh
- **Database**: Tab para queries SQL directo
- **Authentication**: Gestión de usuarios
- **Storage**: Archivos multimedia
- **Edge Functions**: APIs serverless

## 🔧 Configuración de Desarrollo

### Setup Inicial
```bash
# 1. Clonar proyecto
git clone <repository-url>
cd ArchivosParanormales

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con las credenciales de arriba

# 4. Verificar conexión
npm run dev
# Probar endpoints: http://localhost:3000/api/stories
```

### Troubleshooting Común
```bash
# Error: "JWT expired"
# Solución: Regenerar tokens en dashboard Supabase

# Error: "Connection refused"
# Solución: Verificar SSL mode y firewall

# Error: "Permission denied"
# Solución: Verificar RLS policies y rol de usuario
```

## 🛡️ Seguridad

### Mejores Prácticas
- ✅ **Nunca exponer SERVICE_ROLE_KEY** en cliente
- ✅ **Usar RLS policies** para acceso granular
- ✅ **Rotación de passwords** cada 6 meses
- ✅ **Monitoreo de queries** sospechosas
- ✅ **Backup automático** configurado

### Acceso de Emergencia
En caso de pérdida de credenciales:
1. Acceder a dashboard Supabase con cuenta de Google
2. Regenerar API keys en Settings > API
3. Resetear password de database si necesario

---

**Próxima actualización**: Configuración de réplicas y alta disponibilidad para producción.