'use client';

import { useState } from 'react';
import { useCart } from '@/context/cart-context';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ShoppingCart, Star, Crown, BookOpen, Headphones, 
  Zap, Check, Gift, Sparkles, Timer, Users, Clock, AlertCircle
} from "lucide-react";

// Mock data de productos
const productos = {
  suscripciones: [
    {
      id: 1,
      nombre: "Archivos Premium Mensual",
      descripcion: "Acceso completo a todo el contenido premium",
      precio: 19900,
      precio_usd: 4.99,
      periodo: "monthly",
      trial_dias: 7,
      caracteristicas: [
        "Historias exclusivas premium",
        "Sin anuncios en toda la plataforma",
        "Descargas ilimitadas offline", 
        "Acceso anticipado a nuevos episodios",
        "Audio en alta calidad (320kbps)",
        "Foro de miembros exclusivo",
        "Notificaciones prioritarias",
        "Soporte técnico prioritario"
      ],
      popular: true,
      descuento: null
    },
    {
      id: 2,
      nombre: "Archivos Premium Anual",
      descripcion: "Suscripción anual con 2 meses gratis",
      precio: 199900,
      precio_original: 238800,
      precio_usd: 49.99,
      periodo: "yearly",
      trial_dias: 7,
      caracteristicas: [
        "Todo lo del plan mensual",
        "2 meses gratis (17% descuento)",
        "Libro digital exclusivo anual",
        "Acceso a archivo histórico completo",
        "Biblioteca de efectos de sonido",
        "Merchandising exclusivo",
        "Wallpapers y fondos HD",
        "Participación en eventos exclusivos"
      ],
      popular: false,
      descuento: "17% OFF"
    }
  ],
  productos_digitales: [
    {
      id: 3,
      nombre: "Fantasmas de Colombia",
      descripcion: "Libro digital con 20 historias verificadas",
      precio: 29900,
      precio_usd: 7.99,
      tipo: "libro_digital",
      imagen: "https://i.postimg.cc/KvR77QVS/image-6.png",
      rating: 4.8,
      reviews: 47,
      caracteristicas: [
        "20 historias investigadas",
        "Fotografías exclusivas",
        "Mapas de ubicaciones",
        "Testimonios completos",
        "Formato PDF y EPUB"
      ]
    },
    {
      id: 4,
      nombre: "Audiolibro: Misterios de Medianoche",
      descripcion: "Compilation de las mejores historias narradas",
      precio: 39900,
      precio_usd: 9.99,
      tipo: "audiolibro",
      imagen: "https://i.postimg.cc/BQLZB1Bw/image-4.png",
      rating: 4.9,
      reviews: 73,
      caracteristicas: [
        "12 horas de contenido",
        "Narración profesional",
        "Efectos de sonido inmersivos",
        "Descarga sin DRM",
        "Formatos MP3 y M4A"
      ]
    }
  ],
  servicios: [
    {
      id: 5,
      nombre: "Investigación Personalizada",
      descripcion: "Investigamos tu caso paranormal",
      precio: 150000,
      precio_usd: 39.99,
      tipo: "servicio",
      caracteristicas: [
        "Entrevista inicial de 1 hora",
        "Investigación de antecedentes",
        "Reporte detallado",
        "Recomendaciones específicas",
        "Seguimiento por 30 días"
      ],
      tiempo_entrega: "7-14 días"
    },
    {
      id: 6,
      nombre: "Consulta Paranormal",
      descripcion: "Sesión de consulta con expertos",
      precio: 75000,
      precio_usd: 19.99,
      tipo: "servicio",
      caracteristicas: [
        "Videollamada de 45 minutos",
        "Análisis de evidencias",
        "Consejos especializados",
        "Material de apoyo",
        "Grabación de la sesión"
      ],
      tiempo_entrega: "Inmediato"
    }
  ]
};

