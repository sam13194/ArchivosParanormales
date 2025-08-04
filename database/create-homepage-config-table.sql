-- ============================================
-- TABLA DE CONFIGURACIÓN DE VISTA PRINCIPAL
-- ============================================

CREATE TABLE IF NOT EXISTS configuracion_homepage (
    id SERIAL PRIMARY KEY,
    configuracion JSONB NOT NULL, -- Estructura completa de la configuración
    activa BOOLEAN DEFAULT FALSE,
    
    -- Metadatos
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP WITH TIME ZONE NULL,
    creado_por VARCHAR(255) NULL -- UID del admin que creó la configuración
);

-- Índices para configuración de homepage
CREATE INDEX IF NOT EXISTS idx_configuracion_homepage_activa ON configuracion_homepage(activa) WHERE activa = TRUE;
CREATE INDEX IF NOT EXISTS idx_configuracion_homepage_fecha ON configuracion_homepage(fecha_creacion DESC);

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
        WHERE id != COALESCE(NEW.id, -1) AND activa = TRUE;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_validar_configuracion_homepage ON configuracion_homepage;
CREATE TRIGGER trigger_validar_configuracion_homepage
    BEFORE INSERT OR UPDATE ON configuracion_homepage
    FOR EACH ROW EXECUTE FUNCTION trigger_validar_configuracion_homepage();

-- RLS para configuración homepage (solo admins)
ALTER TABLE configuracion_homepage ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Solo admins configuracion homepage" ON configuracion_homepage;
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
) ON CONFLICT DO NOTHING;