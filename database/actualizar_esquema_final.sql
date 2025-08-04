-- =====================================================
-- ACTUALIZACIÓN FINAL DEL ESQUEMA - ARCHIVOS PARANORMALES
-- Ejecutar en: https://app.supabase.com/project/rcznxhzstgclbgghnfeh/sql/new
-- =====================================================

-- ========== 1. ACTUALIZAR TABLA HISTORIAS ==========
DO $$
BEGIN
    -- codigo_unico
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'historias' AND column_name = 'codigo_unico') THEN
        ALTER TABLE historias ADD COLUMN codigo_unico VARCHAR(50) UNIQUE;
    END IF;
    
    -- fecha_transcripcion
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'historias' AND column_name = 'fecha_transcripcion') THEN
        ALTER TABLE historias ADD COLUMN fecha_transcripcion DATE;
    END IF;
    
    -- estado_procesamiento
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'historias' AND column_name = 'estado_procesamiento') THEN
        ALTER TABLE historias ADD COLUMN estado_procesamiento VARCHAR(30) DEFAULT 'pendiente_revision';
    END IF;
    
    -- hash_similarity
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'historias' AND column_name = 'hash_similarity') THEN
        ALTER TABLE historias ADD COLUMN hash_similarity VARCHAR(64);
    END IF;
    
    -- palabras_clave_patron
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'historias' AND column_name = 'palabras_clave_patron') THEN
        ALTER TABLE historias ADD COLUMN palabras_clave_patron TEXT[] DEFAULT '{}';
    END IF;
    
    -- protagonistas_descripcion
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'historias' AND column_name = 'protagonistas_descripcion') THEN
        ALTER TABLE historias ADD COLUMN protagonistas_descripcion TEXT;
    END IF;
    
    -- epoca_historica
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'historias' AND column_name = 'epoca_historica') THEN
        ALTER TABLE historias ADD COLUMN epoca_historica VARCHAR(50) DEFAULT 'Contemporánea';
    END IF;
    
    -- longitud_extracto_palabras
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'historias' AND column_name = 'longitud_extracto_palabras') THEN
        ALTER TABLE historias ADD COLUMN longitud_extracto_palabras INTEGER;
    END IF;
    
    -- hora_evento
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'historias' AND column_name = 'hora_evento') THEN
        ALTER TABLE historias ADD COLUMN hora_evento TIME;
    END IF;
    
    -- duracion_evento_minutos
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'historias' AND column_name = 'duracion_evento_minutos') THEN
        ALTER TABLE historias ADD COLUMN duracion_evento_minutos INTEGER;
    END IF;
    
    -- duracion_impacto_emocional
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'historias' AND column_name = 'duracion_impacto_emocional') THEN
        ALTER TABLE historias ADD COLUMN duracion_impacto_emocional VARCHAR(20);
    END IF;
    
    -- presupuesto_estimado
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'historias' AND column_name = 'presupuesto_estimado') THEN
        ALTER TABLE historias ADD COLUMN presupuesto_estimado DECIMAL(10,2);
    END IF;
    
    -- notas_adicionales
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'historias' AND column_name = 'notas_adicionales') THEN
        ALTER TABLE historias ADD COLUMN notas_adicionales TEXT;
    END IF;
    
    -- extracto_verbatim
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'historias' AND column_name = 'extracto_verbatim') THEN
        ALTER TABLE historias ADD COLUMN extracto_verbatim TEXT;
    END IF;
    
    -- historia_reescrita
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'historias' AND column_name = 'historia_reescrita') THEN
        ALTER TABLE historias ADD COLUMN historia_reescrita TEXT;
    END IF;
    
    -- suceso_principal_resumen
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'historias' AND column_name = 'suceso_principal_resumen') THEN
        ALTER TABLE historias ADD COLUMN suceso_principal_resumen TEXT;
    END IF;
END $$;

