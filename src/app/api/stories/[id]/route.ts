import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

// GET /api/stories/[id] - Obtener historia específica
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const storyId = parseInt(resolvedParams.id);
    
    if (isNaN(storyId)) {
      return NextResponse.json(
        { error: 'Invalid story ID' },
        { status: 400 }
      );
    }
    
    const { data, error } = await supabaseAdmin
      .from('historias')
      .select(`
        *,
        ubicaciones(*),
        archivos_multimedia(*),
        testigos(*),
        contexto_ambiental(*),
        factores_credibilidad(*),
        metricas_iniciales(*),
        performance_esperado(*),
        derechos(*),
        historia_subgeneros(
          *,
          subgeneros(*)
        ),
        historia_elementos(
          *,
          elementos_clave(*)
        ),
        colaboradores(*)
      `)
      .eq('id', storyId)
      .single();
    
    if (error) {
      console.error('Error fetching story:', error);
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Story not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: 'Failed to fetch story' },
        { status: 500 }
      );
    }
    
    // Solo permitir historias publicadas para acceso público
    if (data.estado_procesamiento !== 'publicada') {
      return NextResponse.json(
        { error: 'Story not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ story: data });
    
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/stories/[id] - Actualizar historia
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const body = await request.json();
    const { created_by_uid, ...updateData } = body;
    
    // Verificar que el usuario puede editar esta historia
    const { data: existingStory, error: checkError } = await supabase
      .from('historias')
      .select('created_by_uid')
      .eq('id', resolvedParams.id)
      .single();
    
    if (checkError || !existingStory) {
      return NextResponse.json(
        { error: 'Story not found' },
        { status: 404 }
      );
    }
    
    if (existingStory.created_by_uid !== created_by_uid) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    const { data, error } = await supabase
      .from('historias')
      .update(updateData)
      .eq('id', resolvedParams.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating story:', error);
      return NextResponse.json(
        { error: 'Failed to update story' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      story: data
    });
    
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/stories/[id] - Eliminar historia
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const { searchParams } = new URL(request.url);
    const created_by_uid = searchParams.get('uid');
    
    if (!created_by_uid) {
      return NextResponse.json(
        { error: 'Missing user ID' },
        { status: 400 }
      );
    }
    
    // Verificar que el usuario puede eliminar esta historia
    const { data: existingStory, error: checkError } = await supabase
      .from('historias')
      .select('created_by_uid')
      .eq('id', resolvedParams.id)
      .single();
    
    if (checkError || !existingStory) {
      return NextResponse.json(
        { error: 'Story not found' },
        { status: 404 }
      );
    }
    
    if (existingStory.created_by_uid !== created_by_uid) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    const { error } = await supabase
      .from('historias')
      .delete()
      .eq('id', resolvedParams.id);
    
    if (error) {
      console.error('Error deleting story:', error);
      return NextResponse.json(
        { error: 'Failed to delete story' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Story deleted successfully'
    });
    
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}