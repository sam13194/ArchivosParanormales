# Instrucciones para Descargar el Esquema de Supabase

## Opción 1: Desde el Dashboard de Supabase
1. Ve a: https://app.supabase.com/project/rcznxhzstgclbgghnfeh/settings/database
2. En la sección "Connection Parameters", busca la opción "Download schema"
3. O ve a la pestaña "API" y busca la opción de exportar esquema

## Opción 2: Usando SQL directo en Supabase
Ejecuta este query en el SQL Editor (https://app.supabase.com/project/rcznxhzstgclbgghnfeh/sql/new):

```sql
-- Ver todas las tablas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Ver todas las columnas de una tabla específica (ejemplo: elementos_clave)
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name = 'elementos_clave'
ORDER BY ordinal_position;

-- Ver todos los constraints de check
SELECT 
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    cc.check_clause
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.check_constraints cc ON tc.constraint_name = cc.constraint_name
WHERE tc.table_schema = 'public' 
    AND tc.constraint_type = 'CHECK'
ORDER BY tc.table_name, tc.constraint_name;

-- Ver todos los constraints únicos
SELECT 
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_schema = 'public' 
    AND tc.constraint_type = 'UNIQUE'
ORDER BY tc.table_name, tc.constraint_name;
```

## Opción 3: Usando pg_dump (línea de comandos)
Si tienes acceso a la línea de comandos:

```bash
pg_dump -h db.rcznxhzstgclbgghnfeh.supabase.co -p 5432 -U postgres -d postgres --schema-only > esquema_actual.sql
```

## Información Específica que Necesito
Para solucionar el error actual, necesito especialmente:

1. **Estructura completa de la tabla elementos_clave**
2. **Todos los CHECK constraints de esa tabla**
3. **Los valores permitidos en la columna 'categoria'**

El error indica que hay un CHECK constraint en elementos_clave.categoria que no permite el valor 'entidad'.