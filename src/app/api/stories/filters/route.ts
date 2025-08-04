import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET /api/stories/filters - Obtener opciones para filtros
export async function GET(request: NextRequest) {
  try {
    // Obtener géneros únicos
    const { data: generos, error: generosError } = await supabaseAdmin
      .from('historias')
      .select('genero_principal')
      .eq('estado_procesamiento', 'publicada')
      .not('genero_principal', 'is', null);

    // Obtener niveles de verificación únicos
    const { data: verificaciones, error: verificacionesError } = await supabaseAdmin
      .from('historias')
      .select('nivel_verificacion')
      .eq('estado_procesamiento', 'publicada')
      .not('nivel_verificacion', 'is', null);

    // Obtener ubicaciones únicas (departamentos y ciudades)
    const { data: ubicaciones, error: ubicacionesError } = await supabaseAdmin
      .from('ubicaciones')
      .select('nivel1_nombre, nivel2_nombre')
      .not('nivel1_nombre', 'is', null);

    // Obtener rangos de valores numéricos
    const { data: ranges, error: rangesError } = await supabaseAdmin
      .from('historias')
      .select('ponderacion_impacto, credibilidad_score')
      .eq('estado_procesamiento', 'publicada');

    if (generosError || verificacionesError || ubicacionesError || rangesError) {
      console.error('Error fetching filter options:', { generosError, verificacionesError, ubicacionesError, rangesError });
      return NextResponse.json(
        { error: 'Failed to fetch filter options' },
        { status: 500 }
      );
    }

    // Procesar datos para opciones únicas
    const generosUnicos = [...new Set(generos?.map(g => g.genero_principal).filter(Boolean))];
    const verificacionesUnicas = [...new Set(verificaciones?.map(v => v.nivel_verificacion).filter(Boolean))];
    
    const departamentosUnicos = [...new Set(ubicaciones?.map(u => u.nivel1_nombre).filter(Boolean))];
    const ciudadesUnicas = [...new Set(ubicaciones?.map(u => u.nivel2_nombre).filter(Boolean))];

    // Calcular rangos para campos numéricos
    const impactos = ranges?.map(r => r.ponderacion_impacto).filter(i => i !== null && i !== undefined) || [];
    const credibilidades = ranges?.map(r => r.credibilidad_score).filter(c => c !== null && c !== undefined) || [];

    const impactoRange = impactos.length > 0 ? {
      min: Math.min(...impactos),
      max: Math.max(...impactos)
    } : { min: 1, max: 5 };

    const credibilidadRange = credibilidades.length > 0 ? {
      min: Math.min(...credibilidades),
      max: Math.max(...credibilidades)
    } : { min: 0, max: 5 };

    return NextResponse.json({
      generos: generosUnicos.sort(),
      verificaciones: verificacionesUnicas.sort(),
      departamentos: departamentosUnicos.sort(),
      ciudades: ciudadesUnicas.sort(),
      ranges: {
        impacto: impactoRange,
        credibilidad: credibilidadRange
      },
      ordenamiento: [
        { value: 'fecha_desc', label: 'Más Recientes' },
        { value: 'fecha_asc', label: 'Más Antiguos' },
        { value: 'impacto_desc', label: 'Mayor Impacto' },
        { value: 'credibilidad_desc', label: 'Mayor Credibilidad' }
      ]
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}