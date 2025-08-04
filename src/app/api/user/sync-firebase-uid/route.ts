import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// POST - Sincronizar firebase_uid con email
export async function POST(request: NextRequest) {
  try {
    const { email, firebase_uid } = await request.json();

    if (!email || !firebase_uid) {
      return NextResponse.json(
        { error: 'Email y firebase_uid son requeridos' },
        { status: 400 }
      );
    }

    // Actualizar el usuario con el firebase_uid
    const { data, error } = await supabaseAdmin
      .from('usuarios')
      .update({ firebase_uid })
      .eq('email', email)
      .select()
      .single();

    if (error) {
      console.error('Error syncing firebase_uid:', error);
      return NextResponse.json(
        { error: 'Error al sincronizar firebase_uid' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      profile: data,
      message: 'Firebase UID sincronizado correctamente'
    });

  } catch (error) {
    console.error('Sync firebase_uid API error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}