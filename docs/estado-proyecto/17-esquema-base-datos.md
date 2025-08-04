# 🗄️ Esquema de Base de Datos y Constraints

> **Última actualización**: Enero 31, 2025  
> **Estado**: ✅ Implementado y Validado  
> **Base de datos**: Supabase PostgreSQL

## 📋 Resumen Ejecutivo

Documentación completa del esquema de base de datos con constraints, políticas RLS, y mapeos entre formulario-API-BD implementados y funcionando.

## 🏗️ Arquitectura de Base de Datos

### 🔗 Detalles de Conexión
```bash
# Supabase Project Details
Project URL: https://rcznxhzstgclbgghnfeh.supabase.co
Database Host: db.rcznxhzstgclbgghnfeh.supabase.co
Database Port: 5432
Database Name: postgres
```

### 🔑 Variables de Entorno Requeridas
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://rcznxhzstgclbgghnfeh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjem54aHpzdGdjbGJnZ2huZmVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NDU1ODEsImV4cCI6MjA2OTIyMTU4MX0.jXw_c7FxWcVoDZc6UR9fFSkpHYFfRw5-i6iWaQwdBPE
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjem54aHpzdGdjbGJnZ2huZmVoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzY0NTU4MSwiZXhwIjoyMDY5MjIxNTgxfQ.7gVYtNhDKknvf7uYtcjOzIPxnVouvpEl8RlVfZgNq3U

# Database URL (para herramientas externas)
DATABASE_URL=postgresql://postgres:MGmG9BCIIYLsLtlA@db.rcznxhzstgclbgghnfeh.supabase.co:5432/postgres
```

### Dual-Client Setup
```typescript
// Cliente regular (respeta RLS policies)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Cliente administrativo (bypass RLS)
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
```

### 🛠️ Herramientas de Acceso Directo
```bash
# Conectar con psql
psql postgresql://postgres:MGmG9BCIIYLsLtlA@db.rcznxhzstgclbgghnfeh.supabase.co:5432/postgres

# Conectar con pgAdmin 4
Host: db.rcznxhzstgclbgghnfeh.supabase.co
Port: 5432
Database: postgres
Username: postgres
Password: MGmG9BCIIYLsLtlA