-- ========== 2. ACTUALIZAR TABLA UBICACIONES ==========
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ubicaciones' AND column_name = 'codigo_pais') THEN
        ALTER TABLE ubicaciones ADD COLUMN codigo_pais VARCHAR(3) DEFAULT 'CO';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ubicaciones' AND column_name = 'nivel1_codigo') THEN
        ALTER TABLE ubicaciones ADD COLUMN nivel1_codigo VARCHAR(10);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ubicaciones' AND column_name = 'nivel2_codigo') THEN
        ALTER TABLE ubicaciones ADD COLUMN nivel2_codigo VARCHAR(10);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ubicaciones' AND column_name = 'nivel3_nombre') THEN
        ALTER TABLE ubicaciones ADD COLUMN nivel3_nombre VARCHAR(100);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ubicaciones' AND column_name = 'nivel4_nombre') THEN
        ALTER TABLE ubicaciones ADD COLUMN nivel4_nombre VARCHAR(100);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ubicaciones' AND column_name = 'precision_metros') THEN
        ALTER TABLE ubicaciones ADD COLUMN precision_metros INTEGER DEFAULT 100;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ubicaciones' AND column_name = 'zona_horaria') THEN
        ALTER TABLE ubicaciones ADD COLUMN zona_horaria VARCHAR(50) DEFAULT 'America/Bogota';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ubicaciones' AND column_name = 'altitud_metros') THEN
        ALTER TABLE ubicaciones ADD COLUMN altitud_metros INTEGER;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ubicaciones' AND column_name = 'actividad_paranormal_reportada') THEN
        ALTER TABLE ubicaciones ADD COLUMN actividad_paranormal_reportada BOOLEAN DEFAULT FALSE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ubicaciones' AND column_name = 'numero_historias_reportadas') THEN
        ALTER TABLE ubicaciones ADD COLUMN numero_historias_reportadas INTEGER DEFAULT 1;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ubicaciones' AND column_name = 'primera_actividad_reportada') THEN
        ALTER TABLE ubicaciones ADD COLUMN primera_actividad_reportada DATE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ubicaciones' AND column_name = 'ultima_actividad_reportada') THEN
        ALTER TABLE ubicaciones ADD COLUMN ultima_actividad_reportada DATE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ubicaciones' AND column_name = 'fuente_verificacion') THEN
        ALTER TABLE ubicaciones ADD COLUMN fuente_verificacion VARCHAR(100);
    END IF;
END $$;

-- ========== 3. ACTUALIZAR TABLA ENTIDADES_PARANORMALES ==========
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'entidades_paranormales' AND column_name = 'alias_conocidos') THEN
        ALTER TABLE entidades_paranormales ADD COLUMN alias_conocidos TEXT[] DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'entidades_paranormales' AND column_name = 'genero') THEN
        ALTER TABLE entidades_paranormales ADD COLUMN genero VARCHAR(20);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'entidades_paranormales' AND column_name = 'edad_aparente_min') THEN
        ALTER TABLE entidades_paranormales ADD COLUMN edad_aparente_min INTEGER;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'entidades_paranormales' AND column_name = 'edad_aparente_max') THEN
        ALTER TABLE entidades_paranormales ADD COLUMN edad_aparente_max INTEGER;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'entidades_paranormales' AND column_name = 'vestimenta_tipica') THEN
        ALTER TABLE entidades_paranormales ADD COLUMN vestimenta_tipica TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'entidades_paranormales' AND column_name = 'caracteristicas_distintivas') THEN
        ALTER TABLE entidades_paranormales ADD COLUMN caracteristicas_distintivas TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'entidades_paranormales' AND column_name = 'patron_comportamiento') THEN
        ALTER TABLE entidades_paranormales ADD COLUMN patron_comportamiento TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'entidades_paranormales' AND column_name = 'triggers_aparicion') THEN
        ALTER TABLE entidades_paranormales ADD COLUMN triggers_aparicion TEXT[] DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'entidades_paranormales' AND column_name = 'palabras_clave_identificacion') THEN
        ALTER TABLE entidades_paranormales ADD COLUMN palabras_clave_identificacion TEXT[] DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'entidades_paranormales' AND column_name = 'primera_aparicion_conocida') THEN
        ALTER TABLE entidades_paranormales ADD COLUMN primera_aparicion_conocida DATE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'entidades_paranormales' AND column_name = 'ultima_aparicion_conocida') THEN
        ALTER TABLE entidades_paranormales ADD COLUMN ultima_aparicion_conocida DATE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'entidades_paranormales' AND column_name = 'numero_historias_asociadas') THEN
        ALTER TABLE entidades_paranormales ADD COLUMN numero_historias_asociadas INTEGER DEFAULT 1;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'entidades_paranormales' AND column_name = 'radio_accion_km') THEN
        ALTER TABLE entidades_paranormales ADD COLUMN radio_accion_km DECIMAL(8,2);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'entidades_paranormales' AND column_name = 'nivel_certeza') THEN
        ALTER TABLE entidades_paranormales ADD COLUMN nivel_certeza VARCHAR(20) DEFAULT 'testimonio_unico';
    END IF;
