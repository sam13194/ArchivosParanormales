import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// PUT - Actualizar usuario específico
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    if (!userId) {
      return NextResponse.json(
        { error: 'ID de usuario requerido' },
        { status: 400 }
      );
    }

    const updateData = await request.json();
    const allowedFields = ['rol', 'estado', 'display_name', 'notas_admin', 'email'];
    
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

// DELETE - Eliminar usuario específico
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    if (!userId) {
      return NextResponse.json(
        { error: 'ID de usuario requerido' },
        { status: 400 }
      );
    }

    // Verificar que no es un admin
    const { data: user } = await supabaseAdmin
      .from('usuarios')
      .select('rol, email, firebase_uid')
      .eq('id', userId)
      .single();

    if (user?.rol === 'admin') {
      return NextResponse.json(
        { error: 'No se puede eliminar un administrador' },
        { status: 403 }
      );
    }

    // Eliminar usuario (relaciones se limpiarán después si es necesario)
    const { error } = await supabaseAdmin
      .from('usuarios')
      .delete()
      .eq('id', userId);

    if (error) {
      console.error('Error deleting user:', error);
      return NextResponse.json(
        { error: 'Failed to delete user' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });

  } catch (error) {
    console.error('Admin users DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}