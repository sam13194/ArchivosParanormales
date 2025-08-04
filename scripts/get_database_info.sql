-- =====================================================
-- SCRIPT PARA OBTENER INFORMACIÓN COMPLETA DE LA BASE DE DATOS
-- Archivos Paranormales - Estructura y Datos
-- =====================================================

-- ========== 1. INFORMACIÓN GENERAL DE TABLAS ==========
SELECT 
    t.table_name,
    t.table_type,
    obj_description(c.oid, 'pg_class') as table_comment
FROM information_schema.tables t
LEFT JOIN pg_class c ON c.relname = t.table_name
WHERE t.table_schema = 'public' 
  AND t.table_type = 'BASE TABLE'
ORDER BY t.table_name;

-- ========== 2. ESTRUCTURA COMPLETA DE TODAS LAS TABLAS ==========
SELECT 
    t.table_name,
    c.column_name,
    c.ordinal_position,
    c.data_type,
    c.character_maximum_length,
    c.numeric_precision,
    c.numeric_scale,
    c.is_nullable,
    c.column_default,
    col_description(pgc.oid, c.ordinal_position) as column_comment
FROM information_schema.tables t
INNER JOIN information_schema.columns c ON c.table_name = t.table_name
LEFT JOIN pg_class pgc ON pgc.relname = t.table_name
WHERE t.table_schema = 'public' 
  AND t.table_type = 'BASE TABLE'
ORDER BY t.table_name, c.ordinal_position;

-- ========== 3. CONSTRAINTS Y CLAVES ==========
SELECT 
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    rc.update_rule,
    rc.delete_rule
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
LEFT JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
LEFT JOIN information_schema.referential_constraints AS rc
    ON tc.constraint_name = rc.constraint_name
WHERE tc.table_schema = 'public'
ORDER BY tc.table_name, tc.constraint_type, tc.constraint_name;

-- ========== 4. ÍNDICES ==========
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- ========== 5. SECUENCIAS ==========
SELECT 
    sequence_name,
    data_type,
    numeric_precision,
    numeric_scale,
    start_value,
    minimum_value,
    maximum_value,
    increment,
    cycle_option
FROM information_schema.sequences
WHERE sequence_schema = 'public'
ORDER BY sequence_name;

-- ========== 6. FUNCIONES Y TRIGGERS ==========
SELECT 
    n.nspname as schema_name,
    p.proname as function_name,
    pg_get_function_result(p.oid) as result_type,
    pg_get_function_arguments(p.oid) as arguments,
    CASE p.prokind 
        WHEN 'f' THEN 'FUNCTION'
        WHEN 'p' THEN 'PROCEDURE'
        WHEN 'a' THEN 'AGGREGATE'
        WHEN 'w' THEN 'WINDOW'
    END as function_type
FROM pg_proc p
LEFT JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
ORDER BY function_name;

-- ========== 7. TRIGGERS ==========
SELECT 
    t.trigger_name,
    t.event_manipulation,
    t.event_object_table,
    t.action_statement,
    t.action_timing,
    t.action_orientation
FROM information_schema.triggers t
WHERE t.trigger_schema = 'public'
ORDER BY t.event_object_table, t.trigger_name;

-- ========== 8. VISTAS ==========
SELECT 
    table_name as view_name,
    view_definition
FROM information_schema.views
WHERE table_schema = 'public'
ORDER BY table_name;

-- ========== 9. DATOS DE MUESTRA DE TABLAS PRINCIPALES ==========

-- Contar registros en todas las tablas
SELECT 
    schemaname,
    relname as tablename,
    n_tup_ins as inserts,
    n_tup_upd as updates,
    n_tup_del as deletes,
    n_live_tup as live_tuples,
    n_dead_tup as dead_tuples
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY relname;

