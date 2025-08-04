-- =====================================================
-- AGREGAR COLUMNAS FALTANTES A LA TABLA HISTORIAS
-- Ejecutar en Supabase SQL Console
-- =====================================================

-- Agregar columnas que faltan en la tabla historias
ALTER TABLE historias 
ADD COLUMN IF NOT EXISTS descripcion_corta TEXT,
ADD COLUMN IF NOT EXISTS descripcion_larga TEXT,
ADD COLUMN IF NOT EXISTS testimonio_completo TEXT,
ADD COLUMN IF NOT EXISTS fecha_sucesos TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS nivel_credibilidad INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS nivel_impacto INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS fecha_publicacion TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS moderado_por_uid VARCHAR(100),
ADD COLUMN IF NOT EXISTS fecha_moderacion TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS notas_moderacion TEXT;

-- Verificar que las columnas se agregaron correctamente
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'historias' 
  AND table_schema = 'public'
  AND column_name IN (
    'descripcion_corta',
    'descripcion_larga', 
    'testimonio_completo',
    'fecha_sucesos',
    'nivel_credibilidad',
    'nivel_impacto',
    'fecha_publicacion',
    'moderado_por_uid',
    'fecha_moderacion',
    'notas_moderacion'
  )
ORDER BY column_name;