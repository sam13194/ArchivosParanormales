-- =====================================================
-- CREAR TABLAS FALTANTES PARA ARCHIVOS PARANORMALES
-- Ejecutar en Supabase SQL Console
-- =====================================================

-- ========== 1. CREAR TABLA HISTORIAS ==========
CREATE TABLE IF NOT EXISTS historias (
    id SERIAL PRIMARY KEY,
    
    -- Información básica
    codigo_unico VARCHAR(50) UNIQUE,
    titulo_provisional VARCHAR(200) NOT NULL,
    descripcion_corta TEXT NOT NULL,
    descripcion_larga TEXT,
    testimonio_completo TEXT NOT NULL,
    extracto_verbatim TEXT,
    historia_reescrita TEXT,
    suceso_principal_resumen TEXT,
    
    -- Referencias externas
    ubicacion_id INTEGER,
    created_by_uid VARCHAR(100),
    
    -- Clasificación
    fuente_relato VARCHAR(50) DEFAULT 'llamada_oyente',
    genero_principal VARCHAR(50) DEFAULT 'fantasmas_apariciones',
    nivel_credibilidad INTEGER DEFAULT 5 CHECK (nivel_credibilidad >= 1 AND nivel_credibilidad <= 10),
    nivel_impacto INTEGER DEFAULT 5 CHECK (nivel_impacto >= 1 AND nivel_impacto <= 10),
    nivel_verificacion VARCHAR(50) DEFAULT 'testimonio_unico',
    
    -- Fechas y tiempo
    fecha_sucesos TIMESTAMP WITH TIME ZONE,
    hora_evento TIME,
    duracion_evento_minutos INTEGER,
    fecha_transcripcion DATE DEFAULT CURRENT_DATE,
    
    -- Metadata adicional
    epoca_historica VARCHAR(50) DEFAULT 'Contemporánea',
    protagonistas_descripcion TEXT,
    palabras_clave_patron TEXT[] DEFAULT '{}',
    longitud_extracto_palabras INTEGER,
    duracion_impacto_emocional VARCHAR(20) DEFAULT 'media',
    presupuesto_estimado DECIMAL(10,2),
    notas_adicionales TEXT,
    
    -- Estado y procesamiento
    estado_procesamiento VARCHAR(30) DEFAULT 'pendiente_revision',
    fecha_publicacion TIMESTAMP WITH TIME ZONE,
    moderado_por_uid VARCHAR(100),
    fecha_moderacion TIMESTAMP WITH TIME ZONE,
    notas_moderacion TEXT,
    
    -- Hash para similitudes
    hash_similarity VARCHAR(64),
    
    -- Timestamps
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Índices únicos
    CONSTRAINT uk_historias_codigo_unico UNIQUE (codigo_unico)
);

-- ========== 2. CREAR TABLA UBICACIONES ==========
CREATE TABLE IF NOT EXISTS ubicaciones (
    id SERIAL PRIMARY KEY,
    
    -- Información geográfica básica
    pais VARCHAR(100) DEFAULT 'Colombia',
    codigo_pais VARCHAR(3) DEFAULT 'CO',
    nivel1_nombre VARCHAR(100), -- Departamento/Estado
    nivel1_codigo VARCHAR(10),
    nivel2_nombre VARCHAR(100), -- Ciudad/Municipio
    nivel2_codigo VARCHAR(10),
    nivel3_nombre VARCHAR(100), -- Localidad/Barrio
    nivel4_nombre VARCHAR(100), -- Lugar específico
    
    -- Descripción del lugar
    descripcion_lugar TEXT,
    tipo_lugar VARCHAR(50),
    
    -- Coordenadas
    latitud DECIMAL(10, 8),
    longitud DECIMAL(11, 8),
    precision_metros INTEGER DEFAULT 100,
    altitud_metros INTEGER,
    
    -- Información adicional
    zona_horaria VARCHAR(50) DEFAULT 'America/Bogota',
    actividad_paranormal_reportada BOOLEAN DEFAULT FALSE,
    numero_historias_reportadas INTEGER DEFAULT 1,
    primera_actividad_reportada DATE,
    ultima_actividad_reportada DATE,
    fuente_verificacion VARCHAR(100),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========== 3. CREAR TABLA USUARIOS ==========
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    
    -- Información de Firebase
    firebase_uid VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    
    -- Información personal
    displayName VARCHAR(255),
    photoURL TEXT,
    
    -- Sistema de roles
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'moderator', 'user')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'banned')),
    
    -- Preferencias
    preferencias JSONB DEFAULT '{}',
    
    -- Timestamps
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ultimo_acceso TIMESTAMP WITH TIME ZONE,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Índices únicos
    CONSTRAINT uk_usuarios_firebase_uid UNIQUE (firebase_uid),
    CONSTRAINT uk_usuarios_email UNIQUE (email)
);

