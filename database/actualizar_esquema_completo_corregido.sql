-- =====================================================
-- ACTUALIZACIÓN COMPLETA DEL ESQUEMA - ARCHIVOS PARANORMALES (CORREGIDO)
-- Ejecutar en: https://app.supabase.com/project/rcznxhzstgclbgghnfeh/sql/new
-- =====================================================

-- VERIFICAR Y ELIMINAR COLUMNAS DUPLICADAS ANTES DE EMPEZAR
DO $$ 
BEGIN 
    -- Verificar si existe la columna derechos_uso en historias y eliminarla si existe
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'historias' AND column_name = 'derechos_uso'
    ) THEN
        ALTER TABLE historias DROP COLUMN derechos_uso;
    END IF;
END $$;

-- ========== 1. ACTUALIZAR TABLA HISTORIAS ==========
ALTER TABLE historias 
ADD COLUMN IF NOT EXISTS codigo_unico VARCHAR(50) UNIQUE,
ADD COLUMN IF NOT EXISTS fecha_transcripcion DATE,
ADD COLUMN IF NOT EXISTS estado_procesamiento VARCHAR(30) DEFAULT 'pendiente_revision',
ADD COLUMN IF NOT EXISTS hash_similarity VARCHAR(64),
ADD COLUMN IF NOT EXISTS palabras_clave_patron TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS protagonistas_descripcion TEXT,
ADD COLUMN IF NOT EXISTS epoca_historica VARCHAR(50) DEFAULT 'Contemporánea',
ADD COLUMN IF NOT EXISTS longitud_extracto_palabras INTEGER,
ADD COLUMN IF NOT EXISTS hora_evento TIME,
ADD COLUMN IF NOT EXISTS duracion_evento_minutos INTEGER,
ADD COLUMN IF NOT EXISTS duracion_impacto_emocional VARCHAR(20),
ADD COLUMN IF NOT EXISTS presupuesto_estimado DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS notas_adicionales TEXT,
ADD COLUMN IF NOT EXISTS extracto_verbatim TEXT,
ADD COLUMN IF NOT EXISTS historia_reescrita TEXT,
ADD COLUMN IF NOT EXISTS suceso_principal_resumen TEXT;

-- ========== 2. ACTUALIZAR TABLA UBICACIONES ==========
ALTER TABLE ubicaciones 
ADD COLUMN IF NOT EXISTS codigo_pais VARCHAR(3) DEFAULT 'CO',
ADD COLUMN IF NOT EXISTS nivel1_codigo VARCHAR(10),
ADD COLUMN IF NOT EXISTS nivel2_codigo VARCHAR(10),
ADD COLUMN IF NOT EXISTS nivel3_nombre VARCHAR(100),
ADD COLUMN IF NOT EXISTS nivel4_nombre VARCHAR(100),
ADD COLUMN IF NOT EXISTS precision_metros INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS zona_horaria VARCHAR(50) DEFAULT 'America/Bogota',
ADD COLUMN IF NOT EXISTS altitud_metros INTEGER,
ADD COLUMN IF NOT EXISTS actividad_paranormal_reportada BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS numero_historias_reportadas INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS primera_actividad_reportada DATE,
ADD COLUMN IF NOT EXISTS ultima_actividad_reportada DATE,
ADD COLUMN IF NOT EXISTS fuente_verificacion VARCHAR(100);

-- ========== 3. CREAR TABLA SUBGENEROS ==========
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

-- Insertar subgéneros iniciales
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

-- ========== 4. CREAR TABLA HISTORIA_SUBGENEROS ==========
CREATE TABLE IF NOT EXISTS historia_subgeneros (
    id SERIAL PRIMARY KEY,
    historia_id INTEGER REFERENCES historias(id) ON DELETE CASCADE,
    subgenero_id INTEGER REFERENCES subgeneros(id) ON DELETE CASCADE,
    relevancia INTEGER CHECK (relevancia >= 1 AND relevancia <= 5) DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(historia_id, subgenero_id)
);

-- ========== 5. CREAR TABLA ELEMENTOS_CLAVE ==========
CREATE TABLE IF NOT EXISTS elementos_clave (
    id SERIAL PRIMARY KEY,
    elemento VARCHAR(100) NOT NULL,
    categoria VARCHAR(30) NOT NULL, -- lugar_especifico, fenomeno, entidad, objeto, persona
    descripcion TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(elemento, categoria)
);