END $$;

-- ========== 4. ACTUALIZAR TABLA ARCHIVOS_MULTIMEDIA ==========
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'archivos_multimedia' AND column_name = 'nombre_archivo') THEN
        ALTER TABLE archivos_multimedia ADD COLUMN nombre_archivo VARCHAR(255);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'archivos_multimedia' AND column_name = 'ruta_relativa') THEN
        ALTER TABLE archivos_multimedia ADD COLUMN ruta_relativa VARCHAR(500);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'archivos_multimedia' AND column_name = 'tamano_bytes') THEN
        ALTER TABLE archivos_multimedia ADD COLUMN tamano_bytes BIGINT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'archivos_multimedia' AND column_name = 'hash_archivo') THEN
        ALTER TABLE archivos_multimedia ADD COLUMN hash_archivo VARCHAR(64);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'archivos_multimedia' AND column_name = 'duracion_segundos') THEN
        ALTER TABLE archivos_multimedia ADD COLUMN duracion_segundos INTEGER;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'archivos_multimedia' AND column_name = 'formato') THEN
        ALTER TABLE archivos_multimedia ADD COLUMN formato VARCHAR(10);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'archivos_multimedia' AND column_name = 'bitrate') THEN
        ALTER TABLE archivos_multimedia ADD COLUMN bitrate VARCHAR(20);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'archivos_multimedia' AND column_name = 'sample_rate') THEN
        ALTER TABLE archivos_multimedia ADD COLUMN sample_rate INTEGER;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'archivos_multimedia' AND column_name = 'canales') THEN
        ALTER TABLE archivos_multimedia ADD COLUMN canales INTEGER;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'archivos_multimedia' AND column_name = 'descripcion') THEN
        ALTER TABLE archivos_multimedia ADD COLUMN descripcion TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'archivos_multimedia' AND column_name = 'version') THEN
        ALTER TABLE archivos_multimedia ADD COLUMN version INTEGER DEFAULT 1;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'archivos_multimedia' AND column_name = 'is_active') THEN
        ALTER TABLE archivos_multimedia ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'archivos_multimedia' AND column_name = 'ancho_px') THEN
        ALTER TABLE archivos_multimedia ADD COLUMN ancho_px INTEGER;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'archivos_multimedia' AND column_name = 'alto_px') THEN
        ALTER TABLE archivos_multimedia ADD COLUMN alto_px INTEGER;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'archivos_multimedia' AND column_name = 'metadata_extra') THEN
        ALTER TABLE archivos_multimedia ADD COLUMN metadata_extra JSONB DEFAULT '{}';
    END IF;
END $$;

-- ========== 5. CREAR NUEVAS TABLAS ==========

-- Tabla subgeneros
CREATE TABLE IF NOT EXISTS subgeneros (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agregar columnas adicionales a subgeneros si no existen
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'subgeneros' AND column_name = 'descripcion') THEN
        ALTER TABLE subgeneros ADD COLUMN descripcion TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'subgeneros' AND column_name = 'color_hex') THEN
        ALTER TABLE subgeneros ADD COLUMN color_hex VARCHAR(7) DEFAULT '#808080';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'subgeneros' AND column_name = 'icono') THEN
        ALTER TABLE subgeneros ADD COLUMN icono VARCHAR(30) DEFAULT 'ghost';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'subgeneros' AND column_name = 'activo') THEN
        ALTER TABLE subgeneros ADD COLUMN activo BOOLEAN DEFAULT TRUE;
    END IF;
