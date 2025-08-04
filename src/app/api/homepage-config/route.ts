import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    // Obtener configuración actual de la vista principal
    const { data: config, error } = await supabaseAdmin
      .from('configuracion_homepage')
      .select('*')
      .eq('activa', true)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching homepage config:', error);
      
      // Si la tabla no existe
      if (error.message?.includes('does not exist')) {
        return NextResponse.json(
          { 
            error: 'Database table "configuracion_homepage" does not exist', 
            message: 'Please create the configuracion_homepage table in Supabase using the SQL schema provided',
            setupRequired: true
          },
          { status: 503 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch homepage configuration' },
        { status: 500 }
      );
    }

    // Si no hay configuración, devolver configuración por defecto
    if (!config) {
      const defaultConfig = {
        hero_story: 1,
        carousels: [
          { id: 'populares', titulo: '🔥 Más Populares', stories: [1, 3, 5, 2], orden: 1 },
          { id: 'fantasmas', titulo: '👻 Fantasmas y Apariciones', stories: [1, 5], orden: 2 },
          { id: 'posesiones', titulo: '😈 Posesiones y Demonios', stories: [6, 3], orden: 3 },
          { id: 'regional', titulo: '🗺️ Historias de tu Región', stories: [2, 1, 5], orden: 4 }
        ]
      };
      return NextResponse.json(defaultConfig);
    }

    return NextResponse.json(config.configuracion);

  } catch (error) {
    console.error('Homepage config GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const configuracion = await request.json();

    // Validar que la configuración tenga la estructura correcta
    if (!configuracion.hero_story || !configuracion.carousels || !Array.isArray(configuracion.carousels)) {
      return NextResponse.json(
        { error: 'Invalid configuration format' },
        { status: 400 }
      );
    }

    // Verificar que las historias existen en la base de datos
    const allStoryIds = [
      configuracion.hero_story,
      ...configuracion.carousels.flatMap(c => c.stories)
    ];

    const { data: existingStories } = await supabaseAdmin
      .from('historias')
      .select('id')
      .in('id', allStoryIds);

    const existingIds = existingStories?.map(s => s.id) || [];
    const invalidIds = allStoryIds.filter(id => !existingIds.includes(id));

    if (invalidIds.length > 0) {
      return NextResponse.json(
        { error: `Stories not found: ${invalidIds.join(', ')}` },
        { status: 400 }
      );
    }

    // Desactivar configuración actual
    await supabaseAdmin
      .from('configuracion_homepage')
      .update({ activa: false })
      .eq('activa', true);

    // Insertar nueva configuración
    const { data, error } = await supabaseAdmin
      .from('configuracion_homepage')
      .insert([{
        configuracion,
        activa: true,
        fecha_creacion: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error saving homepage config:', error);
      return NextResponse.json(
        { error: 'Failed to save homepage configuration' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data.configuracion
    });

  } catch (error) {
    console.error('Homepage config POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const configuracion = await request.json();

    // Actualizar configuración existente
    const { data, error } = await supabase
      .from('configuracion_homepage')
      .update({ 
        configuracion,
        fecha_actualizacion: new Date().toISOString()
      })
      .eq('activa', true)
      .select()
      .single();

    if (error) {
      console.error('Error updating homepage config:', error);
      return NextResponse.json(
        { error: 'Failed to update homepage configuration' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data.configuracion
    });

  } catch (error) {
    console.error('Homepage config PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}