import { loadStripe } from '@stripe/stripe-js';
import Stripe from 'stripe';

// Cliente Stripe para el frontend
export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

// Servidor Stripe para backend
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

// Tipos para productos y precios
export interface StripeProduct {
  id: string;
  name: string;
  description?: string;
  images: string[];
  metadata: {
    producto_id: string;
    tipo_producto: string;
  };
}

export interface StripePrice {
  id: string;
  unit_amount: number;
  currency: string;
  recurring?: {
    interval: 'month' | 'year';
    interval_count: number;
  };
  product: string;
  metadata: {
    producto_id: string;
  };
}

// Función para crear un producto en Stripe
export async function createStripeProduct(
  nombre: string,
  descripcion: string,
  precio: number,
  moneda: string = 'cop',
  productoId: string,
  tipoProducto: string,
  isRecurring: boolean = false,
  interval: 'month' | 'year' = 'month'
): Promise<{ product: StripeProduct; price: StripePrice }> {
  
  // Crear producto
  const product = await stripe.products.create({
    name: nombre,
    description: descripcion,
    metadata: {
      producto_id: productoId,
      tipo_producto: tipoProducto,
    },
  });

  // Configurar precio
  const priceData: Stripe.PriceCreateParams = {
    unit_amount: precio,
    currency: moneda,
    product: product.id,
    metadata: {
      producto_id: productoId,
    },
  };

  // Si es suscripción, agregar configuración recurrente
  if (isRecurring) {
    priceData.recurring = {
      interval: interval,
      interval_count: 1,
    };
  }

  const price = await stripe.prices.create(priceData);

  return {
    product: product as unknown as StripeProduct,
    price: price as unknown as StripePrice,
  };
}

// Función para crear una sesión de checkout
export async function createCheckoutSession(
  priceId: string,
  quantity: number = 1,
  customerEmail: string,
  successUrl: string,
  cancelUrl: string,
  metadata: Record<string, string> = {}
): Promise<Stripe.Checkout.Session> {
  
  const session = await stripe.checkout.sessions.create({
    mode: 'payment', // o 'subscription' para suscripciones
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: quantity,
      },
    ],
    customer_email: customerEmail,
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: metadata,
    // Configuraciones adicionales para Colombia
    billing_address_collection: 'auto',
    shipping_address_collection: {
      allowed_countries: ['CO', 'US', 'MX'],
    },
  });

  return session;
}

// Función para crear una sesión de suscripción
export async function createSubscriptionSession(
  priceId: string,
  customerEmail: string,
  successUrl: string,
  cancelUrl: string,
  trialPeriodDays: number = 0,
  metadata: Record<string, string> = {}
): Promise<Stripe.Checkout.Session> {
  
  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    customer_email: customerEmail,
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: metadata,
    billing_address_collection: 'auto',
  };

  // Agregar período de prueba si se especifica
  if (trialPeriodDays > 0) {
    sessionParams.subscription_data = {
      trial_period_days: trialPeriodDays,
    };
  }

  const session = await stripe.checkout.sessions.create(sessionParams);
  return session;
}

// Función para obtener información de una suscripción
export async function getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  return await stripe.subscriptions.retrieve(subscriptionId);
}

// Función para cancelar una suscripción
export async function cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  return await stripe.subscriptions.cancel(subscriptionId);
}

// Función para verificar webhook de Stripe
export function verifyStripeWebhook(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}

// Precios predefinidos para productos comunes (en centavos)
export const PRECIOS_PRODUCTOS = {
  PREMIUM_MENSUAL: 1990000, // $19,900 COP
  PREMIUM_ANUAL: 19990000,  // $199,900 COP
  LIBRO_DIGITAL: 2990000,  // $29,900 COP
  AUDIOLIBRO: 3990000,     // $39,900 COP
  INVESTIGACION: 15000000, // $150,000 COP
  CONSULTA: 7500000,       // $75,000 COP
} as const;