# Dashboard Supabase
https://supabase.com/dashboard/project/rcznxhzstgclbgghnfeh
```

### Uso por Endpoint
- **`/api/stories`**: `supabaseAdmin` (acceso público a historias publicadas)
- **`/api/admin/*`**: `supabaseAdmin` (operaciones administrativas)
- **Cliente frontend**: `supabase` (operaciones de usuario autenticado)

## 🗃️ Tabla Principal: `historias`

### Estructura Completa
```sql
CREATE TABLE historias (
  -- Identificadores
  id                         SERIAL PRIMARY KEY,
  codigo_unico               VARCHAR(50) NOT NULL UNIQUE,
  
  -- Contenido Principal
  titulo_provisional         VARCHAR(255) NOT NULL,
  descripcion_corta          TEXT,
  descripcion_larga          TEXT,
  testimonio_completo        TEXT,
  extracto_verbatim          TEXT,
  historia_reescrita         TEXT,
  
  -- Clasificación y Análisis
  fuente_relato              VARCHAR(50) NOT NULL,
  genero_principal           VARCHAR(50) DEFAULT 'paranormal',
  ponderacion_impacto        SMALLINT,
  potencial_adaptacion       SMALLINT,
  nivel_verificacion         VARCHAR(50) DEFAULT 'sin_verificar',
  credibilidad_score         NUMERIC(3,2),
  
  -- Temporalidad
  fecha_evento_inicio        DATE,
  fecha_evento_fin           DATE,
  hora_evento                TIME,
  epoca_historica            VARCHAR(100),
  duracion_evento_minutos    INTEGER,
  evento_recurrente          BOOLEAN DEFAULT false,
  
  -- Producción
  dificultad_produccion      SMALLINT,
  tiempo_produccion_estimado INTEGER,
  recursos_necesarios        JSONB DEFAULT '{}',
  presupuesto_estimado       NUMERIC(10,2),
  duracion_impacto_emocional VARCHAR(20),
  
  -- Derechos y Permisos
  derechos_uso               VARCHAR(50) DEFAULT 'pendiente_autorizacion',
  autorizacion_comercial     BOOLEAN DEFAULT false,
  autorizacion_adaptacion    BOOLEAN DEFAULT true,
  restricciones_uso          TEXT,
  contacto_derechos          VARCHAR(255),
  
  -- Estado y Metadatos
  estado_procesamiento       VARCHAR(50) DEFAULT 'extraida',
  fecha_publicacion          DATE,
  fecha_transcripcion        DATE,
  created_by_uid             VARCHAR(128),
  
  -- Timestamps
  created_at                 TIMESTAMPTZ DEFAULT now(),
  updated_at                 TIMESTAMPTZ DEFAULT now()
);
```

## 🔒 Constraints y Validaciones

### Check Constraints Implementados

#### **Campos Numéricos**
```sql
-- Credibilidad: 0-5 (decimal)
ALTER TABLE historias ADD CONSTRAINT historias_credibilidad_score_check 
CHECK (credibilidad_score >= 0 AND credibilidad_score <= 5);

-- Dificultad de producción: 1-5 (entero)
ALTER TABLE historias ADD CONSTRAINT historias_dificultad_produccion_check 
CHECK (dificultad_produccion >= 1 AND dificultad_produccion <= 5);

-- Ponderación de impacto: 1-5 (entero)
ALTER TABLE historias ADD CONSTRAINT historias_ponderacion_impacto_check 
CHECK (ponderacion_impacto >= 1 AND ponderacion_impacto <= 5);

-- Potencial de adaptación: 1-3 (entero)
ALTER TABLE historias ADD CONSTRAINT historias_potencial_adaptacion_check 
CHECK (potencial_adaptacion >= 1 AND potencial_adaptacion <= 3);
```

#### **Enums/Valores Permitidos**
```sql
-- Fuente del relato
ALTER TABLE historias ADD CONSTRAINT historias_fuente_relato_check 
CHECK (fuente_relato IN ('llamada_oyente', 'historia_programa', 'investigacion_propia'));

-- Nivel de verificación  
ALTER TABLE historias ADD CONSTRAINT historias_nivel_verificacion_check 
CHECK (nivel_verificacion IN (
  'sin_verificar', 'testimonio_unico', 'multiples_testigos', 
  'evidencia_fisica', 'investigacion_completa', 'verificado_experto'
));

-- Duración de impacto emocional
ALTER TABLE historias ADD CONSTRAINT historias_duracion_impacto_emocional_check 
CHECK (duracion_impacto_emocional IN ('leve', 'moderado', 'intenso', 'traumático'));

-- Derechos de uso
ALTER TABLE historias ADD CONSTRAINT historias_derechos_uso_check 
CHECK (derechos_uso IN (
  'dominio_publico', 'uso_libre', 'permiso_verbal', 
  'contrato_firmado', 'pendiente_autorizacion', 'uso_restringido'
));

-- Estado de procesamiento
ALTER TABLE historias ADD CONSTRAINT historias_estado_procesamiento_check 
CHECK (estado_procesamiento IN (
  'extraida', 'en_adaptacion', 'adaptada', 
  'en_produccion', 'producida', 'publicada'
));
```

## 🔐 Row Level Security (RLS) Policies

### Políticas Activas
```sql
-- Permitir todo al service_role
CREATE POLICY "Allow all operations to service role" ON historias
FOR ALL TO service_role USING (true);

-- Lectura pública de historias publicadas
CREATE POLICY "Historias públicas visibles" ON historias  
FOR SELECT TO public
USING (
  estado_procesamiento = 'publicada' OR 
  created_by_uid = (current_setting('request.jwt.claims', true)::json ->> 'sub')
);

-- Inserción para usuarios autenticados
CREATE POLICY "Usuarios pueden crear historias" ON historias
FOR INSERT TO public
WITH CHECK (created_by_uid = (current_setting('request.jwt.claims', true)::json ->> 'sub'));

-- Actualización solo del propietario
CREATE POLICY "Usuarios pueden editar sus historias" ON historias
FOR UPDATE TO public  
USING (created_by_uid = (current_setting('request.jwt.claims', true)::json ->> 'sub'));
```

## 🔗 Tablas Relacionadas

### Ubicaciones
```sql
CREATE TABLE ubicaciones (
  id                         SERIAL PRIMARY KEY,
  pais                       VARCHAR(100) NOT NULL DEFAULT 'Colombia',
  codigo_pais                VARCHAR(3) DEFAULT 'CO',
  nivel1_nombre              VARCHAR(100), -- Departamento
  nivel1_codigo              VARCHAR(10),
  nivel2_nombre              VARCHAR(100), -- Ciudad
  nivel2_codigo              VARCHAR(10),
  nivel3_nombre              VARCHAR(100), -- Zona/Localidad
  nivel4_nombre              VARCHAR(100), -- Barrio/Sector
  latitud                    DECIMAL(10,8),
  longitud                   DECIMAL(11,8),
  precision_metros           INTEGER DEFAULT 100,
  descripcion_lugar          TEXT,
  tipo_lugar                 VARCHAR(100),
  zona_horaria               VARCHAR(50) DEFAULT 'America/Bogota',
  altitud_metros             INTEGER,
  created_at                 TIMESTAMPTZ DEFAULT now(),
  updated_at                 TIMESTAMPTZ DEFAULT now()
);
```

### Archivos Multimedia
```sql
CREATE TABLE archivos_multimedia (
  id                         SERIAL PRIMARY KEY,
  historia_id                INTEGER REFERENCES historias(id) ON DELETE CASCADE,
  tipo_archivo               VARCHAR(20) NOT NULL, -- 'audio', 'imagen', 'video'
  url_cloudinary             TEXT,
  nombre_archivo             VARCHAR(255) NOT NULL,
  ruta_relativa              VARCHAR(500),
  uploaded_by_uid            VARCHAR(128),
  estado_procesamiento       VARCHAR(50) DEFAULT 'pendiente',
  tamano_bytes               BIGINT,
  duracion_segundos          INTEGER,
  formato                    VARCHAR(10),
  ancho_px                   INTEGER,
  alto_px                    INTEGER,
  version                    INTEGER DEFAULT 1,
  is_active                  BOOLEAN DEFAULT true,
  descripcion                TEXT,
  metadata_extra             JSONB DEFAULT '{}',
  created_at                 TIMESTAMPTZ DEFAULT now()
);
```

### Testigos
```sql
CREATE TABLE testigos (
  id                         SERIAL PRIMARY KEY,
  historia_id                INTEGER REFERENCES historias(id) ON DELETE CASCADE,
  tipo_testigo               VARCHAR(20) NOT NULL, -- 'principal', 'secundario'
  pseudonimo                 VARCHAR(100),
  edad_aprox                 INTEGER,
  ocupacion                  VARCHAR(100),
  relacion_evento            VARCHAR(200),
  presencial                 BOOLEAN DEFAULT true,
  credibilidad_estimada      INTEGER DEFAULT 5,
  factores_credibilidad      JSONB DEFAULT '{}',
  antecedentes_paranormales  BOOLEAN DEFAULT false,
  contacto_disponible        BOOLEAN DEFAULT false,
  notas_testigo              TEXT,
  created_at                 TIMESTAMPTZ DEFAULT now()
);
```

### Contexto Ambiental
```sql
CREATE TABLE contexto_ambiental (
  id                         SERIAL PRIMARY KEY,
  historia_id                INTEGER REFERENCES historias(id) ON DELETE CASCADE,
  clima_evento               VARCHAR(50),
  temperatura_aprox          INTEGER,
  humedad_aprox              INTEGER,
  numero_personas_presente   INTEGER DEFAULT 1,
  situacion_social           VARCHAR(200),
  fase_lunar                 VARCHAR(50),
  festividad_religiosa       VARCHAR(100),
  evento_historico           VARCHAR(200),
  aniversario_especial       VARCHAR(200),
  actividad_previa           TEXT,
  estado_emocional_testigos  TEXT,
  patron_temporal_detectado  BOOLEAN DEFAULT false,
  created_at                 TIMESTAMPTZ DEFAULT now()
);
```

### Factores de Credibilidad
```sql
CREATE TABLE factores_credibilidad (
  id                         SERIAL PRIMARY KEY,
  historia_id                INTEGER REFERENCES historias(id) ON DELETE CASCADE,
  multiples_testigos         INTEGER DEFAULT 1,
  evidencia_fisica           INTEGER DEFAULT 1, -- 1-5
  consistencia_relatos       INTEGER DEFAULT 3, -- 1-5
  ubicacion_verificable      INTEGER DEFAULT 2, -- 1-5
  contexto_historico         INTEGER DEFAULT 3, -- 1-5
  sobriedad_testigo          INTEGER DEFAULT 4, -- 1-5
  conocimiento_previo        INTEGER DEFAULT 3, -- 1-5
  estado_emocional           INTEGER DEFAULT 3, -- 1-5
  banderas_rojas             JSONB DEFAULT '[]',
  created_at                 TIMESTAMPTZ DEFAULT now()
);
```

### Métricas y Performance
```sql
-- Métricas iniciales
CREATE TABLE metricas_iniciales (
  id                         SERIAL PRIMARY KEY,
  historia_id                INTEGER REFERENCES historias(id) ON DELETE CASCADE,
  reproducciones             INTEGER DEFAULT 0,
  me_gusta                   INTEGER DEFAULT 0,
  comentarios                INTEGER DEFAULT 0,
  compartidos                INTEGER DEFAULT 0,
  created_at                 TIMESTAMPTZ DEFAULT now()
);

-- Performance esperado
CREATE TABLE performance_esperado (
  id                         SERIAL PRIMARY KEY,
  historia_id                INTEGER REFERENCES historias(id) ON DELETE CASCADE,
  tiempo_estimado_escucha    INTEGER DEFAULT 300, -- segundos
  audiencia_objetivo         VARCHAR(50) DEFAULT 'general',
  engagement_esperado        VARCHAR(20) DEFAULT 'medio',
  created_at                 TIMESTAMPTZ DEFAULT now()
);

-- Derechos (tabla separada para auditoría)
CREATE TABLE derechos (
  id                         SERIAL PRIMARY KEY,
  historia_id                INTEGER REFERENCES historias(id) ON DELETE CASCADE,
  derechos_uso               VARCHAR(50) DEFAULT 'permiso_verbal',
  autorizacion_comercial     BOOLEAN DEFAULT false,
  autorizacion_adaptacion    BOOLEAN DEFAULT true,
  restricciones_uso          TEXT,
  contacto_derechos          VARCHAR(255),
  created_at                 TIMESTAMPTZ DEFAULT now()
);
```

## 🔄 Mapeos Formulario ↔ Base de Datos

### Inconsistencias Corregidas
```typescript
// MAPEOS IMPLEMENTADOS EN API
const historiaData = {
  // Form → BD
  titulo_provisional: titulo,                    // ✅ Directo
  ponderacion_impacto: Math.max(1, Math.min(5, nivel_impacto || 3)), // ✅ Validado
  potencial_adaptacion: Math.max(1, Math.min(3, resto_campos.potencial_adaptacion || 2)), // ✅ Validado
  credibilidad_score: Math.max(0, Math.min(5, nivel_credibilidad || 3.5)), // ✅ Validado
  dificultad_produccion: Math.max(1, Math.min(5, dificultad_produccion || 3)), // ✅ Validado
  tiempo_produccion_estimado: tiempo_produccion_estimado || tiempo_estimado_produccion || 300, // ✅ Dual support
  duracion_impacto_emocional: mapDuracionImpacto(resto_campos.duracion_impacto_emocional), // ✅ 'media' → 'moderado'
  nivel_verificacion: validateNivelVerificacion(nivel_verificacion), // ✅ Enum validation
  fuente_relato: validateFuenteRelato(fuente_relato), // ✅ Enum validation
  derechos_uso: validateDerechosUso(resto_campos.derechos_uso), // ✅ Enum validation
};
```

### Funciones de Validación
```typescript
// Auto-validación de enums
function validateNivelVerificacion(value: string): string {
  const valid = ['sin_verificar', 'testimonio_unico', 'multiples_testigos', 
                 'evidencia_fisica', 'investigacion_completa', 'verificado_experto'];
  return valid.includes(value) ? value : 'testimonio_unico';
}

function validateFuenteRelato(value: string): string {
  const valid = ['llamada_oyente', 'historia_programa', 'investigacion_propia'];
  return valid.includes(value) ? value : 'llamada_oyente';
}

function mapDuracionImpacto(value: string): string {
  const validOptions = ['leve', 'moderado', 'intenso', 'traumático'];
  if (value === 'media') return 'moderado'; // Mapeo específico
  return validOptions.includes(value) ? value : 'moderado';
}
```

## 🎯 Estado de Validación

### Constraints Validados ✅
| Campo | Tipo | Constraint | Estado |
|-------|------|------------|--------|
| `credibilidad_score` | Decimal | 0-5 | ✅ Validado |
| `dificultad_produccion` | Integer | 1-5 | ✅ Validado |  
| `ponderacion_impacto` | Integer | 1-5 | ✅ Validado |
| `potencial_adaptacion` | Integer | 1-3 | ✅ Validado |
| `nivel_verificacion` | Enum | 6 opciones | ✅ Validado |
| `fuente_relato` | Enum | 3 opciones | ✅ Validado |
| `duracion_impacto_emocional` | Enum | 4 opciones | ✅ Validado |
| `derechos_uso` | Enum | 6 opciones | ✅ Validado |
| `estado_procesamiento` | Enum | 6 opciones | ✅ Validado |

### RLS Policies Validadas ✅
| Operación | Rol | Política | Estado |
|-----------|-----|----------|--------|
| SELECT | public | Solo publicadas + propias | ✅ Funcional |
| INSERT | authenticated | Solo con created_by_uid válido | ✅ Funcional |
| UPDATE | authenticated | Solo propietario | ✅ Funcional |
| ALL | service_role | Sin restricciones | ✅ Funcional |

### APIs Funcionando ✅
| Endpoint | Método | Función | Estado |
|----------|--------|---------|--------|
| `/api/stories` | GET | Lista filtrada | ✅ Funcional |
| `/api/stories/filters` | GET | Opciones dinámicas | ✅ Funcional |
| `/api/admin/historias` | POST | Creación admin | ✅ Funcional |
| `/api/admin/historias` | GET | Lista admin | ✅ Funcional |

## 🚀 Próximos Pasos

### Schema Extensions
- [ ] **Tabla tags/etiquetas**: Para clasificación más granular
- [ ] **Tabla ratings**: Para calificaciones de usuarios
- [ ] **Tabla comments**: Para comentarios en historias
- [ ] **Tabla playlists**: Para colecciones de historias

### Performance Optimizations  
- [ ] **Índices compuestos**: Para queries de filtrado frecuentes
- [ ] **Vistas materializadas**: Para estadísticas complejas
- [ ] **Particionado**: Por fecha para historias antiguas
- [ ] **Full-text search**: Índices GIN para búsqueda textual

### Monitoring & Analytics
- [ ] **Query performance**: Logging de queries lentas
- [ ] **Usage analytics**: Tracking de filtros populares
- [ ] **Data quality**: Alertas por constraints violados
- [ ] **Backup automation**: Snapshots programados

---

**Estado actual**: Base de datos completamente funcional con validación automática y constraints implementados. ✅