-- ========== 10. INFORMACIÓN ESPECÍFICA DE HISTORIAS ==========
SELECT 
    'historias' as tabla,
    COUNT(*) as total_registros,
    COUNT(CASE WHEN estado_procesamiento = 'publicada' THEN 1 END) as publicadas,
    COUNT(CASE WHEN estado_procesamiento = 'pendiente_revision' THEN 1 END) as pendientes,
    COUNT(CASE WHEN created_by_uid IS NOT NULL THEN 1 END) as con_autor,
    MIN(fecha_creacion) as primera_historia,
    MAX(fecha_creacion) as ultima_historia
FROM historias;

-- ========== 11. INFORMACIÓN ESPECÍFICA DE UBICACIONES ==========
SELECT 
    'ubicaciones' as tabla,
    COUNT(*) as total_registros,
    COUNT(DISTINCT pais) as paises_diferentes,
    COUNT(DISTINCT nivel1_nombre) as departamentos_diferentes,
    COUNT(CASE WHEN actividad_paranormal_reportada = true THEN 1 END) as con_actividad_paranormal
FROM ubicaciones;

-- ========== 12. INFORMACIÓN ESPECÍFICA DE USUARIOS ==========
SELECT 
    'usuarios' as tabla,
    COUNT(*) as total_usuarios,
    COUNT(CASE WHEN role = 'admin' THEN 1 END) as admins,
    COUNT(CASE WHEN role = 'user' THEN 1 END) as usuarios_normales,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as activos,
    COUNT(CASE WHEN email_verified = true THEN 1 END) as emails_verificados
FROM usuarios;

-- ========== 13. INFORMACIÓN DE SUBGÉNEROS ==========
SELECT 
    s.nombre,
    s.descripcion,
    s.color_hex,
    s.icono,
    COUNT(hs.historia_id) as historias_asociadas
FROM subgeneros s
LEFT JOIN historia_subgeneros hs ON s.id = hs.subgenero_id
GROUP BY s.id, s.nombre, s.descripcion, s.color_hex, s.icono
ORDER BY historias_asociadas DESC, s.nombre;

-- ========== 14. MÉTRICAS GENERALES ==========
SELECT 
    'metricas_iniciales' as tabla,
    COUNT(*) as total_registros,
    SUM(reproducciones) as total_reproducciones,
    SUM(me_gusta) as total_likes,
    SUM(comentarios) as total_comentarios,
    SUM(compartidos) as total_compartidos,
    AVG(reproducciones) as promedio_reproducciones
FROM metricas_iniciales;

-- ========== 15. INFORMACIÓN DE ARCHIVOS MULTIMEDIA ==========
SELECT 
    tipo_archivo,
    COUNT(*) as cantidad,
    COUNT(CASE WHEN estado_procesamiento = 'completado' THEN 1 END) as completados,
    AVG(tamano_bytes) as tamano_promedio_bytes,
    SUM(tamano_bytes) as tamano_total_bytes
FROM archivos_multimedia
GROUP BY tipo_archivo
ORDER BY cantidad DESC;

-- ========== 16. INFORMACIÓN DE TESTIGOS ==========
SELECT 
    tipo_testigo,
    COUNT(*) as cantidad,
    AVG(credibilidad_estimada) as credibilidad_promedio,
    COUNT(CASE WHEN presencial = true THEN 1 END) as testigos_presenciales,
    COUNT(CASE WHEN contacto_disponible = true THEN 1 END) as con_contacto_disponible
FROM testigos
GROUP BY tipo_testigo
ORDER BY cantidad DESC;

-- ========== 17. RESUMEN FINAL ==========
SELECT 
    'RESUMEN GENERAL' as seccion,
    '' as detalle
UNION ALL
SELECT 
    'Total de tablas en la base de datos',
    COUNT(*)::text
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
UNION ALL
SELECT 
    'Total de vistas',
    COUNT(*)::text
FROM information_schema.views 
WHERE table_schema = 'public'
UNION ALL
SELECT 
    'Total de funciones',
    COUNT(*)::text
FROM pg_proc p
LEFT JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
UNION ALL
SELECT 
    'Total de índices',
    COUNT(*)::text
FROM pg_indexes 
WHERE schemaname = 'public';