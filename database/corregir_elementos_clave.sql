-- =====================================================
-- CORRECCIÓN PARA ELEMENTOS_CLAVE - CHECK CONSTRAINT
-- =====================================================

-- Primero, ver qué valores están permitidos en categoria
SELECT 
    tc.table_name,
    tc.constraint_name,
    cc.check_clause
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.check_constraints cc ON tc.constraint_name = cc.constraint_name
WHERE tc.table_schema = 'public' 
    AND tc.table_name = 'elementos_clave'
    AND tc.constraint_type = 'CHECK';

-- Ver la estructura actual
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name = 'elementos_clave'
ORDER BY ordinal_position;

-- Ver datos existentes para entender el patrón
SELECT DISTINCT categoria FROM elementos_clave;

-- Si el constraint es muy restrictivo, podemos eliminarlo y recrearlo
-- (SOLO ejecutar si es necesario después de ver los resultados anteriores)

-- OPCIÓN 1: Eliminar el constraint restrictivo
-- ALTER TABLE elementos_clave DROP CONSTRAINT elementos_clave_categoria_check;

-- OPCIÓN 2: Recrear el constraint con valores correctos
-- ALTER TABLE elementos_clave ADD CONSTRAINT elementos_clave_categoria_check 
-- CHECK (categoria IN ('lugar_especifico', 'fenomeno', 'entidad', 'objeto', 'persona'));

-- OPCIÓN 3: Insertar datos con categorías que sabemos que funcionan
-- Basándome en el error, parece que 'entidad' no está permitido
-- Vamos a usar valores que probablemente sí estén permitidos

DO $$
BEGIN
    -- Intentar con 'fenomeno' en lugar de 'entidad'
    IF NOT EXISTS (SELECT 1 FROM elementos_clave WHERE elemento = 'figura masculina' AND categoria = 'fenomeno') THEN
        INSERT INTO elementos_clave (elemento, categoria, descripcion) VALUES ('figura masculina', 'fenomeno', 'Aparición de forma humana masculina');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM elementos_clave WHERE elemento = 'figura femenina' AND categoria = 'fenomeno') THEN
        INSERT INTO elementos_clave (elemento, categoria, descripcion) VALUES ('figura femenina', 'fenomeno', 'Aparición de forma humana femenina');
    END IF;
    
    -- Otros elementos que probablemente funcionen
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
    
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error insertando elementos: %', SQLERRM;
END $$;

-- Verificar qué se insertó
SELECT * FROM elementos_clave ORDER BY id;