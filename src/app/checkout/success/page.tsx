'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get('session_id');
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      // Aquí podrías hacer una llamada a tu API para obtener detalles de la orden
      // Por ahora simulamos datos
      setTimeout(() => {
        setOrderDetails({
          numero_orden: 'ORD-' + Date.now(),
          producto: 'Archivos Premium Mensual',
          precio: 19900,
          tipo: 'suscripcion_mensual'
        });
        setLoading(false);
      }, 1000);
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="container mx-auto py-12 text-center">
        <p>Verificando tu compra...</p>
      </div>
    );
  }

  if (!sessionId || !orderDetails) {
    return (
      <div className="container mx-auto py-12 text-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6">
            <p className="text-muted-foreground">
              No se encontró información de la compra.
            </p>
            <Button asChild className="mt-4">
              <Link href="/store">Volver a la Tienda</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header de éxito */}
        <Card className="text-center bg-green-50 border-green-200">
          <CardContent className="p-8">
            <div className="mb-6">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
            </div>
            <h1 className="text-3xl font-bold text-green-800 mb-2">
              ¡Compra Exitosa!
            </h1>
            <p className="text-green-700">
              Tu pago ha sido procesado correctamente
            </p>
          </CardContent>
        </Card>

        {/* Detalles de la orden */}
        <Card>
          <CardHeader>
            <CardTitle>Detalles de tu Compra</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Número de Orden</p>
                <p className="font-mono">{orderDetails.numero_orden}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Producto</p>
                <p className="font-medium">{orderDetails.producto}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Total Pagado</p>
                <p className="font-bold text-lg">
                  {new Intl.NumberFormat('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                    minimumFractionDigits: 0
                  }).format(orderDetails.precio)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Estado</p>
                <p className="text-green-600 font-medium">Completado</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Próximos pasos */}
        <Card>
          <CardHeader>
            <CardTitle>¿Qué sigue ahora?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {orderDetails.tipo === 'suscripcion_mensual' || orderDetails.tipo === 'suscripcion_anual' ? (
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-800">Tu suscripción está activa</p>
                    <p className="text-sm text-blue-700">
                      Ya puedes acceder a todo el contenido premium desde tu perfil.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                  <Mail className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-purple-800">Revisa tu email</p>
                    <p className="text-sm text-purple-700">
                      Te hemos enviado los detalles de tu suscripción y cómo acceder al contenido.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                  <Download className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-800">Descarga disponible</p>
                    <p className="text-sm text-green-700">
                      Tu producto digital está listo para descargar desde tu perfil.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild>
                <Link href="/profile">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Ir a Mi Portal
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">Volver al Inicio</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Soporte */}
        <Card className="bg-gray-50">
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold mb-2">¿Necesitas ayuda?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Si tienes algún problema con tu compra o no recibes el contenido, 
              no dudes en contactarnos.
            </p>
            <Button variant="outline" size="sm">
              Contactar Soporte
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}