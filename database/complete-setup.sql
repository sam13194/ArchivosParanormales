-- ============================================
-- SETUP COMPLETO PARA ARCHIVOS PARANORMALES
-- ============================================
-- Ejecutar en Supabase SQL Editor: https://app.supabase.com/project/rcznxhzstgclbgghnfeh/sql/new

-- 1. Crear tabla usuarios SIN constraint problemático
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    firebase_uid VARCHAR(255) UNIQUE NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(255) NULL,
    avatar_url TEXT NULL,
    rol VARCHAR(50) DEFAULT 'user' CHECK (rol IN ('user', 'premium', 'moderator', 'admin')),
    estado VARCHAR(50) DEFAULT 'active' CHECK (estado IN ('active', 'suspended', 'pending', 'banned')),
    telefono VARCHAR(50) NULL,
    fecha_nacimiento DATE NULL,
    genero VARCHAR(20) NULL,
    biografia TEXT NULL,
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP WITH TIME ZONE NULL,
    ultimo_login TIMESTAMP WITH TIME ZONE NULL,
    email_verificado BOOLEAN DEFAULT FALSE,
    telefono_verificado BOOLEAN DEFAULT FALSE,
    historias_enviadas INT DEFAULT 0,
    historias_aprobadas INT DEFAULT 0,
    puntos_credibilidad INT DEFAULT 0,
    preferencias_notificaciones JSONB DEFAULT '{}',
    preferencias_privacidad JSONB DEFAULT '{}',
    configuracion_perfil JSONB DEFAULT '{}',
    notas_admin TEXT NULL,
    creado_por_admin VARCHAR(255) NULL
);

-- 2. Crear tabla configuracion_homepage
CREATE TABLE IF NOT EXISTS configuracion_homepage (
    id SERIAL PRIMARY KEY,
    configuracion JSONB NOT NULL,
    activa BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP WITH TIME ZONE NULL,
    creado_por VARCHAR(255) NULL
);

-- 3. Agregar constraint de email CORRECTO
ALTER TABLE usuarios ADD CONSTRAINT usuarios_email_valido 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- 4. Insertar usuario admin inicial
INSERT INTO usuarios (email, display_name, rol, estado, firebase_uid, email_verificado)
VALUES ('wilmer13194@gmail.com', 'Wilmer Admin', 'admin', 'active', null, true)
ON CONFLICT (email) DO NOTHING;

-- 5. Insertar configuración por defecto de homepage
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

-- 6. Agregar algunos usuarios de ejemplo
INSERT INTO usuarios (email, display_name, rol, estado, fecha_registro) VALUES 
('maria.garcia@gmail.com', 'María García', 'premium', 'active', NOW()),
('carlos.ruiz@yahoo.com', 'Carlos Ruiz', 'user', 'active', NOW()),
('ana.lopez@hotmail.com', 'Ana López', 'user', 'suspended', NOW()),
('pedro.martin@gmail.com', 'Pedro Martín', 'moderator', 'active', NOW())
ON CONFLICT (email) DO NOTHING;

-- 7. Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_usuarios_firebase_uid ON usuarios(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON usuarios(rol);
CREATE INDEX IF NOT EXISTS idx_usuarios_estado ON usuarios(estado);
CREATE INDEX IF NOT EXISTS idx_usuarios_fecha_registro ON usuarios(fecha_registro DESC);

CREATE INDEX IF NOT EXISTS idx_configuracion_homepage_activa ON configuracion_homepage(activa) WHERE activa = TRUE;
CREATE INDEX IF NOT EXISTS idx_configuracion_homepage_fecha ON configuracion_homepage(fecha_creacion DESC);

-- 8. Verificación final
SELECT 'Tablas creadas exitosamente!' as status;
SELECT 'usuarios' as tabla, count(*) as registros FROM usuarios
UNION ALL
SELECT 'configuracion_homepage' as tabla, count(*) as registros FROM configuracion_homepage;

-- 9. Mostrar usuarios creados
SELECT id, email, display_name, rol, estado, fecha_registro FROM usuarios ORDER BY id;