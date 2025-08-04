const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rcznxhzstgclbgghnfeh.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjem54aHpzdGdjbGJnZ2huZmVoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzY0NTU4MSwiZXhwIjoyMDY5MjIxNTgxfQ.dj6QVrNGW1NkePOGU-Z4Vm-cK8XmLUcpNSs3yrCu5Q4';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  console.log('Setting up database tables...');

  try {
    // Crear tabla usuarios
    console.log('Creating usuarios table...');
    const createUsersSQL = `
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
          CONSTRAINT usuarios_email_valido CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\\\.[A-Za-z]{2,}$')
      );
    `;

    // Ejecutar usando rpc (si está disponible)
    const { data: result1, error: error1 } = await supabase.rpc('exec_sql', {
      sql: createUsersSQL
    });

    if (error1) {
      console.log('RPC exec_sql not available, will handle differently');
    } else {
      console.log('Users table created successfully');
    }

    // Insertar usuario admin inicial
    console.log('Creating admin user...');
    const { data: adminUser, error: adminError } = await supabase
      .from('usuarios')
      .upsert({
        email: 'wilmer13194@gmail.com',
        display_name: 'Wilmer Admin',
        rol: 'admin',
        estado: 'active',
        email_verificado: true
      }, { 
        onConflict: 'email',
        ignoreDuplicates: true 
      });

    if (adminError) {
      console.error('Error creating admin user:', adminError);
    } else {
      console.log('Admin user created successfully');
    }

    // Crear tabla configuracion_homepage
    console.log('Creating configuracion_homepage table...');
    const createHomepageSQL = `
      CREATE TABLE IF NOT EXISTS configuracion_homepage (
          id SERIAL PRIMARY KEY,
          configuracion JSONB NOT NULL,
          activa BOOLEAN DEFAULT FALSE,
          fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          fecha_actualizacion TIMESTAMP WITH TIME ZONE NULL,
          creado_por VARCHAR(255) NULL
      );
    `;

    const { data: result2, error: error2 } = await supabase.rpc('exec_sql', {
      sql: createHomepageSQL
    });

    if (error2) {
      console.log('Could not create homepage table via RPC');
    } else {
      console.log('Homepage config table created successfully');
    }

    // Insertar configuración por defecto
    const defaultConfig = {
      hero_story: 1,
      carousels: [
        {
          id: "populares",
          titulo: "🔥 Más Populares",
          stories: [1, 3, 5, 2],
          orden: 1
        },
        {
          id: "fantasmas",
          titulo: "👻 Fantasmas y Apariciones", 
          stories: [1, 5],
          orden: 2
        },
        {
          id: "posesiones",
          titulo: "😈 Posesiones y Demonios",
          stories: [6, 3],
          orden: 3
        },
        {
          id: "regional",
          titulo: "🗺️ Historias de tu Región",
          stories: [2, 1, 5],
          orden: 4
        }
      ]
    };

    const { data: config, error: configError } = await supabase
      .from('configuracion_homepage')
      .upsert({
        configuracion: defaultConfig,
        activa: true,
        creado_por: 'system'
      }, { 
        ignoreDuplicates: true 
      });

    if (configError) {
      console.error('Error creating default config:', configError);
    } else {
      console.log('Default homepage config created successfully');
    }

    console.log('Database setup completed!');

  } catch (error) {
    console.error('Setup failed:', error);
  }
}

setupDatabase();