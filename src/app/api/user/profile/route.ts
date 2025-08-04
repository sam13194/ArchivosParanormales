import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET - Obtener perfil de usuario por firebase_uid o email
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const firebase_uid = searchParams.get('firebase_uid');
    const email = searchParams.get('email');

    if (!firebase_uid && !email) {
      return NextResponse.json(
        { error: 'firebase_uid o email es requerido' },
        { status: 400 }
      );
    }

    let query = supabaseAdmin.from('usuarios').select('*');
    
    if (firebase_uid) {
      query = query.eq('firebase_uid', firebase_uid);
    } else if (email) {
      query = query.eq('email', email);
    }

    const { data, error } = await query.single();

    if (error) {
      console.error('Error fetching user profile:', error);
      
      // Si el usuario no existe, devolver null en lugar de error
      if (error.code === 'PGRST116') {
        return NextResponse.json({
          success: true,
          profile: null,
          message: 'Usuario no encontrado en la base de datos'
        });
      }
      
      return NextResponse.json(
        { error: 'Error al obtener perfil de usuario' },
        { status: 500 }
      );
    }

    if (data) {
      const profile = {
        id: data.id,
        email: data.email,
        displayName: data.display_name || data.email.split('@')[0],
        role: data.rol || 'user',
        status: data.estado || 'active',
        joinDate: data.fecha_registro?.split('T')[0] || 'N/A',
        lastLogin: data.ultimo_login || 'Nunca',
        storiesSubmitted: data.historias_enviadas || 0,
        avatar: data.avatar_url,
        firebase_uid: data.firebase_uid
      };

      return NextResponse.json({
        success: true,
        profile
      });
    }

    return NextResponse.json({
      success: true,
      profile: null
    });

  } catch (error) {
    console.error('User profile API error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}