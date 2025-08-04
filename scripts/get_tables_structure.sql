-- =====================================================
-- SCRIPT SIMPLE PARA ESTRUCTURA DE TABLAS PRINCIPALES
-- Archivos Paranormales
-- =====================================================

-- ========== ESTRUCTURA DE LA TABLA HISTORIAS ==========
SELECT 
    'HISTORIAS' as tabla,
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'historias' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- ========== ESTRUCTURA DE LA TABLA METRICAS_INICIALES ==========
SELECT 
    'METRICAS_INICIALES' as tabla,
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'metricas_iniciales' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- ========== ESTRUCTURA DE LA TABLA UBICACIONES ==========
SELECT 
    'UBICACIONES' as tabla,
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'ubicaciones' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- ========== ESTRUCTURA DE LA TABLA USUARIOS ==========
SELECT 
    'USUARIOS' as tabla,
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'usuarios' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- ========== VERIFICAR QUE COLUMNAS EXISTEN EN HISTORIAS ==========
SELECT 
    'VERIFICACION_HISTORIAS' as seccion,
    CASE WHEN COUNT(*) > 0 THEN 'EXISTS' ELSE 'NOT_EXISTS' END as status,
    'reproducciones_totales' as column_name
FROM information_schema.columns 
WHERE table_name = 'historias' 
  AND column_name = 'reproducciones_totales'
  AND table_schema = 'public'

UNION ALL

SELECT 
    'VERIFICACION_HISTORIAS' as seccion,
    CASE WHEN COUNT(*) > 0 THEN 'EXISTS' ELSE 'NOT_EXISTS' END as status,
    'likes_count' as column_name
FROM information_schema.columns 
WHERE table_name = 'historias' 
  AND column_name = 'likes_count'
  AND table_schema = 'public'

UNION ALL

SELECT 
    'VERIFICACION_HISTORIAS' as seccion,
    CASE WHEN COUNT(*) > 0 THEN 'EXISTS' ELSE 'NOT_EXISTS' END as status,
    'comentarios' as column_name
FROM information_schema.columns 
WHERE table_name = 'historias' 
  AND column_name = 'comentarios'
  AND table_schema = 'public'

UNION ALL

SELECT 
    'VERIFICACION_HISTORIAS' as seccion,
    CASE WHEN COUNT(*) > 0 THEN 'EXISTS' ELSE 'NOT_EXISTS' END as status,
    'comentarios_count' as column_name
FROM information_schema.columns 
WHERE table_name = 'historias' 
  AND column_name = 'comentarios_count'
  AND table_schema = 'public';