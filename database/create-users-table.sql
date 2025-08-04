-- ============================================
-- TABLA DE USUARIOS SIMPLIFICADA
-- ============================================

CREATE TABLE IF NOT EXISTS usuarios (
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
    
    CONSTRAINT usuarios_email_valido CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$')
);

-- Índices para usuarios
CREATE INDEX IF NOT EXISTS idx_usuarios_firebase_uid ON usuarios(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON usuarios(rol);
CREATE INDEX IF NOT EXISTS idx_usuarios_estado ON usuarios(estado);
CREATE INDEX IF NOT EXISTS idx_usuarios_fecha_registro ON usuarios(fecha_registro DESC);
CREATE INDEX IF NOT EXISTS idx_usuarios_ultimo_login ON usuarios(ultimo_login DESC);

-- RLS para usuarios
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- Los usuarios pueden ver su propio perfil
DROP POLICY IF EXISTS "Usuarios pueden ver su perfil" ON usuarios;
CREATE POLICY "Usuarios pueden ver su perfil" ON usuarios
    FOR SELECT USING (firebase_uid = current_setting('request.jwt.claims', true)::json->>'sub');

-- Los usuarios pueden actualizar su propio perfil (campos limitados)
DROP POLICY IF EXISTS "Usuarios pueden actualizar su perfil" ON usuarios;
CREATE POLICY "Usuarios pueden actualizar su perfil" ON usuarios
    FOR UPDATE USING (firebase_uid = current_setting('request.jwt.claims', true)::json->>'sub');

-- Solo admins pueden ver todos los usuarios
DROP POLICY IF EXISTS "Admins pueden ver todos los usuarios" ON usuarios;
CREATE POLICY "Admins pueden ver todos los usuarios" ON usuarios
    FOR SELECT USING (
        current_setting('request.jwt.claims', true)::json->>'email' IN ('wilmer13194@gmail.com', 'admin@paranormal.co')
    );

-- Solo admins pueden crear/modificar usuarios
DROP POLICY IF EXISTS "Admins pueden gestionar usuarios" ON usuarios;
CREATE POLICY "Admins pueden gestionar usuarios" ON usuarios
    FOR ALL USING (
        current_setting('request.jwt.claims', true)::json->>'email' IN ('wilmer13194@gmail.com', 'admin@paranormal.co')
    );

-- Insertar usuario admin inicial
INSERT INTO usuarios (email, display_name, rol, estado, firebase_uid, email_verificado)
VALUES ('wilmer13194@gmail.com', 'Wilmer Admin', 'admin', 'active', null, true)
ON CONFLICT (email) DO NOTHING;