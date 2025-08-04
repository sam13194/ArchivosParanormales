import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe, verifyStripeWebhook } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe signature' },
        { status: 400 }
      );
    }

    // Verificar el webhook
    const event = verifyStripeWebhook(body, signature);

    console.log('Stripe webhook received:', event.type);

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;
      
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
      
      case 'invoice.payment_succeeded':
        await handleSubscriptionPayment(event.data.object);
        break;
      
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionCanceled(event.data.object);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
}

async function handleCheckoutCompleted(session: any) {
  try {
    const orderId = session.metadata?.order_id;
    const customerUid = session.metadata?.customer_uid;

    if (!orderId) {
      console.log('No order_id in session metadata');
      return;
    }

    // Actualizar estado de la orden
    const { error: updateError } = await supabase
      .from('ordenes')
      .update({
        estado: 'completada',
        fecha_pago: new Date().toISOString(),
        comprobante_pago: session.id
      })
      .eq('id', orderId);

    if (updateError) {
      console.error('Error updating order:', updateError);
      return;
    }

    // Obtener detalles de la orden para procesar beneficios
    const { data: orden, error: ordenError } = await supabase
      .from('ordenes')
      .select(`
        *,
        orden_items(
          *,
          productos(tipo_producto, es_suscripcion)
        )
      `)
      .eq('id', orderId)
      .single();

    if (ordenError) {
      console.error('Error fetching order:', ordenError);
      return;
    }

    // Procesar cada item de la orden
    for (const item of orden.orden_items) {
      const producto = item.productos;
      
      if (producto.es_suscripcion) {
        // Crear o actualizar suscripción
        await createOrUpdateSubscription(
          customerUid,
          item.producto_id,
          orderId,
          session.subscription
        );
      } else {
        // Otorgar acceso a contenido digital
        await grantDigitalAccess(
          customerUid,
          item.producto_id,
          orderId
        );
      }
    }

    console.log(`Order ${orderId} completed successfully`);

  } catch (error) {
    console.error('Error handling checkout completed:', error);
  }
}

async function handlePaymentSucceeded(paymentIntent: any) {
  console.log('Payment succeeded:', paymentIntent.id);
  // Aquí puedes agregar lógica adicional para pagos exitosos
}

async function handleSubscriptionPayment(invoice: any) {
  try {
    // Manejar pagos recurrentes de suscripciones
    const subscriptionId = invoice.subscription;
    const customerId = invoice.customer;

    // Actualizar métricas de ingresos recurrentes
    const amount = invoice.amount_paid / 100; // Convertir de centavos

    await supabase
      .from('metricas_ventas')
      .upsert({
        fecha: new Date().toISOString().split('T')[0],
        ingresos_suscripciones: amount
      }, {
        onConflict: 'fecha'
      });

    console.log(`Subscription payment processed: ${subscriptionId}`);

  } catch (error) {
    console.error('Error handling subscription payment:', error);
  }
}

async function createOrUpdateSubscription(
  customerUid: string,
  productoId: number,
  ordenId: number,
  stripeSubscriptionId: string
) {
  try {
    // Obtener información del producto
    const { data: producto } = await supabase
      .from('productos')
      .select('*')
      .eq('id', productoId)
      .single();

    if (!producto) return;

    // Calcular fechas de suscripción
    const fechaInicio = new Date();
    const fechaFin = new Date();
    
    if (producto.periodo_suscripcion === 'monthly') {
      fechaFin.setMonth(fechaFin.getMonth() + 1);
    } else if (producto.periodo_suscripcion === 'yearly') {
      fechaFin.setFullYear(fechaFin.getFullYear() + 1);
    }

    // Crear suscripción
    await supabase
      .from('suscripciones')
      .insert({
        cliente_firebase_uid: customerUid,
        producto_id: productoId,
        orden_origen_id: ordenId,
        estado: 'activa',
        fecha_inicio: fechaInicio.toISOString(),
        fecha_fin: fechaFin.toISOString(),
        fecha_siguiente_pago: fechaFin.toISOString(),
        periodo: producto.periodo_suscripcion,
        precio_periodo: producto.precio_base,
        acceso_historias_premium: true,
        descarga_sin_limite: true,
        acceso_contenido_exclusivo: true,
        sin_publicidad: true
      });

    console.log(`Subscription created for user ${customerUid}`);

  } catch (error) {
    console.error('Error creating subscription:', error);
  }
}

async function grantDigitalAccess(
  customerUid: string,
  productoId: number,
  ordenId: number
) {
  try {
    // Obtener información del producto
    const { data: producto } = await supabase
      .from('productos')
      .select('*')
      .eq('id', productoId)
      .single();

    if (!producto) return;

    // Calcular fecha de acceso (permanente para productos digitales)
    const fechaAcceso = producto.duracion_acceso_dias 
      ? new Date(Date.now() + producto.duracion_acceso_dias * 24 * 60 * 60 * 1000)
      : null; // null = acceso permanente

    // Actualizar item de orden con acceso otorgado
    await supabase
      .from('orden_items')
      .update({
        contenido_otorgado: producto.acceso_historias_ids || [],
        fecha_acceso_hasta: fechaAcceso?.toISOString()
      })
      .eq('orden_id', ordenId)
      .eq('producto_id', productoId);

    console.log(`Digital access granted for product ${productoId}`);

  } catch (error) {
    console.error('Error granting digital access:', error);
  }
}

async function handleSubscriptionCreated(subscription: any) {
  console.log('Subscription created:', subscription.id);
  // Lógica adicional para nuevas suscripciones
}

async function handleSubscriptionCanceled(subscription: any) {
  try {
    // Buscar suscripción por ID de Stripe y marcarla como cancelada
    await supabase
      .from('suscripciones')
      .update({
        estado: 'cancelada',
        fecha_cancelacion: new Date().toISOString(),
        auto_renovar: false
      })
      .eq('orden_origen_id', subscription.metadata?.order_id);

    console.log('Subscription canceled:', subscription.id);

  } catch (error) {
    console.error('Error handling subscription cancellation:', error);
  }
}