import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // Crear tabla usuarios
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
          creado_por_admin VARCHAR(255) NULL
      );
    `;

    // Ejecutar SQL usando supabaseAdmin
    const { error: usersError } = await supabaseAdmin.sql`${createUsersSQL}`;
    
    if (usersError) {
      console.error('Error creating users table:', usersError);
    }

    // Insertar usuario admin
    const { data: adminUser, error: adminError } = await supabaseAdmin
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

    // Crear tabla configuracion_homepage
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

    const { error: homepageError } = await supabaseAdmin.sql`${createHomepageSQL}`;
    
    if (homepageError) {
      console.error('Error creating homepage config table:', homepageError);
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

    const { data: config, error: configError } = await supabaseAdmin
      .from('configuracion_homepage')
      .upsert({
        configuracion: defaultConfig,
        activa: true,
        creado_por: 'system'
      }, { 
        onConflict: 'activa',
        ignoreDuplicates: true 
      });

    return NextResponse.json({
      success: true,
      message: 'Tables created successfully',
      errors: {
        users: usersError?.message || null,
        homepage: homepageError?.message || null,
        admin: adminError?.message || null,
        config: configError?.message || null
      }
    });

  } catch (error) {
    console.error('Create tables error:', error);
    return NextResponse.json(
      { error: 'Failed to create tables', details: error },
      { status: 500 }
    );
  }
}