export default function StorePage() {
  const { addToCart, isInCart, getTotalItems } = useCart();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const agregarAlCarrito = (producto: any, tipo: string) => {
    const cartItem = {
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      precio_usd: producto.precio_usd,
      tipo_producto: tipo === 'suscripciones' ? producto.periodo : producto.tipo,
      imagen: producto.imagen,
      es_suscripcion: tipo === 'suscripciones'
    };
    addToCart(cartItem);
  };

  const ProductCard = ({ producto, tipo }: { producto: any, tipo: string }) => (
    <Card className="relative h-full flex flex-col">
      {producto.popular && (
        <Badge className="absolute -top-2 left-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <Sparkles className="h-3 w-3 mr-1" />
          Más Popular
        </Badge>
      )}
      {producto.descuento && (
        <Badge className="absolute -top-2 right-4 bg-red-500 text-white">
          {producto.descuento}
        </Badge>
      )}

      <CardHeader className="pb-4">
        {producto.imagen && (
          <div className="w-full h-48 bg-gray-100 rounded-lg mb-4 overflow-hidden">
            <img 
              src={producto.imagen} 
              alt={producto.nombre}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="space-y-2">
          <CardTitle className="text-xl">{producto.nombre}</CardTitle>
          <p className="text-muted-foreground text-sm">{producto.descripcion}</p>
          
          {producto.rating && (
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < Math.floor(producto.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {producto.rating} ({producto.reviews} reviews)
              </span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 space-y-4">
          {/* Precio */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{formatCurrency(producto.precio)}</span>
              {producto.precio_original && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatCurrency(producto.precio_original)}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              USD ${producto.precio_usd} {producto.periodo === 'monthly' && '/ mes'} {producto.periodo === 'yearly' && '/ año'}
            </p>
          </div>

          {/* Características */}
          <div className="space-y-2">
            {producto.caracteristicas.map((caracteristica: string, index: number) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>{caracteristica}</span>
              </div>
            ))}
          </div>

          {producto.tiempo_entrega && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Timer className="h-4 w-4" />
              Entrega: {producto.tiempo_entrega}
            </div>
          )}
        </div>

        {/* Botón de compra */}
        <Button 
          onClick={() => agregarAlCarrito(producto, tipo)}
          className="w-full mt-6"
          size="lg"
          variant={isInCart(producto.id) ? "secondary" : "default"}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {isInCart(producto.id) ? 'En el Carrito' : 
            (tipo === 'suscripciones' ? 'Agregar Suscripción' : 'Agregar al Carrito')}
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto py-12 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="font-headline text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Tienda Paranormal
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Accede a contenido exclusivo, libros digitales, audiolibros y servicios especializados 
            en investigación paranormal. Tu pasaporte al mundo de lo inexplicable.
          </p>
          
          {getTotalItems() > 0 && (
            <div className="flex justify-center">
              <Badge variant="secondary" className="px-4 py-2">
                <ShoppingCart className="h-4 w-4 mr-2" />
                {getTotalItems()} producto{getTotalItems() !== 1 ? 's' : ''} en el carrito
              </Badge>
            </div>
          )}
        </div>

        {/* Tabs de productos */}
        <Tabs defaultValue="suscripciones" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="suscripciones" className="flex items-center gap-2">
              <Crown className="h-4 w-4" />
              Premium
            </TabsTrigger>
            <TabsTrigger value="digitales" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Digital
            </TabsTrigger>
            <TabsTrigger value="servicios" className="flex items-center gap-2" disabled>
              <Clock className="h-4 w-4" />
              Próximamente
            </TabsTrigger>
          </TabsList>

          {/* Suscripciones Premium */}
          <TabsContent value="suscripciones" className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">Suscripciones Premium</h2>
              <p className="text-muted-foreground">
                Acceso ilimitado a todo nuestro contenido exclusivo
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {productos.suscripciones.map((producto) => (
                <ProductCard key={producto.id} producto={producto} tipo="suscripciones" />
              ))}
            </div>

            {/* Garantía */}
            <Card className="max-w-3xl mx-auto bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Check className="h-6 w-6 text-green-600" />
                  <h3 className="text-lg font-semibold">Garantía de 30 días</h3>
                </div>
                <p className="text-muted-foreground">
                  Si no estás completamente satisfecho con tu suscripción, 
                  te devolvemos el 100% de tu dinero sin preguntas.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Productos Digitales */}
          <TabsContent value="digitales" className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">Productos Digitales</h2>
              <p className="text-muted-foreground">
                Libros, audiolibros y contenido exclusivo para descargar
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {productos.productos_digitales.map((producto) => (
                <ProductCard key={producto.id} producto={producto} tipo="digitales" />
              ))}
            </div>
          </TabsContent>

          {/* Servicios - Próximamente */}
          <TabsContent value="servicios" className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold flex items-center justify-center gap-3">
                <Clock className="h-8 w-8 text-orange-500" />
                Servicios Próximamente
              </h2>
              <p className="text-muted-foreground">
                Estamos preparando servicios especializados increíbles para ti
              </p>
            </div>
            
            {/* Encuesta de Interés */}
            <Card className="max-w-2xl mx-auto bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
              <CardContent className="p-8">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    <AlertCircle className="h-6 w-6 text-orange-600" />
                    <h3 className="text-xl font-semibold">¡Ayúdanos a crear los mejores servicios!</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Queremos conocer tu interés en servicios personalizados de investigación paranormal
                  </p>
                  
                  <div className="space-y-4 text-left">
                    <div className="space-y-3">
                      <p className="font-medium">¿Qué servicios te interesan más?</p>
                      <div className="space-y-2 text-sm">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" />
                          <span>Investigación de casos personales (¿Cuánto pagarías? $50,000 - $200,000)</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" />
                          <span>Consultas paranormales en vivo (¿Cuánto pagarías? $30,000 - $100,000)</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" />
                          <span>Análisis de evidencias (fotos/videos) (¿Cuánto pagarías? $20,000 - $80,000)</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" />
                          <span>Visitas de investigación presencial (¿Cuánto pagarías? $300,000 - $800,000)</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" />
                          <span>Talleres de investigación paranormal (¿Cuánto pagarías? $100,000 - $250,000)</span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block font-medium">Tu email para notificarte cuando estén listos:</label>
                      <input 
                        type="email" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500" 
                        placeholder="tu@email.com"
                      />
                    </div>
                    
                    <Button className="w-full bg-orange-600 hover:bg-orange-700">
                      Enviar Mi Interés
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vista previa de servicios futuros */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto opacity-60">
              <Card className="relative">
                <div className="absolute inset-0 bg-gray-100/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <Badge className="bg-orange-500 text-white px-4 py-2">
                    Próximamente
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">Investigación Personalizada</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Investigamos tu caso paranormal con métodos científicos y especializados
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Entrevista inicial de 1 hora</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Investigación de antecedentes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Reporte detallado</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="relative">
                <div className="absolute inset-0 bg-gray-100/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <Badge className="bg-orange-500 text-white px-4 py-2">
                    Próximamente
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">Consulta Paranormal</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Sesión en vivo con nuestros expertos certificados
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Videollamada de 45 minutos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Análisis de evidencias</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Consejos especializados</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Testimonios */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold text-center">Lo que dicen nuestros clientes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                nombre: "María González",
                rating: 5,
                comentario: "El contenido premium vale cada peso. Las historias exclusivas son increíbles.",
                plan: "Premium Anual"
              },
              {
                nombre: "Carlos Ruiz",
                rating: 5,
                comentario: "La investigación personalizada superó mis expectativas. Muy profesional.",
                plan: "Investigación"
              },
              {
                nombre: "Ana López",
                rating: 5,
                comentario: "El libro 'Fantasmas de Colombia' está muy bien investigado. Lo recomiendo.",
                plan: "Libro Digital"
              }
            ].map((testimonio, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-1">
                      {[...Array(testimonio.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm italic">"{testimonio.comentario}"</p>
                    <div>
                      <p className="font-medium text-sm">{testimonio.nombre}</p>
                      <p className="text-xs text-muted-foreground">Cliente {testimonio.plan}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Final */}
        <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">¿Listo para explorar lo inexplicable?</h2>
            <p className="text-lg mb-6 opacity-90">
              Únete a miles de usuarios que ya disfrutan del contenido premium de Archivos Paranormales
            </p>
            <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
              <Crown className="h-5 w-5 mr-2" />
              Explorar Productos Premium
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}