END $$;

-- Tabla historia_subgeneros
CREATE TABLE IF NOT EXISTS historia_subgeneros (
    id SERIAL PRIMARY KEY,
    historia_id INTEGER REFERENCES historias(id) ON DELETE CASCADE,
    subgenero_id INTEGER REFERENCES subgeneros(id) ON DELETE CASCADE,
    relevancia INTEGER CHECK (relevancia >= 1 AND relevancia <= 5) DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(historia_id, subgenero_id)
);

-- Tabla elementos_clave
CREATE TABLE IF NOT EXISTS elementos_clave (
    id SERIAL PRIMARY KEY,
    elemento VARCHAR(100) NOT NULL,
    categoria VARCHAR(30) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(elemento, categoria)
);

-- Agregar columna descripcion si no existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'elementos_clave' AND column_name = 'descripcion') THEN
        ALTER TABLE elementos_clave ADD COLUMN descripcion TEXT;
    END IF;
END $$;

-- Tabla historia_elementos
CREATE TABLE IF NOT EXISTS historia_elementos (
    id SERIAL PRIMARY KEY,
    historia_id INTEGER REFERENCES historias(id) ON DELETE CASCADE,
    elemento_id INTEGER REFERENCES elementos_clave(id) ON DELETE CASCADE,
    relevancia INTEGER CHECK (relevancia >= 1 AND relevancia <= 5) DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(historia_id, elemento_id)
);

-- Tabla testigos
CREATE TABLE IF NOT EXISTS testigos (
    id SERIAL PRIMARY KEY,
    historia_id INTEGER REFERENCES historias(id) ON DELETE CASCADE,
    tipo_testigo VARCHAR(20) NOT NULL,
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

-- Tabla contexto_ambiental
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

-- Tabla factores_credibilidad
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

-- Tabla metricas_iniciales
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

-- Tabla performance_esperado
CREATE TABLE IF NOT EXISTS performance_esperado (
    id SERIAL PRIMARY KEY,
    historia_id INTEGER REFERENCES historias(id) ON DELETE CASCADE UNIQUE,
    tiempo_estimado_escucha INTEGER,
    audiencia_objetivo VARCHAR(50),
    engagement_esperado VARCHAR(20) DEFAULT 'medio',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla historias_relacionadas
CREATE TABLE IF NOT EXISTS historias_relacionadas (
    id SERIAL PRIMARY KEY,
    historia_id INTEGER REFERENCES historias(id) ON DELETE CASCADE,
    historia_relacionada_id INTEGER REFERENCES historias(id) ON DELETE CASCADE,
    tipo_relacion VARCHAR(30) NOT NULL,
    descripcion TEXT,
    fuerza_relacion INTEGER CHECK (fuerza_relacion >= 1 AND fuerza_relacion <= 5) DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(historia_id, historia_relacionada_id),
    CHECK (historia_id != historia_relacionada_id)
);

-- Tabla derechos
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

-- Tabla colaboradores
CREATE TABLE IF NOT EXISTS colaboradores (
    id SERIAL PRIMARY KEY,
    historia_id INTEGER REFERENCES historias(id) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL,
    rol VARCHAR(30) NOT NULL,
    creditos TEXT,
    porcentaje_participacion DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========== 6. INSERTAR DATOS INICIALES ==========

-- Subgéneros iniciales (insertar solo si no existen)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM subgeneros WHERE nombre = 'Fantasmas/Apariciones') THEN
        INSERT INTO subgeneros (nombre, descripcion, color_hex, icono) VALUES ('Fantasmas/Apariciones', 'Espíritus de personas fallecidas', '#E8E8E8', 'ghost');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM subgeneros WHERE nombre = 'Poltergeist') THEN
        INSERT INTO subgeneros (nombre, descripcion, color_hex, icono) VALUES ('Poltergeist', 'Objetos que se mueven solos', '#4169E1', 'move');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM subgeneros WHERE nombre = 'Hoteles Embrujados') THEN
        INSERT INTO subgeneros (nombre, descripcion, color_hex, icono) VALUES ('Hoteles Embrujados', 'Actividad paranormal en establecimientos hoteleros', '#8B4513', 'building');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM subgeneros WHERE nombre = 'Casas Embrujadas') THEN
        INSERT INTO subgeneros (nombre, descripcion, color_hex, icono) VALUES ('Casas Embrujadas', 'Residencias con actividad paranormal', '#654321', 'home');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM subgeneros WHERE nombre = 'OVNIs') THEN
        INSERT INTO subgeneros (nombre, descripcion, color_hex, icono) VALUES ('OVNIs', 'Objetos voladores no identificados', '#00FF00', 'circle');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM subgeneros WHERE nombre = 'Criptozoología') THEN
        INSERT INTO subgeneros (nombre, descripcion, color_hex, icono) VALUES ('Criptozoología', 'Criaturas no identificadas', '#8B4513', 'eye');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM subgeneros WHERE nombre = 'Posesiones') THEN
        INSERT INTO subgeneros (nombre, descripcion, color_hex, icono) VALUES ('Posesiones', 'Casos de posesión demoniaca', '#800080', 'zap');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM subgeneros WHERE nombre = 'Leyendas Urbanas') THEN
        INSERT INTO subgeneros (nombre, descripcion, color_hex, icono) VALUES ('Leyendas Urbanas', 'Historias transmitidas oralmente', '#FF8C00', 'book');
    END IF;