-- ========== 6. CREAR TABLA HISTORIA_ELEMENTOS ==========
CREATE TABLE IF NOT EXISTS historia_elementos (
    id SERIAL PRIMARY KEY,
    historia_id INTEGER REFERENCES historias(id) ON DELETE CASCADE,
    elemento_id INTEGER REFERENCES elementos_clave(id) ON DELETE CASCADE,
    relevancia INTEGER CHECK (relevancia >= 1 AND relevancia <= 5) DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(historia_id, elemento_id)
);

-- ========== 7. ACTUALIZAR TABLA ENTIDADES_PARANORMALES ==========
ALTER TABLE entidades_paranormales 
ADD COLUMN IF NOT EXISTS alias_conocidos TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS genero VARCHAR(20),
ADD COLUMN IF NOT EXISTS edad_aparente_min INTEGER,
ADD COLUMN IF NOT EXISTS edad_aparente_max INTEGER,
ADD COLUMN IF NOT EXISTS vestimenta_tipica TEXT,
ADD COLUMN IF NOT EXISTS caracteristicas_distintivas TEXT,
ADD COLUMN IF NOT EXISTS patron_comportamiento TEXT,
ADD COLUMN IF NOT EXISTS triggers_aparicion TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS palabras_clave_identificacion TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS primera_aparicion_conocida DATE,
ADD COLUMN IF NOT EXISTS ultima_aparicion_conocida DATE,
ADD COLUMN IF NOT EXISTS numero_historias_asociadas INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS radio_accion_km DECIMAL(8,2),
ADD COLUMN IF NOT EXISTS nivel_certeza VARCHAR(20) DEFAULT 'testimonio_unico';

