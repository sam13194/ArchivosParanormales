import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

// GET /api/stories - Obtener todas las historias
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const status = searchParams.get('status');
    
    // Parámetros de filtrado avanzado
    const genero = searchParams.get('genero');
    const nivel_impacto_min = searchParams.get('impacto_min');
    const nivel_impacto_max = searchParams.get('impacto_max');
    const nivel_verificacion = searchParams.get('verificacion');
    const departamento = searchParams.get('departamento');
    const ciudad = searchParams.get('ciudad');
    const credibilidad_min = searchParams.get('credibilidad_min');
    const fecha_desde = searchParams.get('fecha_desde');
    const fecha_hasta = searchParams.get('fecha_hasta');
    const orden = searchParams.get('orden') || 'fecha_desc'; // fecha_desc, fecha_asc, impacto_desc, credibilidad_desc
    
    let query = supabaseAdmin
      .from('historias')
      .select(`
        *,
        ubicaciones(*),
        archivos_multimedia(*),
        testigos(*),
        contexto_ambiental(*),
        factores_credibilidad(*),
        metricas_iniciales(*),
        historia_subgeneros(
          *,
          subgeneros(*)
        ),
        historia_elementos(
          *,
          elementos_clave(*)
        )
      `)
      .range(offset, offset + limit - 1);
    
    // Filtros de estado
    if (status) {
      query = query.eq('estado_procesamiento', status);
    } else {
      query = query.eq('estado_procesamiento', 'publicada');
    }
    
    // Filtros adicionales
    if (genero) {
      query = query.eq('genero_principal', genero);
    }
    
    if (nivel_impacto_min) {
      query = query.gte('ponderacion_impacto', parseInt(nivel_impacto_min));
    }
    
    if (nivel_impacto_max) {
      query = query.lte('ponderacion_impacto', parseInt(nivel_impacto_max));
    }
    
    if (nivel_verificacion) {
      query = query.eq('nivel_verificacion', nivel_verificacion);
    }
    
    if (credibilidad_min) {
      query = query.gte('credibilidad_score', parseFloat(credibilidad_min));
    }
    
    if (fecha_desde) {
      query = query.gte('fecha_evento_inicio', fecha_desde);
    }
    
    if (fecha_hasta) {
      query = query.lte('fecha_evento_inicio', fecha_hasta);
    }
    
    // Filtros de ubicación (requiere JOIN con ubicaciones)
    if (departamento || ciudad) {
      // Para filtrar por ubicación necesitamos hacer un join o usar una subconsulta
      if (departamento) {
        query = query.not('ubicaciones', 'is', null).eq('ubicaciones.nivel1_nombre', departamento);
      }
      if (ciudad) {
        query = query.not('ubicaciones', 'is', null).eq('ubicaciones.nivel2_nombre', ciudad);
      }
    }
    
    // Ordenamiento
    switch (orden) {
      case 'fecha_asc':
        query = query.order('created_at', { ascending: true });
        break;
      case 'impacto_desc':
        query = query.order('ponderacion_impacto', { ascending: false });
        break;
      case 'credibilidad_desc':
        query = query.order('credibilidad_score', { ascending: false });
        break;
      case 'fecha_desc':
      default:
        query = query.order('created_at', { ascending: false });
        break;
    }
    
    const { data, error, count } = await query;
    
    if (error) {
      console.error('Error fetching stories:', error);
      return NextResponse.json(
        { error: 'Failed to fetch stories' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      stories: data,
      total: count,
      limit,
      offset
    });
    
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/stories - Crear nueva historia
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      titulo_provisional,
      suceso_principal_resumen,
      extracto_verbatim,
      ubicacion_id,
      created_by_uid,
      fuente_relato = 'llamada_oyente',
      ponderacion_impacto = 3,
      potencial_adaptacion = 1
    } = body;
    
    // Validaciones básicas
    if (!titulo_provisional || !created_by_uid) {
      return NextResponse.json(
        { error: 'Missing required fields: titulo_provisional, created_by_uid' },
        { status: 400 }
      );
    }
    
    // Generar código único
    const timestamp = Date.now();
    const codigo_unico = `STORY_${timestamp}`;
    
    const { data, error } = await supabase
      .from('historias')
      .insert([{
        codigo_unico,
        titulo_provisional,
        suceso_principal_resumen,
        extracto_verbatim,
        ubicacion_id,
        created_by_uid,
        fuente_relato,
        ponderacion_impacto,
        potencial_adaptacion,
        fecha_transcripcion: new Date().toISOString().split('T')[0],
        estado_procesamiento: 'extraida'
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating story:', error);
      return NextResponse.json(
        { error: 'Failed to create story' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      story: data
    }, { status: 201 });
    
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}