END $$;

-- Elementos clave iniciales (insertar solo si no existen)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM elementos_clave WHERE elemento = 'hotel historico' AND categoria = 'lugar_especifico') THEN
        INSERT INTO elementos_clave (elemento, categoria, descripcion) VALUES ('hotel historico', 'lugar_especifico', 'Establecimientos hoteleros con historia');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM elementos_clave WHERE elemento = 'ascensores fantasma' AND categoria = 'fenomeno') THEN
        INSERT INTO elementos_clave (elemento, categoria, descripcion) VALUES ('ascensores fantasma', 'fenomeno', 'Ascensores que funcionan solos');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM elementos_clave WHERE elemento = 'luces parpadeantes' AND categoria = 'fenomeno') THEN
        INSERT INTO elementos_clave (elemento, categoria, descripcion) VALUES ('luces parpadeantes', 'fenomeno', 'Luces que se encienden y apagan solas');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM elementos_clave WHERE elemento = 'pasillos embrujados' AND categoria = 'lugar_especifico') THEN
        INSERT INTO elementos_clave (elemento, categoria, descripcion) VALUES ('pasillos embrujados', 'lugar_especifico', 'Corredores con actividad paranormal');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM elementos_clave WHERE elemento = 'figura masculina' AND categoria = 'entidad') THEN
        INSERT INTO elementos_clave (elemento, categoria, descripcion) VALUES ('figura masculina', 'entidad', 'Aparición de forma humana masculina');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM elementos_clave WHERE elemento = 'figura femenina' AND categoria = 'entidad') THEN
        INSERT INTO elementos_clave (elemento, categoria, descripcion) VALUES ('figura femenina', 'entidad', 'Aparición de forma humana femenina');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM elementos_clave WHERE elemento = 'voces susurrantes' AND categoria = 'fenomeno') THEN
        INSERT INTO elementos_clave (elemento, categoria, descripcion) VALUES ('voces susurrantes', 'fenomeno', 'Sonidos de voces no identificadas');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM elementos_clave WHERE elemento = 'puertas que se abren' AND categoria = 'fenomeno') THEN
        INSERT INTO elementos_clave (elemento, categoria, descripcion) VALUES ('puertas que se abren', 'fenomeno', 'Puertas que se mueven solas');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM elementos_clave WHERE elemento = 'temperatura fria' AND categoria = 'fenomeno') THEN
        INSERT INTO elementos_clave (elemento, categoria, descripcion) VALUES ('temperatura fria', 'fenomeno', 'Descenso inexplicable de temperatura');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM elementos_clave WHERE elemento = 'cementerio antiguo' AND categoria = 'lugar_especifico') THEN
        INSERT INTO elementos_clave (elemento, categoria, descripcion) VALUES ('cementerio antiguo', 'lugar_especifico', 'Camposantos con historia');
    END IF;
