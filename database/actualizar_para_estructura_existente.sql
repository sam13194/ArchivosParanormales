-- =====================================================
-- ACTUALIZACIÓN PARA ESTRUCTURA EXISTENTE - ARCHIVOS PARANORMALES
-- =====================================================

-- ========== 1. PRIMERO VER QUÉ CHECK CONSTRAINTS EXISTEN ==========
SELECT 
    tc.table_name,
    tc.constraint_name,
    cc.check_clause
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.check_constraints cc ON tc.constraint_name = cc.constraint_name
WHERE tc.table_schema = 'public' 
    AND tc.table_name = 'elementos_clave'
    AND tc.constraint_type = 'CHECK';

-- Ver qué categorías existen actualmente
SELECT DISTINCT categoria FROM elementos_clave WHERE categoria IS NOT NULL;

-- ========== 2. AGREGAR COLUMNAS FALTANTES A LA ESTRUCTURA EXISTENTE ==========

-- Agregar descripcion a elementos_clave
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'elementos_clave' AND column_name = 'descripcion') THEN
        ALTER TABLE elementos_clave ADD COLUMN descripcion TEXT;
    END IF;
END $$;

-- Agregar created_at a elementos_clave
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'elementos_clave' AND column_name = 'created_at') THEN
        ALTER TABLE elementos_clave ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- ========== 3. ACTUALIZAR TABLA HISTORIAS (agregar campos faltantes) ==========
DO $$
BEGIN
    -- Agregar todas las columnas que faltan en historias
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'historias' AND column_name = 'codigo_unico') THEN
        ALTER TABLE historias ADD COLUMN codigo_unico VARCHAR(50) UNIQUE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'historias' AND column_name = 'fecha_transcripcion') THEN
        ALTER TABLE historias ADD COLUMN fecha_transcripcion DATE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'historias' AND column_name = 'estado_procesamiento') THEN
        ALTER TABLE historias ADD COLUMN estado_procesamiento VARCHAR(30) DEFAULT 'pendiente_revision';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'historias' AND column_name = 'extracto_verbatim') THEN
        ALTER TABLE historias ADD COLUMN extracto_verbatim TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'historias' AND column_name = 'historia_reescrita') THEN
        ALTER TABLE historias ADD COLUMN historia_reescrita TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'historias' AND column_name = 'suceso_principal_resumen') THEN
        ALTER TABLE historias ADD COLUMN suceso_principal_resumen TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'historias' AND column_name = 'hora_evento') THEN
        ALTER TABLE historias ADD COLUMN hora_evento TIME;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'historias' AND column_name = 'duracion_evento_minutos') THEN
        ALTER TABLE historias ADD COLUMN duracion_evento_minutos INTEGER;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'historias' AND column_name = 'presupuesto_estimado') THEN
        ALTER TABLE historias ADD COLUMN presupuesto_estimado DECIMAL(10,2);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'historias' AND column_name = 'notas_adicionales') THEN
        ALTER TABLE historias ADD COLUMN notas_adicionales TEXT;
    END IF;
END $$;

-- ========== 4. CREAR TABLAS QUE FALTAN (las que no existen) ==========

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

-- Tabla historia_elementos (para relacionar historias con elementos_clave)
CREATE TABLE IF NOT EXISTS historia_elementos (
    id SERIAL PRIMARY KEY,
    historia_id INTEGER REFERENCES historias(id) ON DELETE CASCADE,
    elemento_id INTEGER REFERENCES elementos_clave(id) ON DELETE CASCADE,
    relevancia INTEGER CHECK (relevancia >= 1 AND relevancia <= 5) DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(historia_id, elemento_id)
);

-- ========== 5. INSERTAR DATOS EN ELEMENTOS_CLAVE (usando estructura existente) ==========
-- Primero intentamos insertar sin 'entidad' para ver qué categorías funcionan

