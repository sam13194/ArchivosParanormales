-- ============================================
-- REPARAR CONSTRAINT DE EMAIL EN USUARIOS
-- ============================================
-- Ejecutar en Supabase SQL Editor para corregir el error de validación

-- 1. Eliminar constraint incorrecto
ALTER TABLE usuarios DROP CONSTRAINT IF EXISTS usuarios_email_valido;

-- 2. Agregar constraint correcto con expresión regular válida
ALTER TABLE usuarios ADD CONSTRAINT usuarios_email_valido 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- 3. Insertar usuario admin inicial (ahora debería funcionar)
INSERT INTO usuarios (email, display_name, rol, estado, firebase_uid, email_verificado)
VALUES ('wilmer13194@gmail.com', 'Wilmer Admin', 'admin', 'active', null, true)
ON CONFLICT (email) DO NOTHING;

-- 4. Agregar algunos usuarios de ejemplo
INSERT INTO usuarios (email, display_name, rol, estado, fecha_registro) VALUES 
('maria.garcia@gmail.com', 'María García', 'premium', 'active', NOW()),
('carlos.ruiz@yahoo.com', 'Carlos Ruiz', 'user', 'active', NOW()),
('ana.lopez@hotmail.com', 'Ana López', 'user', 'suspended', NOW()),
('pedro.martin@gmail.com', 'Pedro Martín', 'moderator', 'active', NOW())
ON CONFLICT (email) DO NOTHING;

-- 5. Verificación
SELECT 'usuarios' as tabla, count(*) as registros FROM usuarios;