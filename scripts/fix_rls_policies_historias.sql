-- =====================================================
-- CORREGIR POLÍTICAS RLS PARA LA TABLA HISTORIAS
-- Ejecutar en Supabase SQL Console
-- =====================================================

-- Verificar si RLS está habilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'historias' AND schemaname = 'public';

-- Listar políticas existentes
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'historias' AND schemaname = 'public';

-- Eliminar políticas existentes que puedan estar causando problemas
DROP POLICY IF EXISTS "Allow read access to authenticated users" ON historias;
DROP POLICY IF EXISTS "Allow all operations to service role" ON historias;
DROP POLICY IF EXISTS "Enable read access for all users" ON historias;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON historias;

-- Crear política para permitir todas las operaciones al service role
CREATE POLICY "Allow all operations to service role" 
ON historias 
FOR ALL 
TO service_role 
USING (true);

-- Crear política para permitir lectura a usuarios autenticados
CREATE POLICY "Allow read access to authenticated users" 
ON historias 
FOR SELECT 
TO authenticated 
USING (true);

-- Crear política para permitir inserción a usuarios autenticados (para admins)
CREATE POLICY "Allow insert for authenticated users" 
ON historias 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Crear política para permitir actualización a usuarios autenticados (para admins)
CREATE POLICY "Allow update for authenticated users" 
ON historias 
FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);

-- Verificar que las políticas se crearon correctamente
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'historias' AND schemaname = 'public';

-- También asegurar que RLS esté habilitado
ALTER TABLE historias ENABLE ROW LEVEL SECURITY;

-- Verificar el estado final
SELECT 
    schemaname, 
    tablename, 
    rowsecurity as rls_enabled,
    (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'historias') as policy_count
FROM pg_tables 
WHERE tablename = 'historias' AND schemaname = 'public';