-- ========== 8. CREAR TABLA TESTIGOS ==========
CREATE TABLE IF NOT EXISTS testigos (
    id SERIAL PRIMARY KEY,
    historia_id INTEGER REFERENCES historias(id) ON DELETE CASCADE,
    tipo_testigo VARCHAR(20) NOT NULL, -- principal, secundario, experto
    pseudonimo VARCHAR(100),
    edad_aprox VARCHAR(20),
    ocupacion VARCHAR(100),
    relacion_evento TEXT,
    presencial BOOLEAN DEFAULT TRUE,
    credibilidad_estimada INTEGER CHECK (credibilidad_estimada >= 1 AND credibilidad_estimada <= 10) DEFAULT 5,
    factores_credibilidad JSONB DEFAULT '{}',
    antecedentes_paranormales BOOLEAN DEFAULT FALSE,
    contacto_disponible BOOLEAN DEFAULT FALSE,
    notas_testigo TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========== 9. CREAR TABLA CONTEXTO_AMBIENTAL ==========
CREATE TABLE IF NOT EXISTS contexto_ambiental (
    id SERIAL PRIMARY KEY,
    historia_id INTEGER REFERENCES historias(id) ON DELETE CASCADE UNIQUE,
    clima_evento VARCHAR(100),
    temperatura_aprox INTEGER,
    humedad_aprox INTEGER,
    numero_personas_presente INTEGER DEFAULT 1,
    situacion_social VARCHAR(200),
    fase_lunar VARCHAR(30),
    festividad_religiosa VARCHAR(100),
    evento_historico VARCHAR(200),
    aniversario_especial VARCHAR(200),
    actividad_previa TEXT,
    estado_emocional_testigos VARCHAR(100),
    patron_temporal_detectado BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========== 10. ACTUALIZAR TABLA ARCHIVOS_MULTIMEDIA ==========
ALTER TABLE archivos_multimedia 
ADD COLUMN IF NOT EXISTS nombre_archivo VARCHAR(255),
ADD COLUMN IF NOT EXISTS ruta_relativa VARCHAR(500),
ADD COLUMN IF NOT EXISTS tamano_bytes BIGINT,
ADD COLUMN IF NOT EXISTS hash_archivo VARCHAR(64),
ADD COLUMN IF NOT EXISTS duracion_segundos INTEGER,
ADD COLUMN IF NOT EXISTS formato VARCHAR(10),
ADD COLUMN IF NOT EXISTS bitrate VARCHAR(20),
ADD COLUMN IF NOT EXISTS sample_rate INTEGER,
ADD COLUMN IF NOT EXISTS canales INTEGER,
ADD COLUMN IF NOT EXISTS descripcion TEXT,
ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS ancho_px INTEGER,
ADD COLUMN IF NOT EXISTS alto_px INTEGER,
ADD COLUMN IF NOT EXISTS metadata_extra JSONB DEFAULT '{}';

-- ========== 11. CREAR TABLA FACTORES_CREDIBILIDAD ==========
CREATE TABLE IF NOT EXISTS factores_credibilidad (
    id SERIAL PRIMARY KEY,
    historia_id INTEGER REFERENCES historias(id) ON DELETE CASCADE UNIQUE,
    multiples_testigos INTEGER CHECK (multiples_testigos >= 1 AND multiples_testigos <= 5) DEFAULT 1,
    evidencia_fisica INTEGER CHECK (evidencia_fisica >= 1 AND evidencia_fisica <= 5) DEFAULT 1,
    consistencia_relatos INTEGER CHECK (consistencia_relatos >= 1 AND consistencia_relatos <= 5) DEFAULT 3,
    ubicacion_verificable INTEGER CHECK (ubicacion_verificable >= 1 AND ubicacion_verificable <= 5) DEFAULT 3,
    contexto_historico INTEGER CHECK (contexto_historico >= 1 AND contexto_historico <= 5) DEFAULT 3,
    sobriedad_testigo INTEGER CHECK (sobriedad_testigo >= 1 AND sobriedad_testigo <= 5) DEFAULT 4,
    conocimiento_previo INTEGER CHECK (conocimiento_previo >= 1 AND conocimiento_previo <= 5) DEFAULT 3,
    estado_emocional INTEGER CHECK (estado_emocional >= 1 AND estado_emocional <= 5) DEFAULT 3,
    banderas_rojas TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========== 12. CREAR TABLA METRICAS_INICIALES ==========
CREATE TABLE IF NOT EXISTS metricas_iniciales (
    id SERIAL PRIMARY KEY,
    historia_id INTEGER REFERENCES historias(id) ON DELETE CASCADE UNIQUE,
    reproducciones INTEGER DEFAULT 0,
    me_gusta INTEGER DEFAULT 0,
    comentarios INTEGER DEFAULT 0,
    compartidos INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========== 13. CREAR TABLA PERFORMANCE_ESPERADO ==========
CREATE TABLE IF NOT EXISTS performance_esperado (
    id SERIAL PRIMARY KEY,
    historia_id INTEGER REFERENCES historias(id) ON DELETE CASCADE UNIQUE,
    tiempo_estimado_escucha INTEGER,
    audiencia_objetivo VARCHAR(50),
    engagement_esperado VARCHAR(20) DEFAULT 'medio',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========== 14. CREAR TABLA HISTORIAS_RELACIONADAS ==========
CREATE TABLE IF NOT EXISTS historias_relacionadas (
    id SERIAL PRIMARY KEY,
    historia_id INTEGER REFERENCES historias(id) ON DELETE CASCADE,
    historia_relacionada_id INTEGER REFERENCES historias(id) ON DELETE CASCADE,
    tipo_relacion VARCHAR(30) NOT NULL, -- misma_ubicacion, patron_similar, mismo_testigo, etc.
    descripcion TEXT,
    fuerza_relacion INTEGER CHECK (fuerza_relacion >= 1 AND fuerza_relacion <= 5) DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(historia_id, historia_relacionada_id),
    CHECK (historia_id != historia_relacionada_id)
);

-- ========== 15. CREAR TABLA DERECHOS ==========
CREATE TABLE IF NOT EXISTS derechos (
    id SERIAL PRIMARY KEY,
    historia_id INTEGER REFERENCES historias(id) ON DELETE CASCADE UNIQUE,
    derechos_uso VARCHAR(30) DEFAULT 'permiso_verbal',
    autorizacion_comercial BOOLEAN DEFAULT TRUE,
    autorizacion_adaptacion BOOLEAN DEFAULT TRUE,
    restricciones_uso TEXT,
    contacto_derechos VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========== 16. CREAR TABLA COLABORADORES ==========
CREATE TABLE IF NOT EXISTS colaboradores (
    id SERIAL PRIMARY KEY,
    historia_id INTEGER REFERENCES historias(id) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL,
    rol VARCHAR(30) NOT NULL, -- narrator, editor_audio, musico, investigador, etc.
    creditos TEXT,
    porcentaje_participacion DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========== 17. CREAR ÍNDICES PARA PERFORMANCE ==========
CREATE INDEX IF NOT EXISTS idx_historias_codigo_unico ON historias(codigo_unico);
CREATE INDEX IF NOT EXISTS idx_historias_estado_procesamiento ON historias(estado_procesamiento);
CREATE INDEX IF NOT EXISTS idx_historias_palabras_clave ON historias USING GIN(palabras_clave_patron);
CREATE INDEX IF NOT EXISTS idx_ubicaciones_actividad_paranormal ON ubicaciones(actividad_paranormal_reportada);
CREATE INDEX IF NOT EXISTS idx_historia_subgeneros_historia_id ON historia_subgeneros(historia_id);
CREATE INDEX IF NOT EXISTS idx_historia_elementos_historia_id ON historia_elementos(historia_id);
CREATE INDEX IF NOT EXISTS idx_testigos_historia_id ON testigos(historia_id);
CREATE INDEX IF NOT EXISTS idx_testigos_tipo ON testigos(tipo_testigo);
CREATE INDEX IF NOT EXISTS idx_entidades_nivel_certeza ON entidades_paranormales(nivel_certeza);

-- ========== 18. CREAR FUNCIONES PARA AUTO-GENERAR CÓDIGOS ==========
CREATE OR REPLACE FUNCTION generar_codigo_unico()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.codigo_unico IS NULL THEN
        NEW.codigo_unico := UPPER(
            COALESCE(NEW.ubicacion_id::text, 'GEN') || '_' ||
            TO_CHAR(NOW(), 'YYYYMMDD') || '_' ||
            LPAD(NEW.id::text, 3, '0')
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para auto-generar código único
DROP TRIGGER IF EXISTS trigger_generar_codigo_unico ON historias;
CREATE TRIGGER trigger_generar_codigo_unico
    BEFORE INSERT OR UPDATE ON historias
    FOR EACH ROW
    EXECUTE FUNCTION generar_codigo_unico();

-- ========== 19. CREAR FUNCIONES PARA TIMESTAMPS AUTOMÁTICOS ==========
CREATE OR REPLACE FUNCTION actualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar triggers de timestamp a tablas relevantes
DROP TRIGGER IF EXISTS trigger_actualizar_timestamp_testigos ON testigos;
CREATE TRIGGER trigger_actualizar_timestamp_testigos
    BEFORE UPDATE ON testigos
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_timestamp();

DROP TRIGGER IF EXISTS trigger_actualizar_timestamp_contexto ON contexto_ambiental;
CREATE TRIGGER trigger_actualizar_timestamp_contexto
    BEFORE UPDATE ON contexto_ambiental
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_timestamp();

-- ========== 20. CREAR VISTAS PARA CONSULTAS COMPLEJAS ==========
CREATE OR REPLACE VIEW vista_historias_completas AS
SELECT 
    h.*,
    u.pais, u.nivel1_nombre as departamento, u.nivel2_nombre as ciudad, u.descripcion_lugar,
    ca.clima_evento, ca.temperatura_aprox, ca.fase_lunar,
    fc.multiples_testigos, fc.evidencia_fisica, fc.consistencia_relatos,
    mi.reproducciones, mi.me_gusta, mi.comentarios,
    pe.audiencia_objetivo, pe.engagement_esperado,
    d.derechos_uso, d.autorizacion_comercial
FROM historias h
LEFT JOIN ubicaciones u ON h.ubicacion_id = u.id
LEFT JOIN contexto_ambiental ca ON h.id = ca.historia_id
LEFT JOIN factores_credibilidad fc ON h.id = fc.historia_id
LEFT JOIN metricas_iniciales mi ON h.id = mi.historia_id
LEFT JOIN performance_esperado pe ON h.id = pe.historia_id
LEFT JOIN derechos d ON h.id = d.historia_id;

-- ========== 21. CREAR POLÍTICAS RLS (ROW LEVEL SECURITY) ==========
-- Habilitar RLS en las nuevas tablas
ALTER TABLE IF EXISTS subgeneros ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS historia_subgeneros ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS elementos_clave ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS historia_elementos ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS testigos ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS contexto_ambiental ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS factores_credibilidad ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS metricas_iniciales ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS performance_esperado ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS historias_relacionadas ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS derechos ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS colaboradores ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (ajustar según necesidades de seguridad)
DROP POLICY IF EXISTS "Allow read access to authenticated users" ON subgeneros;
CREATE POLICY "Allow read access to authenticated users" ON subgeneros FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Allow all operations to service role" ON subgeneros;
CREATE POLICY "Allow all operations to service role" ON subgeneros FOR ALL TO service_role USING (true);

DROP POLICY IF EXISTS "Allow read access to authenticated users" ON elementos_clave;
CREATE POLICY "Allow read access to authenticated users" ON elementos_clave FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Allow all operations to service role" ON elementos_clave;
CREATE POLICY "Allow all operations to service role" ON elementos_clave FOR ALL TO service_role USING (true);

-- Aplicar políticas similares a todas las tablas nuevas
DO $$
DECLARE
    tabla_name text;
    tablas text[] := ARRAY[
        'historia_subgeneros', 'historia_elementos', 'testigos', 'contexto_ambiental',
        'factores_credibilidad', 'metricas_iniciales', 'performance_esperado',
        'historias_relacionadas', 'derechos', 'colaboradores'
    ];
BEGIN
    FOREACH tabla_name IN ARRAY tablas
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Allow read access to authenticated users" ON %I', tabla_name);
        EXECUTE format('CREATE POLICY "Allow read access to authenticated users" ON %I FOR SELECT TO authenticated USING (true)', tabla_name);
        EXECUTE format('DROP POLICY IF EXISTS "Allow all operations to service role" ON %I', tabla_name);
        EXECUTE format('CREATE POLICY "Allow all operations to service role" ON %I FOR ALL TO service_role USING (true)', tabla_name);
    END LOOP;
END $$;

-- ========== 22. INSERTAR DATOS DE PRUEBA (OPCIONAL) ==========
-- Insertar elementos clave comunes
INSERT INTO elementos_clave (elemento, categoria, descripcion) VALUES
('hotel historico', 'lugar_especifico', 'Establecimientos hoteleros con historia'),
('ascensores fantasma', 'fenomeno', 'Ascensores que funcionan solos'),
('luces parpadeantes', 'fenomeno', 'Luces que se encienden y apagan solas'),
('pasillos embrujados', 'lugar_especifico', 'Corredores con actividad paranormal'),
('figura masculina', 'entidad', 'Aparición de forma humana masculina'),
('figura femenina', 'entidad', 'Aparición de forma humana femenina'),
('voces susurrantes', 'fenomeno', 'Sonidos de voces no identificadas'),
('puertas que se abren', 'fenomeno', 'Puertas que se mueven solas'),
('temperatura fria', 'fenomeno', 'Descenso inexplicable de temperatura'),
('cementerio antiguo', 'lugar_especifico', 'Camposantos con historia')
ON CONFLICT (elemento, categoria) DO NOTHING;

-- ========== VERIFICACIÓN FINAL ==========
SELECT 'ACTUALIZACIÓN COMPLETADA EXITOSAMENTE' as status;

-- Verificar tablas creadas
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name IN (
        'subgeneros', 'historia_subgeneros', 'elementos_clave', 'historia_elementos',
        'testigos', 'contexto_ambiental', 'factores_credibilidad', 'metricas_iniciales',
        'performance_esperado', 'historias_relacionadas', 'derechos', 'colaboradores'
    )
ORDER BY table_name;

-- Verificar columnas agregadas a historias
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'historias' 
    AND table_schema = 'public'
    AND column_name IN (
        'codigo_unico', 'fecha_transcripcion', 'estado_procesamiento', 'hash_similarity',
        'palabras_clave_patron', 'protagonistas_descripcion', 'extracto_verbatim'
    )
ORDER BY column_name;

SELECT 'ESQUEMA ACTUALIZADO - LISTO PARA USAR' as resultado_final;