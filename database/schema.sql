-- ============================================
-- ARCHIVOS PARANORMALES - SCHEMA PARA SUPABASE
-- ============================================

-- Configuración inicial para Supabase
-- Asegurarse de que las extensiones estén habilitadas
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ============================================
-- 1. GEOLOCALIZACIÓN
-- ============================================

CREATE TABLE ubicaciones (
    id SERIAL PRIMARY KEY,
    
    -- Información geográfica jerárquica
    pais VARCHAR(100) NOT NULL,
    codigo_pais CHAR(2), -- CO, US, MX, etc.
    nivel1_nombre VARCHAR(100), -- Departamento/Estado/Provincia
    nivel1_codigo VARCHAR(10),  -- CUN, ANT, CA
    nivel2_nombre VARCHAR(100), -- Ciudad/Municipio
    nivel2_codigo VARCHAR(10),
    nivel3_nombre VARCHAR(100), -- Zona/Localidad/Barrio
    nivel4_nombre VARCHAR(100), -- Vereda, Sector, Calle específica
    
    -- Coordenadas GPS (usando PostGIS point)
    coordenadas POINT NULL,
    precision_metros INT NULL,
    
    -- Descripción del lugar
    descripcion_lugar TEXT,
    lugar_especifico VARCHAR(255),
    tipo_lugar VARCHAR(50) CHECK (tipo_lugar IN (
        'casa_habitacion', 'edificio_apartamentos', 'oficina', 
        'hospital', 'escuela', 'iglesia', 'cementerio',
        'finca_rural', 'carretera', 'puente', 'rio',
        'bosque', 'montaña', 'cueva', 'ruinas',
        'centro_comercial', 'hotel', 'restaurant',
        'fabrica_abandonada', 'mina', 'otro'
    )),
    
    -- Metadatos
    zona_horaria VARCHAR(50) DEFAULT 'America/Bogota',
    altitud_metros INT NULL,
    
    -- Para análisis de patrones
    actividad_paranormal_reportada BOOLEAN DEFAULT FALSE,
    numero_historias_reportadas INT DEFAULT 0,
    primera_actividad_reportada DATE NULL,
    ultima_actividad_reportada DATE NULL,
    
    -- Control
    verificada BOOLEAN DEFAULT FALSE,
    fuente_verificacion VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para ubicaciones
CREATE INDEX idx_ubicaciones_pais_nivel1 ON ubicaciones(pais, nivel1_nombre);
CREATE INDEX idx_ubicaciones_coordenadas ON ubicaciones USING GIST(coordenadas);
CREATE INDEX idx_ubicaciones_tipo_lugar ON ubicaciones(tipo_lugar);
CREATE INDEX idx_ubicaciones_actividad ON ubicaciones(actividad_paranormal_reportada, numero_historias_reportadas);

-- ============================================
-- 2. ENTIDADES PARANORMALES
-- ============================================

CREATE TABLE entidades_paranormales (
    id SERIAL PRIMARY KEY,
    
    -- Identificación
    nombre_entidad VARCHAR(255),
    alias_conocidos JSONB DEFAULT '[]',
    tipo_entidad VARCHAR(50) CHECK (tipo_entidad IN (
        'fantasma_humano', 'demonio', 'angel', 'espiritu_elemental',
        'extraterrestre', 'criatura_desconocida', 'poltergeist',
        'sombra', 'orbe', 'voz_sin_cuerpo', 'presencia_invisible'
    )),
    
    -- Características físicas
    descripcion_fisica TEXT,
    genero VARCHAR(20) CHECK (genero IN ('masculino', 'femenino', 'indefinido', 'variable')),
    edad_aparente_min SMALLINT,
    edad_aparente_max SMALLINT,
    vestimenta_tipica TEXT,
    caracteristicas_distintivas TEXT,
    
    -- Comportamiento
    patron_comportamiento TEXT,
    nivel_hostilidad VARCHAR(20) CHECK (nivel_hostilidad IN ('benefico', 'neutral', 'molesto', 'agresivo', 'maligno')),
    horarios_actividad JSONB DEFAULT '[]',
    triggeres_aparicion JSONB DEFAULT '[]',
    
    -- Para matching entre historias
    palabras_clave_identificacion JSONB DEFAULT '[]',
    
    -- Análisis de patrones
    primera_aparicion_conocida DATE,
    ultima_aparicion_conocida DATE,
    numero_historias_asociadas INT DEFAULT 0,
    radio_accion_km DECIMAL(8,2),
    
    -- Verificación
    nivel_certeza VARCHAR(20) CHECK (nivel_certeza IN ('especulacion', 'probable', 'confirmado')),
    notas_investigacion TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para entidades
CREATE INDEX idx_entidades_tipo ON entidades_paranormales(tipo_entidad);
CREATE INDEX idx_entidades_hostilidad ON entidades_paranormales(nivel_hostilidad);
CREATE INDEX idx_entidades_busqueda ON entidades_paranormales USING GIN(to_tsvector('spanish', nombre_entidad || ' ' || COALESCE(descripcion_fisica, '') || ' ' || COALESCE(caracteristicas_distintivas, '')));

-- ============================================
-- 3. HISTORIAS PRINCIPALES
-- ============================================

CREATE TABLE historias (
    id SERIAL PRIMARY KEY,
    codigo_unico VARCHAR(50) UNIQUE NOT NULL,
    
    -- Información básica
    titulo_provisional VARCHAR(255) NOT NULL,
    fuente_relato VARCHAR(50) CHECK (fuente_relato IN ('llamada_oyente', 'historia_programa', 'investigacion_propia')) NOT NULL,
    fecha_transcripcion DATE,
    
    -- Clasificación
    genero_principal VARCHAR(50) DEFAULT 'paranormal',
    ponderacion_impacto SMALLINT CHECK (ponderacion_impacto BETWEEN 1 AND 5),
    potencial_adaptacion SMALLINT CHECK (potencial_adaptacion BETWEEN 1 AND 3),
    
    -- Contenido
    suceso_principal_resumen TEXT,
    protagonistas_descripcion TEXT,
    extracto_verbatim TEXT,
    historia_reescrita TEXT,
    notas_adicionales TEXT,
    longitud_extracto_palabras INT,
    
    -- Localización
    ubicacion_id INT REFERENCES ubicaciones(id),
    
    -- Temporalidad del evento paranormal
    fecha_evento_inicio DATE NULL,
    fecha_evento_fin DATE NULL,
    hora_evento TIME NULL,
    epoca_historica VARCHAR(100),
    duracion_evento_minutos INT NULL,
    evento_recurrente BOOLEAN DEFAULT FALSE,
    patron_recurrencia VARCHAR(100),
    
    -- Verificación y credibilidad
    nivel_verificacion VARCHAR(50) CHECK (nivel_verificacion IN (
        'sin_verificar', 'testimonio_unico', 'multiples_testigos', 
        'evidencia_fisica', 'investigacion_completa', 'verificado_experto'
    )) DEFAULT 'sin_verificar',
    credibilidad_score DECIMAL(3,2) CHECK (credibilidad_score BETWEEN 0 AND 5),
    factores_credibilidad JSONB DEFAULT '{}',
    banderas_rojas JSONB DEFAULT '[]',
    
    -- Contenido y clasificación
    contenido_sensible BOOLEAN DEFAULT FALSE,
    advertencias JSONB DEFAULT '[]',
    edad_minima_recomendada SMALLINT DEFAULT 18,
    duracion_impacto_emocional VARCHAR(20) CHECK (duracion_impacto_emocional IN ('leve', 'moderado', 'intenso', 'traumático')),
    
    -- Producción
    dificultad_produccion SMALLINT CHECK (dificultad_produccion BETWEEN 1 AND 5),
    recursos_necesarios JSONB DEFAULT '{}',
    tiempo_produccion_estimado INT,
    presupuesto_estimado DECIMAL(10,2),
    
    -- Derechos
    derechos_uso VARCHAR(50) CHECK (derechos_uso IN (
        'dominio_publico', 'uso_libre', 'permiso_verbal',
        'contrato_firmado', 'pendiente_autorizacion', 'uso_restringido'
    )) DEFAULT 'pendiente_autorizacion',
    autorizacion_comercial BOOLEAN DEFAULT FALSE,
    autorizacion_adaptacion BOOLEAN DEFAULT TRUE,
    restricciones_uso TEXT,
    contacto_derechos VARCHAR(255),
    
    -- Estado de procesamiento
    estado_procesamiento VARCHAR(50) CHECK (estado_procesamiento IN (
        'extraida', 'en_adaptacion', 'adaptada', 
        'en_produccion', 'producida', 'publicada'
    )) DEFAULT 'extraida',
    fecha_publicacion DATE NULL,
    
    -- Para análisis de patrones
    hash_similarity VARCHAR(64),
    palabras_clave_patron JSONB DEFAULT '[]',
    
    -- Firebase Auth integration
    created_by_uid VARCHAR(128), -- Firebase UID del usuario que creó
    
    -- Control de versiones
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para historias
CREATE INDEX idx_historias_estado ON historias(estado_procesamiento);
CREATE INDEX idx_historias_impacto ON historias(ponderacion_impacto);
CREATE INDEX idx_historias_fecha_evento ON historias(fecha_evento_inicio);
CREATE INDEX idx_historias_ubicacion ON historias(ubicacion_id);
CREATE INDEX idx_historias_credibilidad ON historias(credibilidad_score);
CREATE INDEX idx_historias_similarity ON historias(hash_similarity);
CREATE INDEX idx_historias_created_by ON historias(created_by_uid);
CREATE INDEX idx_historias_busqueda ON historias USING GIN(to_tsvector('spanish', titulo_provisional || ' ' || COALESCE(suceso_principal_resumen, '') || ' ' || COALESCE(extracto_verbatim, '')));

-- ============================================
-- 4. RELACIÓN HISTORIAS-ENTIDADES
-- ============================================

CREATE TABLE historia_entidades (
    id SERIAL PRIMARY KEY,
    historia_id INT REFERENCES historias(id) ON DELETE CASCADE,
    entidad_id INT REFERENCES entidades_paranormales(id) ON DELETE CASCADE,
    
    tipo_relacion VARCHAR(50) CHECK (tipo_relacion IN (
        'protagonista', 'aparicion_secundaria', 'mencion', 
        'investigacion', 'victima_de_entidad'
    )) DEFAULT 'protagonista',
    
    descripcion_interaccion TEXT,
    intensidad_encuentro SMALLINT CHECK (intensidad_encuentro BETWEEN 1 AND 5),
    duracion_encuentro_minutos INT,
    
    coincidencia_descripcion DECIMAL(3,2) CHECK (coincidencia_descripcion BETWEEN 0 AND 1),
    confianza_identificacion VARCHAR(20) CHECK (confianza_identificacion IN ('baja', 'media', 'alta')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(historia_id, entidad_id)
);

CREATE INDEX idx_historia_entidades_historia ON historia_entidades(historia_id);
CREATE INDEX idx_historia_entidades_entidad ON historia_entidades(entidad_id);
CREATE INDEX idx_historia_entidades_tipo ON historia_entidades(tipo_relacion);

-- ============================================
-- 5. SUBGÉNEROS Y ELEMENTOS CLAVE
-- ============================================

CREATE TABLE subgeneros (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT,
    color_hex VARCHAR(7),
    icono VARCHAR(50)
);

CREATE TABLE historia_subgeneros (
    historia_id INT REFERENCES historias(id) ON DELETE CASCADE,
    subgenero_id INT REFERENCES subgeneros(id) ON DELETE CASCADE,
    relevancia SMALLINT DEFAULT 1 CHECK (relevancia BETWEEN 1 AND 5),
    PRIMARY KEY (historia_id, subgenero_id)
);

CREATE TABLE elementos_clave (
    id SERIAL PRIMARY KEY,
    historia_id INT REFERENCES historias(id) ON DELETE CASCADE,
    elemento VARCHAR(100) NOT NULL,
    relevancia SMALLINT DEFAULT 1 CHECK (relevancia BETWEEN 1 AND 5),
    categoria VARCHAR(50) CHECK (categoria IN ('objeto', 'accion', 'lugar_especifico', 'persona', 'fenomeno', 'emocion'))
);

CREATE INDEX idx_elementos_elemento ON elementos_clave(elemento);
CREATE INDEX idx_elementos_categoria ON elementos_clave(categoria);
CREATE INDEX idx_elementos_historia ON elementos_clave(historia_id);

-- ============================================
-- 6. TESTIGOS Y FUENTES
-- ============================================

CREATE TABLE testigos (
    id SERIAL PRIMARY KEY,
    historia_id INT REFERENCES historias(id) ON DELETE CASCADE,
    tipo_testigo VARCHAR(50) CHECK (tipo_testigo IN ('principal', 'secundario', 'investigador', 'familiar', 'autoridad')) NOT NULL,
    
    nombre_completo VARCHAR(255),
    pseudonimo VARCHAR(100),
    edad_aprox SMALLINT,
    ocupacion VARCHAR(100),
    
    relacion_evento VARCHAR(255),
    presencial BOOLEAN DEFAULT TRUE,
    
    credibilidad_estimada SMALLINT CHECK (credibilidad_estimada BETWEEN 1 AND 5),
    factores_credibilidad JSONB DEFAULT '{}',
    antecedentes_paranormales BOOLEAN DEFAULT FALSE,
    
    contacto_disponible BOOLEAN DEFAULT FALSE,
    notas_testigo TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_testigos_historia ON testigos(historia_id);
CREATE INDEX idx_testigos_tipo ON testigos(tipo_testigo);
CREATE INDEX idx_testigos_credibilidad ON testigos(credibilidad_estimada);

-- ============================================
-- 7. CONTEXTO AMBIENTAL
-- ============================================

CREATE TABLE contexto_ambiental (
    id SERIAL PRIMARY KEY,
    historia_id INT REFERENCES historias(id) ON DELETE CASCADE,
    
    -- Condiciones físicas
    clima_evento VARCHAR(100),
    temperatura_aprox SMALLINT,
    humedad_aprox SMALLINT,
    presion_atmosferica VARCHAR(50),
    
    -- Condiciones astronómicas  
    fase_lunar VARCHAR(20),
    actividad_solar VARCHAR(50),
    
    -- Fechas y eventos especiales
    festividad_religiosa VARCHAR(100),
    evento_historico VARCHAR(255),
    aniversario_especial VARCHAR(255),
    
    -- Contexto social y emocional
    situacion_social VARCHAR(255),
    actividad_previa TEXT,
    estado_emocional_testigos VARCHAR(255),
    numero_personas_presente SMALLINT,
    
    patron_temporal_detectado BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_contexto_historia ON contexto_ambiental(historia_id);
CREATE INDEX idx_contexto_fase_lunar ON contexto_ambiental(fase_lunar);
CREATE INDEX idx_contexto_festividad ON contexto_ambiental(festividad_religiosa);

-- ============================================
-- 8. ARCHIVOS MULTIMEDIA
-- ============================================

CREATE TABLE archivos_multimedia (
    id SERIAL PRIMARY KEY,
    historia_id INT REFERENCES historias(id) ON DELETE CASCADE,
    
    tipo_archivo VARCHAR(50) CHECK (tipo_archivo IN (
        'audio_original', 'audio_adaptado', 'audio_completo', 'audio_preview',
        'imagen_portada', 'imagen_ilustracion', 'imagen_ubicacion',
        'video_promocional', 'video_investigacion',
        'transcript_pdf', 'documento_evidencia'
    )) NOT NULL,
    
    nombre_archivo VARCHAR(255) NOT NULL,
    ruta_absoluta VARCHAR(500) NOT NULL, -- URL de Cloudinary
    ruta_relativa VARCHAR(500) NOT NULL, -- Public ID de Cloudinary
    tamaño_bytes BIGINT,
    hash_archivo VARCHAR(64),
    
    -- Metadatos específicos de audio
    duracion_segundos INT NULL,
    formato VARCHAR(10) NULL,
    bitrate VARCHAR(20) NULL,
    sample_rate INT NULL,
    canales SMALLINT NULL,
    
    -- Metadatos específicos de imagen/video
    ancho_px INT NULL,
    alto_px INT NULL,
    fps SMALLINT NULL,
    
    metadata_extra JSONB NULL,
    descripcion TEXT,
    
    version SMALLINT DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Firebase Auth integration
    uploaded_by_uid VARCHAR(128), -- Firebase UID del usuario que subió
    
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_modificacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_archivos_historia ON archivos_multimedia(historia_id);
CREATE INDEX idx_archivos_tipo ON archivos_multimedia(tipo_archivo);
CREATE INDEX idx_archivos_activo ON archivos_multimedia(is_active);
CREATE INDEX idx_archivos_hash ON archivos_multimedia(hash_archivo);
CREATE INDEX idx_archivos_uploaded_by ON archivos_multimedia(uploaded_by_uid);

-- ============================================
-- 9. TEMPORADAS Y ORGANIZACIÓN
-- ============================================

CREATE TABLE temporadas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    numero_temporada INT,
    fecha_inicio DATE,
    fecha_fin DATE NULL,
    imagen_portada VARCHAR(500) NULL,
    activa BOOLEAN DEFAULT TRUE,
    tema_central VARCHAR(255),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE historia_temporadas (
    historia_id INT REFERENCES historias(id) ON DELETE CASCADE,
    temporada_id INT REFERENCES temporadas(id) ON DELETE CASCADE,
    numero_episodio INT,
    fecha_emision DATE,
    PRIMARY KEY (historia_id, temporada_id)
);

-- ============================================
-- 10. CONFIGURACIÓN DEL SISTEMA
-- ============================================

CREATE TABLE configuracion (
    clave VARCHAR(100) PRIMARY KEY,
    valor TEXT,
    tipo_dato VARCHAR(20) CHECK (tipo_dato IN ('string', 'integer', 'decimal', 'boolean', 'json')),
    descripcion TEXT,
    categoria VARCHAR(50),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TRIGGERS PARA AUTOMATIZACIÓN
-- ============================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_ubicaciones_updated_at BEFORE UPDATE ON ubicaciones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_entidades_updated_at BEFORE UPDATE ON entidades_paranormales FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_historias_updated_at BEFORE UPDATE ON historias FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_archivos_updated_at BEFORE UPDATE ON archivos_multimedia FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_configuracion_updated_at BEFORE UPDATE ON configuracion FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para actualizar contadores en ubicaciones
CREATE OR REPLACE FUNCTION update_ubicacion_stats()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE ubicaciones 
    SET numero_historias_reportadas = numero_historias_reportadas + 1,
        actividad_paranormal_reportada = TRUE,
        ultima_actividad_reportada = COALESCE(NEW.fecha_evento_inicio, CURRENT_DATE)
    WHERE id = NEW.ubicacion_id;
    
    -- Si es la primera historia en esta ubicación
    UPDATE ubicaciones 
    SET primera_actividad_reportada = COALESCE(NEW.fecha_evento_inicio, CURRENT_DATE)
    WHERE id = NEW.ubicacion_id AND primera_actividad_reportada IS NULL;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_ubicacion_stats_trigger 
AFTER INSERT ON historias
FOR EACH ROW EXECUTE FUNCTION update_ubicacion_stats();

-- Trigger para actualizar contadores en entidades
CREATE OR REPLACE FUNCTION update_entidad_stats()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE entidades_paranormales 
    SET numero_historias_asociadas = numero_historias_asociadas + 1,
        ultima_aparicion_conocida = (
            SELECT fecha_evento_inicio 
            FROM historias 
            WHERE id = NEW.historia_id
        )
    WHERE id = NEW.entidad_id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_entidad_stats_trigger
AFTER INSERT ON historia_entidades
FOR EACH ROW EXECUTE FUNCTION update_entidad_stats();

-- ============================================
-- DATOS INICIALES
-- ============================================

-- Configuración inicial
INSERT INTO configuracion (clave, valor, tipo_dato, descripcion, categoria) VALUES 
('proyecto_nombre', 'Archivos Paranormales', 'string', 'Nombre del proyecto', 'general'),
('version_schema', '1.0', 'string', 'Versión del schema de BD', 'sistema'),
('audio_bitrate_default', '192kbps', 'string', 'Bitrate por defecto', 'produccion'),
('duracion_preview_segundos', '30', 'integer', 'Duración de previews', 'produccion'),
('threshold_patron_geografico', '0.7', 'decimal', 'Umbral detección patrones geográficos', 'analytics'),
('threshold_patron_temporal', '0.8', 'decimal', 'Umbral detección patrones temporales', 'analytics'),
('radio_busqueda_km', '50', 'integer', 'Radio para buscar historias cercanas', 'analytics');

-- Subgéneros iniciales
INSERT INTO subgeneros (nombre, descripcion, color_hex, icono) VALUES 
('Fantasmas/Apariciones', 'Espíritus de personas fallecidas', '#E8E8E8', 'ghost'),
('Posesiones/Exorcismos', 'Entidades que controlan personas', '#B22222', 'demon'),
('Poltergeist', 'Objetos que se mueven solos', '#4169E1', 'move'),
('Demonología', 'Encuentros con demonios', '#8B0000', 'devil'),
('Brujería/Maldiciones', 'Magia y hechizos', '#8B008B', 'magic'),
('OVNIs/Aliens/Abducciones', 'Vida extraterrestre', '#00CED1', 'ufo'),
('Criaturas/Monstruos', 'Entidades no humanas', '#228B22', 'monster'),
('Premoniciones/Sueños', 'Visiones del futuro', '#FFD700', 'vision'),
('Misterio Inexplicable', 'Eventos sin explicación', '#A0A0A0', 'question');

-- Primera temporada
INSERT INTO temporadas (nombre, descripcion, numero_temporada, fecha_inicio, tema_central, activa) VALUES 
('Temporada 1: Orígenes', 'Las primeras historias que dieron origen al proyecto', 1, '2024-01-01', 'Testimonios originales del Cartel de la Mega', TRUE);

-- ============================================
-- RLS (Row Level Security) PARA FIREBASE AUTH
-- ============================================

-- Habilitar RLS en tablas principales
ALTER TABLE historias ENABLE ROW LEVEL SECURITY;
ALTER TABLE archivos_multimedia ENABLE ROW LEVEL SECURITY;

-- Política para historias: usuarios pueden ver todas las publicadas, pero solo editar las propias
-- Admin puede ver y editar todas las historias
CREATE POLICY "Historias públicas visibles" ON historias
    FOR SELECT USING (
        estado_procesamiento = 'publicada' 
        OR created_by_uid = current_setting('request.jwt.claims', true)::json->>'sub'
        OR current_setting('request.jwt.claims', true)::json->>'email' = 'wilmer13194@gmail.com'
    );

CREATE POLICY "Usuarios pueden crear historias" ON historias
    FOR INSERT WITH CHECK (
        created_by_uid = current_setting('request.jwt.claims', true)::json->>'sub'
    );

CREATE POLICY "Usuarios pueden editar sus historias" ON historias
    FOR UPDATE USING (
        created_by_uid = current_setting('request.jwt.claims', true)::json->>'sub'
        OR current_setting('request.jwt.claims', true)::json->>'email' = 'wilmer13194@gmail.com'
    );

-- Política especial para admin: puede hacer cualquier operación
CREATE POLICY "Admin total access" ON historias
    FOR ALL USING (
        current_setting('request.jwt.claims', true)::json->>'email' = 'wilmer13194@gmail.com'
    );

-- Política para archivos: solo el propietario puede ver/editar
CREATE POLICY "Archivos del propietario" ON archivos_multimedia
    FOR ALL USING (
        uploaded_by_uid = current_setting('request.jwt.claims', true)::json->>'sub'
        OR current_setting('request.jwt.claims', true)::json->>'email' = 'wilmer13194@gmail.com'
    );

-- Las demás tablas son de solo lectura para usuarios normales
ALTER TABLE ubicaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE entidades_paranormales ENABLE ROW LEVEL SECURITY;
ALTER TABLE subgeneros ENABLE ROW LEVEL SECURITY;
ALTER TABLE temporadas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura pública ubicaciones" ON ubicaciones FOR SELECT USING (true);
CREATE POLICY "Lectura pública entidades" ON entidades_paranormales FOR SELECT USING (true);
CREATE POLICY "Lectura pública subgeneros" ON subgeneros FOR SELECT USING (true);
CREATE POLICY "Lectura pública temporadas" ON temporadas FOR SELECT USING (true);

-- ============================================
-- GESTIÓN DE USUARIOS
-- ============================================

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    firebase_uid VARCHAR(255) UNIQUE NULL, -- UID de Firebase Auth
    email VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(255) NULL,
    avatar_url TEXT NULL,
    
    -- Roles y permisos
    rol VARCHAR(50) DEFAULT 'user' CHECK (rol IN ('user', 'premium', 'moderator', 'admin')),
    estado VARCHAR(50) DEFAULT 'active' CHECK (estado IN ('active', 'suspended', 'pending', 'banned')),
    
    -- Información de perfil
    telefono VARCHAR(50) NULL,
    fecha_nacimiento DATE NULL,
    genero VARCHAR(20) NULL,
    biografia TEXT NULL,
    
    -- Metadatos de cuenta
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP WITH TIME ZONE NULL,
    ultimo_login TIMESTAMP WITH TIME ZONE NULL,
    email_verificado BOOLEAN DEFAULT FALSE,
    telefono_verificado BOOLEAN DEFAULT FALSE,
    
    -- Estadísticas
    historias_enviadas INT DEFAULT 0,
    historias_aprobadas INT DEFAULT 0,
    puntos_credibilidad INT DEFAULT 0,
    
    -- Preferencias
    preferencias_notificaciones JSONB DEFAULT '{}',
    preferencias_privacidad JSONB DEFAULT '{}',
    configuracion_perfil JSONB DEFAULT '{}',
    
    -- Admin fields
    notas_admin TEXT NULL,
    creado_por_admin VARCHAR(255) NULL,
    
    CONSTRAINT usuarios_email_valido CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Índices para usuarios
CREATE INDEX idx_usuarios_firebase_uid ON usuarios(firebase_uid);
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_rol ON usuarios(rol);
CREATE INDEX idx_usuarios_estado ON usuarios(estado);
CREATE INDEX idx_usuarios_fecha_registro ON usuarios(fecha_registro DESC);
CREATE INDEX idx_usuarios_ultimo_login ON usuarios(ultimo_login DESC);

-- Función para actualizar último login
CREATE OR REPLACE FUNCTION actualizar_ultimo_login(user_uid VARCHAR)
RETURNS VOID AS $$
BEGIN
    UPDATE usuarios 
    SET ultimo_login = NOW() 
    WHERE firebase_uid = user_uid;
END;
$$ LANGUAGE plpgsql;

-- Función para incrementar estadísticas de usuario
CREATE OR REPLACE FUNCTION incrementar_estadisticas_usuario(
    user_uid VARCHAR,
    tipo_estadistica VARCHAR
) RETURNS VOID AS $$
BEGIN
    CASE tipo_estadistica
        WHEN 'historia_enviada' THEN
            UPDATE usuarios 
            SET historias_enviadas = historias_enviadas + 1 
            WHERE firebase_uid = user_uid;
        WHEN 'historia_aprobada' THEN
            UPDATE usuarios 
            SET historias_aprobadas = historias_aprobadas + 1,
                puntos_credibilidad = puntos_credibilidad + 10
            WHERE firebase_uid = user_uid;
        ELSE
            -- No hacer nada para tipos no reconocidos
            NULL;
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar fecha_actualizacion
CREATE OR REPLACE FUNCTION trigger_actualizar_fecha_usuarios()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_usuarios_fecha_actualizacion
    BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION trigger_actualizar_fecha_usuarios();

-- RLS para usuarios
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- Los usuarios pueden ver su propio perfil
CREATE POLICY "Usuarios pueden ver su perfil" ON usuarios
    FOR SELECT USING (firebase_uid = current_setting('request.jwt.claims', true)::json->>'sub');

-- Los usuarios pueden actualizar su propio perfil (campos limitados)
CREATE POLICY "Usuarios pueden actualizar su perfil" ON usuarios
    FOR UPDATE USING (firebase_uid = current_setting('request.jwt.claims', true)::json->>'sub');

-- Solo admins pueden ver todos los usuarios
CREATE POLICY "Admins pueden ver todos los usuarios" ON usuarios
    FOR SELECT USING (
        current_setting('request.jwt.claims', true)::json->>'email' IN ('wilmer13194@gmail.com', 'admin@paranormal.co')
    );

-- Solo admins pueden crear/modificar usuarios
CREATE POLICY "Admins pueden gestionar usuarios" ON usuarios
    FOR ALL USING (
        current_setting('request.jwt.claims', true)::json->>'email' IN ('wilmer13194@gmail.com', 'admin@paranormal.co')
    );

-- ============================================
-- CONFIGURACIÓN DE VISTA PRINCIPAL
-- ============================================

CREATE TABLE configuracion_homepage (
    id SERIAL PRIMARY KEY,
    configuracion JSONB NOT NULL, -- Estructura completa de la configuración
    activa BOOLEAN DEFAULT FALSE,
    
    -- Metadatos
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP WITH TIME ZONE NULL,
    creado_por VARCHAR(255) NULL, -- UID del admin que creó la configuración
    
    -- Índices
    CONSTRAINT configuracion_homepage_una_activa UNIQUE (activa) DEFERRABLE INITIALLY DEFERRED
);

-- Índices para configuración de homepage
CREATE INDEX idx_configuracion_homepage_activa ON configuracion_homepage(activa) WHERE activa = TRUE;
CREATE INDEX idx_configuracion_homepage_fecha ON configuracion_homepage(fecha_creacion DESC);

-- Función para validar estructura de configuración
CREATE OR REPLACE FUNCTION validar_configuracion_homepage(config JSONB)
RETURNS BOOLEAN AS $$
BEGIN
    -- Verificar que tenga hero_story
    IF NOT (config ? 'hero_story') THEN
        RETURN FALSE;
    END IF;
    
    -- Verificar que tenga carousels y sea un array
    IF NOT (config ? 'carousels') OR jsonb_typeof(config->'carousels') != 'array' THEN
        RETURN FALSE;
    END IF;
    
    -- Verificar que cada carousel tenga la estructura necesaria
    IF NOT (
        SELECT bool_and(
            carousel ? 'id' AND 
            carousel ? 'titulo' AND 
            carousel ? 'stories' AND 
            carousel ? 'orden' AND
            jsonb_typeof(carousel->'stories') = 'array'
        )
        FROM jsonb_array_elements(config->'carousels') AS carousel
    ) THEN
        RETURN FALSE;
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Trigger para validar configuración antes de insertar/actualizar
CREATE OR REPLACE FUNCTION trigger_validar_configuracion_homepage()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT validar_configuracion_homepage(NEW.configuracion) THEN
        RAISE EXCEPTION 'Configuración de homepage inválida: debe contener hero_story y carousels válidos';
    END IF;
    
    -- Si se está marcando como activa, desactivar las demás
    IF NEW.activa = TRUE THEN
        UPDATE configuracion_homepage 
        SET activa = FALSE 
        WHERE id != NEW.id AND activa = TRUE;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validar_configuracion_homepage
    BEFORE INSERT OR UPDATE ON configuracion_homepage
    FOR EACH ROW EXECUTE FUNCTION trigger_validar_configuracion_homepage();

-- RLS para configuración homepage (solo admins)
ALTER TABLE configuracion_homepage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Solo admins configuracion homepage" ON configuracion_homepage FOR ALL USING (
    current_setting('request.jwt.claims', true)::json->>'email' IN ('wilmer13194@gmail.com', 'admin@paranormal.co')
);

-- Insertar configuración por defecto
INSERT INTO configuracion_homepage (configuracion, activa, creado_por) VALUES (
    '{
        "hero_story": 1,
        "carousels": [
            {
                "id": "populares",
                "titulo": "🔥 Más Populares",
                "stories": [1, 3, 5, 2],
                "orden": 1
            },
            {
                "id": "fantasmas",
                "titulo": "👻 Fantasmas y Apariciones", 
                "stories": [1, 5],
                "orden": 2
            },
            {
                "id": "posesiones",
                "titulo": "😈 Posesiones y Demonios",
                "stories": [6, 3],
                "orden": 3
            },
            {
                "id": "regional",
                "titulo": "🗺️ Historias de tu Región",
                "stories": [2, 1, 5],
                "orden": 4
            }
        ]
    }'::jsonb,
    TRUE,
    'system'
);