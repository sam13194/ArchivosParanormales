import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      items,
      customer_info,
      payment_method,
      customer_uid,
      customer_email,
      total
    } = body;

    // Validaciones
    if (!items || items.length === 0 || !customer_uid || !customer_email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Crear orden en la base de datos
    const numeroOrden = `ORD-${Date.now()}`;
    const { data: orden, error: ordenError } = await supabase
      .from('ordenes')
      .insert([{
        numero_orden: numeroOrden,
        cliente_firebase_uid: customer_uid,
        cliente_email: customer_email,
        cliente_nombre: customer_info.nombre,
        cliente_telefono: customer_info.telefono,
        subtotal: total,
        total: total,
        estado: 'pendiente',
        metodo_pago: `stripe_${payment_method}`,
        // Guardar información adicional en notas_admin para referencia
        notas_admin: JSON.stringify({
          documento: customer_info.documento,
          direccion: customer_info.direccion,
          ciudad: customer_info.ciudad,
          departamento: customer_info.departamento
        })
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

    // Crear items de la orden
    const ordenItems = items.map((item: any) => ({
      orden_id: orden.id,
      producto_id: item.producto_id,
      nombre_producto: item.nombre_producto,
      precio_unitario: item.precio_unitario,
      cantidad: item.cantidad,
      subtotal: item.precio_unitario * item.cantidad
    }));

    await supabase.from('orden_items').insert(ordenItems);

    // Configurar parámetros para Stripe Checkout según el método de pago
    const successUrl = `${request.nextUrl.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orden.id}`;
    const cancelUrl = `${request.nextUrl.origin}/store?canceled=true`;

    // Configuración específica para Colombia
    const sessionParams: any = {
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customer_email,
      line_items: items.map((item: any) => ({
        price_data: {
          currency: 'cop',
          unit_amount: Math.round(item.precio_unitario * 100), // Stripe usa centavos
          product_data: {
            name: item.nombre_producto,
            description: `Producto digital de Archivos Paranormales`,
          },
        },
        quantity: item.cantidad,
      })),
      metadata: {
        order_id: orden.id.toString(),
        customer_uid: customer_uid,
        numero_orden: numeroOrden,
      },
      // Configuración específica para Colombia
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['CO'],
      },
      phone_number_collection: {
        enabled: true,
      },
      custom_fields: [
        {
          key: 'documento',
          label: {
            type: 'text',
            text: 'Número de Documento',
          },
          type: 'text',
          optional: false,
        },
      ],
    };

    // Configurar métodos de pago según la selección
    switch (payment_method) {
      case 'pse':
        sessionParams.payment_method_types = ['customer_balance'];
        sessionParams.payment_method_options = {
          customer_balance: {
            funding_type: 'bank_transfer',
            bank_transfer: {
              type: 'co_bank_transfer', // PSE para Colombia
            },
          },
        };
        break;

      case 'nequi':
        // Nequi se maneja a través de wallets en Colombia
        sessionParams.payment_method_types = ['customer_balance'];
        sessionParams.payment_method_options = {
          customer_balance: {
            funding_type: 'bank_transfer',
            bank_transfer: {
              type: 'co_bank_transfer',
            },
          },
        };
        break;

      case 'card':
        sessionParams.payment_method_types = ['card'];
        sessionParams.payment_method_options = {
          card: {
            request_three_d_secure: 'automatic',
          },
        };
        break;

      default:
        sessionParams.payment_method_types = ['card', 'customer_balance'];
    }

    // Crear sesión de Stripe
    const session = await stripe.checkout.sessions.create(sessionParams);

    // Actualizar orden con el ID de sesión de Stripe
    await supabase
      .from('ordenes')
      .update({ id_transaccion_pago: session.id })
      .eq('id', orden.id);

    return NextResponse.json({
      success: true,
      checkout_url: session.url,
      session_id: session.id,
      order_id: orden.id
    });

  } catch (error) {
    console.error('Checkout Colombia error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

// GET para verificar estado del pago
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');
    const orderId = searchParams.get('order_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing session_id' },
        { status: 400 }
      );
    }

    // Obtener información de la sesión de Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Actualizar estado de la orden si el pago fue exitoso
    if (session.payment_status === 'paid' && orderId) {
      await supabase
        .from('ordenes')
        .update({ 
          estado: 'pagada',
          fecha_pago: new Date().toISOString()
        })
        .eq('id', orderId);
    }

    return NextResponse.json({
      session_status: session.status,
      payment_status: session.payment_status,
      customer_email: session.customer_email,
      amount_total: session.amount_total,
    });

  } catch (error) {
    console.error('Session verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify session' },
      { status: 500 }
    );
  }
}