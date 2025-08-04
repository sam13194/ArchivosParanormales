import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// POST /api/orders - Crear nueva orden
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      cliente_firebase_uid,
      cliente_email,
      cliente_nombre,
      items, // Array de { producto_id, cantidad, precio_unitario }
      metodo_pago = 'pendiente'
    } = body;
    
    // Validaciones básicas
    if (!cliente_firebase_uid || !cliente_email || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Calcular totales
    const subtotal = items.reduce((total: number, item: any) => 
      total + (item.precio_unitario * item.cantidad), 0
    );
    
    // Generar número de orden único
    const timestamp = Date.now();
    const numero_orden = `ORD-${timestamp}`;
    
    // Crear la orden
    const { data: orden, error: ordenError } = await supabase
      .from('ordenes')
      .insert([{
        numero_orden,
        cliente_firebase_uid,
        cliente_email,
        cliente_nombre,
        subtotal,
        total: subtotal, // Por ahora sin impuestos ni descuentos
        estado: 'pendiente',
        metodo_pago
      }])
      .select()
      .single();
    
    if (ordenError) {
      console.error('Error creating order:', ordenError);
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }
    
    // Crear los items de la orden
    const ordenItems = items.map((item: any) => ({
      orden_id: orden.id,
      producto_id: item.producto_id,
      nombre_producto: item.nombre_producto,
      precio_unitario: item.precio_unitario,
      cantidad: item.cantidad,
      subtotal: item.precio_unitario * item.cantidad
    }));
    
    const { error: itemsError } = await supabase
      .from('orden_items')
      .insert(ordenItems);
    
    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      // Rollback: eliminar la orden creada
      await supabase.from('ordenes').delete().eq('id', orden.id);
      return NextResponse.json(
        { error: 'Failed to create order items' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      order: {
        ...orden,
        items: ordenItems
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/orders - Obtener órdenes del usuario
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');
    
    if (!uid) {
      return NextResponse.json(
        { error: 'Missing user ID' },
        { status: 400 }
      );
    }
    
    const { data, error } = await supabase
      .from('ordenes')
      .select(`
        *,
        orden_items(
          *,
          productos(nombre, imagen_principal)
        )
      `)
      .eq('cliente_firebase_uid', uid)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching orders:', error);
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ orders: data });
    
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}