DO $$
BEGIN
    -- Intentar con categorías que probablemente existan
    IF NOT EXISTS (SELECT 1 FROM elementos_clave WHERE elemento = 'hotel historico') THEN
        INSERT INTO elementos_clave (elemento, categoria, descripcion) VALUES ('hotel historico', 'lugar', 'Establecimientos hoteleros con historia');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM elementos_clave WHERE elemento = 'ascensores fantasma') THEN
        INSERT INTO elementos_clave (elemento, categoria, descripcion) VALUES ('ascensores fantasma', 'fenomeno', 'Ascensores que funcionan solos');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM elementos_clave WHERE elemento = 'luces parpadeantes') THEN
        INSERT INTO elementos_clave (elemento, categoria, descripcion) VALUES ('luces parpadeantes', 'fenomeno', 'Luces que se encienden y apagan solas');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM elementos_clave WHERE elemento = 'pasillos embrujados') THEN
        INSERT INTO elementos_clave (elemento, categoria, descripcion) VALUES ('pasillos embrujados', 'lugar', 'Corredores con actividad paranormal');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM elementos_clave WHERE elemento = 'figura masculina') THEN
        INSERT INTO elementos_clave (elemento, categoria, descripcion) VALUES ('figura masculina', 'aparicion', 'Aparición de forma humana masculina');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM elementos_clave WHERE elemento = 'figura femenina') THEN
        INSERT INTO elementos_clave (elemento, categoria, descripcion) VALUES ('figura femenina', 'aparicion', 'Aparición de forma humana femenina');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM elementos_clave WHERE elemento = 'voces susurrantes') THEN
        INSERT INTO elementos_clave (elemento, categoria, descripcion) VALUES ('voces susurrantes', 'fenomeno', 'Sonidos de voces no identificadas');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM elementos_clave WHERE elemento = 'puertas que se abren') THEN
        INSERT INTO elementos_clave (elemento, categoria, descripcion) VALUES ('puertas que se abren', 'fenomeno', 'Puertas que se mueven solas');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM elementos_clave WHERE elemento = 'temperatura fria') THEN
        INSERT INTO elementos_clave (elemento, categoria, descripcion) VALUES ('temperatura fria', 'fenomeno', 'Descenso inexplicable de temperatura');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM elementos_clave WHERE elemento = 'cementerio antiguo') THEN
        INSERT INTO elementos_clave (elemento, categoria, descripcion) VALUES ('cementerio antiguo', 'lugar', 'Camposantos con historia');
    END IF;

EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error insertando elementos: %, intentando con otras categorías...', SQLERRM;
    
    -- Si falla, intentar con categorías más simples
    IF NOT EXISTS (SELECT 1 FROM elementos_clave WHERE elemento = 'hotel historico') THEN
        INSERT INTO elementos_clave (elemento, categoria, descripcion) VALUES ('hotel historico', 'objeto', 'Establecimientos hoteleros con historia');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM elementos_clave WHERE elemento = 'figura masculina') THEN
        INSERT INTO elementos_clave (elemento, categoria, descripcion) VALUES ('figura masculina', 'persona', 'Aparición de forma humana masculina');
    END IF;
END $$;

-- ========== 6. ACTUALIZAR DATOS EXISTENTES EN SUBGENEROS ==========
-- Verificar si la tabla subgeneros tiene la estructura correcta
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

-- Insertar subgéneros si no existen
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
END $$;

-- ========== VERIFICACIÓN FINAL ==========
SELECT 'ACTUALIZACIÓN PARA ESTRUCTURA EXISTENTE COMPLETADA' as status;

-- Mostrar qué se creó/actualizó
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name IN ('factores_credibilidad', 'metricas_iniciales', 'performance_esperado', 'derechos', 'colaboradores', 'historia_elementos')
ORDER BY table_name;

-- Mostrar elementos insertados
SELECT * FROM elementos_clave ORDER BY id;

-- Mostrar subgéneros
SELECT * FROM subgeneros ORDER BY id;