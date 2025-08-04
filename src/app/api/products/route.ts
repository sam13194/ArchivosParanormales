import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/products - Obtener todos los productos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get('categoria');
    const tipo = searchParams.get('tipo');
    const activos_solo = searchParams.get('activos') !== 'false';
    
    let query = supabase
      .from('productos')
      .select(`
        *,
        categorias_productos(*)
      `)
      .order('created_at', { ascending: false });
    
    // Filtros
    if (activos_solo) {
      query = query.eq('estado', 'activo').eq('visible_tienda', true);
    }
    
    if (categoria) {
      query = query.eq('categoria_id', categoria);
    }
    
    if (tipo) {
      query = query.eq('tipo_producto', tipo);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ products: data });
    
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/products - Crear nuevo producto (solo admin)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      nombre,
      descripcion,
      slug,
      categoria_id,
      tipo_producto,
      precio_base,
      precio_usd,
      es_suscripcion = false,
      estado = 'borrador'
    } = body;
    
    // Validaciones básicas
    if (!nombre || !precio_base || !tipo_producto) {
      return NextResponse.json(
        { error: 'Missing required fields: nombre, precio_base, tipo_producto' },
        { status: 400 }
      );
    }
    
    const { data, error } = await supabase
      .from('productos')
      .insert([{
        nombre,
        descripcion,
        slug: slug || nombre.toLowerCase().replace(/\s+/g, '-'),
        categoria_id,
        tipo_producto,
        precio_base,
        precio_usd,
        es_suscripcion,
        estado
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating product:', error);
      return NextResponse.json(
        { error: 'Failed to create product' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      product: data
    }, { status: 201 });
    
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}