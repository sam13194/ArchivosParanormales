import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession, createSubscriptionSession } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      producto_id,
      customer_email,
      customer_uid,
      quantity = 1,
      success_url,
      cancel_url
    } = body;

    // Validaciones
    if (!producto_id || !customer_email || !customer_uid) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Obtener información del producto de la base de datos
    const { data: producto, error: productoError } = await supabase
      .from('productos')
      .select('*')
      .eq('id', producto_id)
      .single();

    if (productoError || !producto) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Verificar que el producto esté activo
    if (producto.estado !== 'activo') {
      return NextResponse.json(
        { error: 'Product not available' },
        { status: 400 }
      );
    }

    // URLs de redirección por defecto
    const defaultSuccessUrl = `${request.nextUrl.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
    const defaultCancelUrl = `${request.nextUrl.origin}/store`;

    const successUrlFinal = success_url || defaultSuccessUrl;
    const cancelUrlFinal = cancel_url || defaultCancelUrl;

    // Metadatos para el checkout
    const metadata = {
      producto_id: producto_id.toString(),
      customer_uid: customer_uid,
      tipo_producto: producto.tipo_producto,
    };

    let session;

    // Crear sesión según el tipo de producto
    if (producto.es_suscripcion) {
      // Para suscripciones
      session = await createSubscriptionSession(
        `price_${producto.id}`, // Esto debería ser el ID real de Stripe Price
        customer_email,
        successUrlFinal,
        cancelUrlFinal,
        producto.dias_trial || 0,
        metadata
      );
    } else {
      // Para productos únicos
      session = await createCheckoutSession(
        `price_${producto.id}`, // Esto debería ser el ID real de Stripe Price
        quantity,
        customer_email,
        successUrlFinal,
        cancelUrlFinal,
        metadata
      );
    }

    // Crear orden pendiente en la base de datos
    const numeroOrden = `ORD-${Date.now()}`;
    const { error: ordenError } = await supabase
      .from('ordenes')
      .insert([{
        numero_orden: numeroOrden,
        cliente_firebase_uid: customer_uid,
        cliente_email: customer_email,
        subtotal: producto.precio_base * quantity,
        total: producto.precio_base * quantity,
        estado: 'pendiente',
        metodo_pago: 'stripe',
        id_transaccion_pago: session.id
      }]);

    if (ordenError) {
      console.error('Error creating order:', ordenError);
      // No fallar el checkout por esto, solo log
    }

    return NextResponse.json({
      success: true,
      checkout_url: session.url,
      session_id: session.id
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}