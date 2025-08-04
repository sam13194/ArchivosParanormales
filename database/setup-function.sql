-- Función para crear las tablas necesarias
CREATE OR REPLACE FUNCTION setup_database()
RETURNS TEXT AS $$
DECLARE
    result TEXT := 'Setup completed: ';
BEGIN
    -- Crear tabla usuarios
    BEGIN
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
            creado_por_admin VARCHAR(255) NULL,
            CONSTRAINT usuarios_email_valido CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$')
        );
        result := result || 'usuarios ';
    EXCEPTION WHEN OTHERS THEN
        result := result || 'usuarios(error) ';
    END;

    -- Crear tabla configuracion_homepage
    BEGIN
        CREATE TABLE IF NOT EXISTS configuracion_homepage (
            id SERIAL PRIMARY KEY,
            configuracion JSONB NOT NULL,
            activa BOOLEAN DEFAULT FALSE,
            fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            fecha_actualizacion TIMESTAMP WITH TIME ZONE NULL,
            creado_por VARCHAR(255) NULL
        );
        result := result || 'configuracion_homepage ';
    EXCEPTION WHEN OTHERS THEN
        result := result || 'configuracion_homepage(error) ';
    END;

    -- Insertar usuario admin inicial
    BEGIN
        INSERT INTO usuarios (email, display_name, rol, estado, firebase_uid, email_verificado)
        VALUES ('wilmer13194@gmail.com', 'Wilmer Admin', 'admin', 'active', null, true)
        ON CONFLICT (email) DO NOTHING;
        result := result || 'admin_user ';
    EXCEPTION WHEN OTHERS THEN
        result := result || 'admin_user(error) ';
    END;

    -- Insertar configuración por defecto
    BEGIN
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
                    }
                ]
            }'::jsonb,
            TRUE,
            'system'
        ) ON CONFLICT DO NOTHING;
        result := result || 'default_config ';
    EXCEPTION WHEN OTHERS THEN
        result := result || 'default_config(error) ';
    END;

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;