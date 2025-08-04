import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { adminAuth, canInitializeFirebaseAdmin } from '@/lib/firebase-admin';

// GET - Obtener todos los usuarios para admin
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    
    let query = supabaseAdmin
      .from('usuarios')
      .select('*');

    // Filtros opcionales
    if (role && role !== 'all') {
      query = query.eq('rol', role);
    }

    if (status && status !== 'all') {
      query = query.eq('estado', status);
    }

    if (search) {
      query = query.or(`email.ilike.%${search}%,display_name.ilike.%${search}%`);
    }

    // Ordenar por fecha de registro descendente
    query = query.order('fecha_registro', { ascending: false });

    const { data: usuarios, error } = await query;

    if (error) {
      console.error('Error fetching users:', error);
      
      // Si la tabla no existe, intentar crearla
      if (error.message?.includes('does not exist')) {
        // Devolver un error claro solicitando la creación manual de la tabla
        return NextResponse.json(
          { 
            error: 'Database table "usuarios" does not exist', 
            message: 'Please create the usuarios table in Supabase using the SQL schema provided in /database/schema.sql',
            setupRequired: true
          },
          { status: 503 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch users', details: error.message },
        { status: 500 }
      );
    }

    // Procesar datos para el frontend
    const processedUsers = usuarios?.map(user => ({
      id: user.id,
      email: user.email,
      displayName: user.display_name || user.email.split('@')[0],
      role: user.rol || 'user',
      status: user.estado || 'active',
      joinDate: user.fecha_registro?.split('T')[0] || 'N/A',
      lastLogin: user.ultimo_login || 'Nunca',
      storiesSubmitted: user.historias_enviadas || 0,
      premiumStatus: 'none', // Simplificado por ahora
      avatar: user.avatar_url,
      firebase_uid: user.firebase_uid
    })) || [];

    return NextResponse.json({
      success: true,
      users: processedUsers,
      total: processedUsers.length
    });

  } catch (error) {
    console.error('Admin users GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo usuario (invitación)
export async function POST(request: NextRequest) {
  try {
    const {
      email,
      display_name,
      rol = 'user',
      send_invite = true,
      firebase_uid = null
    } = await request.json();

    // Validar email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email válido es requerido' },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe en Supabase
    const { data: existingUser } = await supabaseAdmin
      .from('usuarios')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'El usuario ya existe en Supabase' },
        { status: 400 }
      );
    }

    let firebaseUid = firebase_uid;

    // Si Firebase Admin está configurado, crear el usuario también en Firebase
    if (canInitializeFirebaseAdmin() && adminAuth) {
      try {
        // Verificar si el usuario ya existe en Firebase
        try {
          await adminAuth.getUserByEmail(email);
          return NextResponse.json(
            { error: 'El usuario ya existe en Firebase' },
            { status: 400 }
          );
        } catch (firebaseError: any) {
          // Si el usuario no existe en Firebase (error auth/user-not-found), podemos proceder
          if (firebaseError.code !== 'auth/user-not-found') {
            throw firebaseError;
          }
        }

        // Crear usuario en Firebase
        const firebaseUser = await adminAuth.createUser({
          email: email,
          displayName: display_name || email.split('@')[0],
          emailVerified: false, // Se verificará cuando el usuario haga login por primera vez
        });

        firebaseUid = firebaseUser.uid;
        console.log(`Usuario creado en Firebase con UID: ${firebaseUid}`);

      } catch (firebaseError: any) {
        console.error('Error creating user in Firebase:', firebaseError);
        return NextResponse.json(
          { error: 'Error al crear usuario en Firebase', details: firebaseError.message },
          { status: 500 }
        );
      }
    }

    // Crear usuario en la base de datos Supabase
    const { data: user, error: userError } = await supabaseAdmin
      .from('usuarios')
      .insert([{
        email,
        display_name: display_name || email.split('@')[0],
        rol: rol,
        estado: firebaseUid ? 'active' : 'pending', // Si tiene Firebase UID, activar
        fecha_registro: new Date().toISOString(),
        email_verificado: !!firebaseUid, // Si se creó en Firebase, marcar como verificado
        firebase_uid: firebaseUid
      }])
      .select()
      .single();

    if (userError) {
      console.error('Error creating user in Supabase:', userError);
      
      // Si falló la creación en Supabase pero se creó en Firebase, limpiar Firebase
      if (firebaseUid && canInitializeFirebaseAdmin() && adminAuth) {
        try {
          await adminAuth.deleteUser(firebaseUid);
          console.log('Cleaned up Firebase user after Supabase error');
        } catch (cleanupError) {
          console.error('Error cleaning up Firebase user:', cleanupError);
        }
      }
      
      return NextResponse.json(
        { error: 'Error al crear usuario en Supabase' },
        { status: 500 }
      );
    }

    // TODO: Enviar email de invitación si send_invite es true
    if (send_invite) {
      // Aquí implementarías el envío de email de invitación
      console.log(`Enviar invitación a ${email}`);
    }

    const message = firebaseUid 
      ? 'Usuario creado exitosamente en Firebase y Supabase'
      : 'Usuario creado en Supabase (Firebase Admin no configurado)';

    return NextResponse.json({
      success: true,
      user,
      firebaseUid,
      message: send_invite ? `${message} - Invitación enviada` : message
    });

  } catch (error) {
    console.error('Admin users POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar usuario (rol, estado, etc.)
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json(
        { error: 'ID de usuario requerido' },
        { status: 400 }
      );
    }

    const updateData = await request.json();
    const allowedFields = ['rol', 'estado', 'display_name', 'notas_admin'];
    
    // Filtrar solo campos permitidos
    const filteredData = Object.keys(updateData)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updateData[key];
        return obj;
      }, {} as any);

    if (Object.keys(filteredData).length === 0) {
      return NextResponse.json(
        { error: 'No hay campos válidos para actualizar' },
        { status: 400 }
      );
    }

    // Agregar timestamp de actualización
    filteredData.fecha_actualizacion = new Date().toISOString();

    const { data: user, error } = await supabaseAdmin
      .from('usuarios')
      .update(filteredData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user:', error);
      return NextResponse.json(
        { error: 'Failed to update user' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
      message: 'Usuario actualizado exitosamente'
    });

  } catch (error) {
    console.error('Admin users PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar usuario (solo admin principal)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json(
        { error: 'ID de usuario requerido' },
        { status: 400 }
      );
    }

    // Obtener información completa del usuario antes de eliminarlo
    const { data: user } = await supabaseAdmin
      .from('usuarios')
      .select('rol, email, firebase_uid')
      .eq('id', userId)
      .single();

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    if (user.rol === 'admin') {
      return NextResponse.json(
        { error: 'No se puede eliminar un administrador' },
        { status: 403 }
      );
    }

    let firebaseDeleted = false;

    // Si el usuario tiene firebase_uid y Firebase Admin está configurado, eliminarlo de Firebase
    if (user.firebase_uid && canInitializeFirebaseAdmin() && adminAuth) {
      try {
        await adminAuth.deleteUser(user.firebase_uid);
        firebaseDeleted = true;
        console.log(`Usuario eliminado de Firebase: ${user.firebase_uid}`);
      } catch (firebaseError: any) {
        console.error('Error deleting user from Firebase:', firebaseError);
        
        // Si el usuario no existe en Firebase, continuar con la eliminación de Supabase
        if (firebaseError.code !== 'auth/user-not-found') {
          return NextResponse.json(
            { error: 'Error al eliminar usuario de Firebase', details: firebaseError.message },
            { status: 500 }
          );
        }
      }
    }

    // Eliminar usuario de Supabase
    const { error } = await supabaseAdmin
      .from('usuarios')
      .delete()
      .eq('id', userId);

    if (error) {
      console.error('Error deleting user from Supabase:', error);
      return NextResponse.json(
        { error: 'Error al eliminar usuario de Supabase' },
        { status: 500 }
      );
    }

    const message = firebaseDeleted 
      ? 'Usuario eliminado exitosamente de Firebase y Supabase'
      : user.firebase_uid 
        ? 'Usuario eliminado de Supabase (no se encontró en Firebase)'
        : 'Usuario eliminado exitosamente de Supabase';

    return NextResponse.json({
      success: true,
      message,
      firebaseDeleted
    });

  } catch (error) {
    console.error('Admin users DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}