END $$;

-- ========== 7. CREAR CONSTRAINTS ÚNICOS ==========
-- Agregar constraint único para subgeneros.nombre si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'subgeneros' 
        AND constraint_name = 'subgeneros_nombre_key'
        AND constraint_type = 'UNIQUE'
    ) THEN
        ALTER TABLE subgeneros ADD CONSTRAINT subgeneros_nombre_key UNIQUE (nombre);
    END IF;
END $$;

-- Agregar constraint único para elementos_clave si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'elementos_clave' 
        AND constraint_name = 'elementos_clave_elemento_categoria_key'
        AND constraint_type = 'UNIQUE'
    ) THEN
        ALTER TABLE elementos_clave ADD CONSTRAINT elementos_clave_elemento_categoria_key UNIQUE (elemento, categoria);
    END IF;
END $$;

-- ========== 8. CREAR ÍNDICES ==========
DROP INDEX IF EXISTS idx_historias_codigo_unico;
CREATE INDEX idx_historias_codigo_unico ON historias(codigo_unico) WHERE codigo_unico IS NOT NULL;

DROP INDEX IF EXISTS idx_historias_estado_procesamiento;
CREATE INDEX idx_historias_estado_procesamiento ON historias(estado_procesamiento) WHERE estado_procesamiento IS NOT NULL;

DROP INDEX IF EXISTS idx_historia_subgeneros_historia_id;
CREATE INDEX idx_historia_subgeneros_historia_id ON historia_subgeneros(historia_id);

DROP INDEX IF EXISTS idx_historia_elementos_historia_id;
CREATE INDEX idx_historia_elementos_historia_id ON historia_elementos(historia_id);

DROP INDEX IF EXISTS idx_testigos_historia_id;
CREATE INDEX idx_testigos_historia_id ON testigos(historia_id);

-- ========== 9. HABILITAR RLS ==========
ALTER TABLE subgeneros ENABLE ROW LEVEL SECURITY;
ALTER TABLE historia_subgeneros ENABLE ROW LEVEL SECURITY;
ALTER TABLE elementos_clave ENABLE ROW LEVEL SECURITY;
ALTER TABLE historia_elementos ENABLE ROW LEVEL SECURITY;
ALTER TABLE testigos ENABLE ROW LEVEL SECURITY;
ALTER TABLE contexto_ambiental ENABLE ROW LEVEL SECURITY;
ALTER TABLE factores_credibilidad ENABLE ROW LEVEL SECURITY;
ALTER TABLE metricas_iniciales ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_esperado ENABLE ROW LEVEL SECURITY;
ALTER TABLE historias_relacionadas ENABLE ROW LEVEL SECURITY;
ALTER TABLE derechos ENABLE ROW LEVEL SECURITY;
ALTER TABLE colaboradores ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (con verificación de existencia)
DO $$
BEGIN
    -- Políticas para subgeneros
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'subgeneros' AND policyname = 'Allow read access to authenticated users') THEN
        CREATE POLICY "Allow read access to authenticated users" ON subgeneros FOR SELECT TO authenticated USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'subgeneros' AND policyname = 'Allow all operations to service role') THEN
        CREATE POLICY "Allow all operations to service role" ON subgeneros FOR ALL TO service_role USING (true);
    END IF;
    
    -- Políticas para elementos_clave
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'elementos_clave' AND policyname = 'Allow read access to authenticated users') THEN
        CREATE POLICY "Allow read access to authenticated users" ON elementos_clave FOR SELECT TO authenticated USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'elementos_clave' AND policyname = 'Allow all operations to service role') THEN
        CREATE POLICY "Allow all operations to service role" ON elementos_clave FOR ALL TO service_role USING (true);
    END IF;
END $$;

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

SELECT 'ESQUEMA ACTUALIZADO - LISTO PARA USAR' as resultado_final;