-- ========== 4. CREAR TABLA TESTIGOS ==========
CREATE TABLE IF NOT EXISTS testigos (
    id SERIAL PRIMARY KEY,
    historia_id INTEGER REFERENCES historias(id) ON DELETE CASCADE,
    
    -- Información del testigo
    tipo_testigo VARCHAR(20) DEFAULT 'principal' CHECK (tipo_testigo IN ('principal', 'secundario')),
    pseudonimo VARCHAR(100),
    edad_aprox INTEGER,
    ocupacion VARCHAR(100),
    relacion_evento VARCHAR(100),
    
    -- Validación y credibilidad
    presencial BOOLEAN DEFAULT TRUE,
    credibilidad_estimada INTEGER DEFAULT 5 CHECK (credibilidad_estimada >= 1 AND credibilidad_estimada <= 10),
    factores_credibilidad JSONB DEFAULT '{}',
    antecedentes_paranormales BOOLEAN DEFAULT FALSE,
    contacto_disponible BOOLEAN DEFAULT FALSE,
    
    -- Notas adicionales
    notas_testigo TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========== 5. CREAR TABLA METRICAS_INICIALES ==========
CREATE TABLE IF NOT EXISTS metricas_iniciales (
    id SERIAL PRIMARY KEY,
    historia_id INTEGER REFERENCES historias(id) ON DELETE CASCADE UNIQUE,
    
    -- Métricas básicas
    reproducciones INTEGER DEFAULT 0,
    me_gusta INTEGER DEFAULT 0,
    comentarios INTEGER DEFAULT 0,
    compartidos INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========== 6. CREAR TABLA PERFORMANCE_ESPERADO ==========
CREATE TABLE IF NOT EXISTS performance_esperado (
    id SERIAL PRIMARY KEY,
    historia_id INTEGER REFERENCES historias(id) ON DELETE CASCADE UNIQUE,
    
    -- Proyecciones
    tiempo_estimado_escucha INTEGER DEFAULT 300, -- segundos
    audiencia_objetivo VARCHAR(50) DEFAULT 'general',
    engagement_esperado VARCHAR(20) DEFAULT 'medio',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========== 7. CREAR TABLA SUBGENEROS ==========
CREATE TABLE IF NOT EXISTS subgeneros (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    color_hex VARCHAR(7) DEFAULT '#808080',
    icono VARCHAR(30) DEFAULT 'ghost',
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========== 8. CREAR TABLA HISTORIA_SUBGENEROS ==========
CREATE TABLE IF NOT EXISTS historia_subgeneros (
    id SERIAL PRIMARY KEY,
    historia_id INTEGER REFERENCES historias(id) ON DELETE CASCADE,
    subgenero_id INTEGER REFERENCES subgeneros(id) ON DELETE CASCADE,
    relevancia INTEGER CHECK (relevancia >= 1 AND relevancia <= 5) DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(historia_id, subgenero_id)
);

-- ========== 9. CREAR TABLA HISTORIA_ELEMENTOS ==========
CREATE TABLE IF NOT EXISTS historia_elementos (
    id SERIAL PRIMARY KEY,
    historia_id INTEGER REFERENCES historias(id) ON DELETE CASCADE,
    elemento_id INTEGER, -- Referencias a entidades_paranormales u otros elementos
    relevancia INTEGER CHECK (relevancia >= 1 AND relevancia <= 5) DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========== 10. INSERTAR DATOS INICIALES ==========

-- Insertar subgéneros básicos
INSERT INTO subgeneros (nombre, descripcion, color_hex, icono) VALUES
('Fantasmas/Apariciones', 'Espíritus de personas fallecidas', '#E8E8E8', 'ghost'),
('Poltergeist', 'Objetos que se mueven solos', '#4169E1', 'move'),
('Hoteles Embrujados', 'Actividad paranormal en establecimientos hoteleros', '#8B4513', 'building'),
('Casas Embrujadas', 'Residencias con actividad paranormal', '#654321', 'home'),
('OVNIs', 'Objetos voladores no identificados', '#00FF00', 'circle'),
('Criptozoología', 'Criaturas no identificadas', '#8B4513', 'eye'),
('Posesiones', 'Casos de posesión demoniaca', '#800080', 'zap'),
('Leyendas Urbanas', 'Historias transmitidas oralmente', '#FF8C00', 'book')
ON CONFLICT (nombre) DO NOTHING;

-- ========== 11. CREAR ÍNDICES ==========
CREATE INDEX IF NOT EXISTS idx_historias_estado ON historias(estado_procesamiento);
CREATE INDEX IF NOT EXISTS idx_historias_fecha_creacion ON historias(fecha_creacion);
CREATE INDEX IF NOT EXISTS idx_historias_created_by ON historias(created_by_uid);
CREATE INDEX IF NOT EXISTS idx_ubicaciones_pais_nivel1 ON ubicaciones(pais, nivel1_nombre);
CREATE INDEX IF NOT EXISTS idx_testigos_historia ON testigos(historia_id);
CREATE INDEX IF NOT EXISTS idx_metricas_historia ON metricas_iniciales(historia_id);

-- ========== 12. HABILITAR RLS (ROW LEVEL SECURITY) ==========
ALTER TABLE historias ENABLE ROW LEVEL SECURITY;
ALTER TABLE ubicaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE testigos ENABLE ROW LEVEL SECURITY;
ALTER TABLE metricas_iniciales ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_esperado ENABLE ROW LEVEL SECURITY;
ALTER TABLE subgeneros ENABLE ROW LEVEL SECURITY;
ALTER TABLE historia_subgeneros ENABLE ROW LEVEL SECURITY;
ALTER TABLE historia_elementos ENABLE ROW LEVEL SECURITY;

-- ========== 13. CREAR POLÍTICAS BÁSICAS ==========
-- Permitir lectura a usuarios autenticados
CREATE POLICY "Allow read access to authenticated users" ON historias FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access to authenticated users" ON ubicaciones FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access to authenticated users" ON testigos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access to authenticated users" ON metricas_iniciales FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access to authenticated users" ON subgeneros FOR SELECT TO authenticated USING (true);

-- Permitir todas las operaciones al service role
CREATE POLICY "Allow all operations to service role" ON historias FOR ALL TO service_role USING (true);
CREATE POLICY "Allow all operations to service role" ON ubicaciones FOR ALL TO service_role USING (true);
CREATE POLICY "Allow all operations to service role" ON usuarios FOR ALL TO service_role USING (true);
CREATE POLICY "Allow all operations to service role" ON testigos FOR ALL TO service_role USING (true);
CREATE POLICY "Allow all operations to service role" ON metricas_iniciales FOR ALL TO service_role USING (true);
CREATE POLICY "Allow all operations to service role" ON performance_esperado FOR ALL TO service_role USING (true);
CREATE POLICY "Allow all operations to service role" ON subgeneros FOR ALL TO service_role USING (true);
CREATE POLICY "Allow all operations to service role" ON historia_subgeneros FOR ALL TO service_role USING (true);
CREATE POLICY "Allow all operations to service role" ON historia_elementos FOR ALL TO service_role USING (true);

-- ========== 14. VERIFICACIÓN FINAL ==========
SELECT 
    table_name,
    COUNT(*) as column_count
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name IN ('historias', 'ubicaciones', 'usuarios', 'testigos', 'metricas_iniciales', 'subgeneros')
GROUP BY table_name
ORDER BY table_name;