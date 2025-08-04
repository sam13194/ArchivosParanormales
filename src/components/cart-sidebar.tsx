'use client';

import { useState } from 'react';
import { useCart } from '@/context/cart-context';
import { useAuth } from '@/context/auth-context';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ShoppingCart, Plus, Minus, Trash2, CreditCard, 
  MapPin, Phone, Mail, User, Building2 
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function CartSidebar() {
  const { items, removeFromCart, updateQuantity, getTotalItems, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    nombre: user?.displayName || '',
    email: user?.email || '',
    telefono: '',
    documento: '',
    direccion: '',
    ciudad: 'Bogotá',
    departamento: 'Cundinamarca'
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleCheckout = async (paymentMethod: string) => {
    if (!user) {
      alert('Debes iniciar sesión para continuar');
      return;
    }

    setIsCheckingOut(true);

    try {
      // Preparar datos para el checkout
      const checkoutData = {
        items: items.map(item => ({
          producto_id: item.id,
          nombre_producto: item.nombre,
          precio_unitario: item.precio,
          cantidad: item.cantidad
        })),
        customer_info: customerInfo,
        payment_method: paymentMethod,
        customer_uid: user.uid,
        customer_email: user.email,
        total: getTotalPrice()
      };

      const response = await fetch('/api/checkout/colombia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutData)
      });

      const result = await response.json();

      if (result.success && result.checkout_url) {
        // Redirigir a Stripe Checkout
        window.location.href = result.checkout_url;
      } else {
        throw new Error(result.error || 'Error en el checkout');
      }

    } catch (error) {
      console.error('Error en checkout:', error);
      alert('Error al procesar el pago. Inténtalo de nuevo.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const CartEmpty = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">Tu carrito está vacío</h3>
      <p className="text-muted-foreground mb-6">Agrega productos para comenzar tu compra</p>
      <Button asChild onClick={() => setIsOpen(false)}>
        <Link href="/store">Ir a la Tienda</Link>
      </Button>
    </div>
  );

  const CartItems = () => (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="flex gap-3 p-3 border rounded-lg">
          {item.imagen && (
            <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
              <Image 
                src={item.imagen} 
                alt={item.nombre}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm leading-tight">{item.nombre}</h4>
            <p className="text-xs text-muted-foreground capitalize">
              {item.tipo_producto.replace('_', ' ')}
            </p>
            <div className="flex items-center justify-between mt-2">
              <span className="font-bold text-sm">{formatCurrency(item.precio)}</span>
              
              {!item.es_suscripcion && (
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                    className="h-6 w-6 p-0"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="text-xs w-8 text-center">{item.cantidad}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                    className="h-6 w-6 p-0"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => removeFromCart(item.id)}
            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      ))}
    </div>
  );

  const CheckoutForm = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Información de Facturación</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="nombre">Nombre Completo</Label>
              <Input
                id="nombre"
                value={customerInfo.nombre}
                onChange={(e) => setCustomerInfo({...customerInfo, nombre: e.target.value})}
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <Label htmlFor="documento">Documento</Label>
              <Input
                id="documento"
                value={customerInfo.documento}
                onChange={(e) => setCustomerInfo({...customerInfo, documento: e.target.value})}
                placeholder="Cédula de ciudadanía"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={customerInfo.email}
              onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
              placeholder="tu@email.com"
            />
          </div>
          
          <div>
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              value={customerInfo.telefono}
              onChange={(e) => setCustomerInfo({...customerInfo, telefono: e.target.value})}
              placeholder="300 123 4567"
            />
          </div>
          
          <div>
            <Label htmlFor="direccion">Dirección</Label>
            <Input
              id="direccion"
              value={customerInfo.direccion}
              onChange={(e) => setCustomerInfo({...customerInfo, direccion: e.target.value})}
              placeholder="Calle 123 #45-67"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="ciudad">Ciudad</Label>
              <Input
                id="ciudad"
                value={customerInfo.ciudad}
                onChange={(e) => setCustomerInfo({...customerInfo, ciudad: e.target.value})}
                placeholder="Bogotá"
              />
            </div>
            <div>
              <Label htmlFor="departamento">Departamento</Label>
              <Input
                id="departamento"
                value={customerInfo.departamento}
                onChange={(e) => setCustomerInfo({...customerInfo, departamento: e.target.value})}
                placeholder="Cundinamarca"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Métodos de Pago</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pse" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pse">PSE</TabsTrigger>
              <TabsTrigger value="nequi">Nequi</TabsTrigger>
              <TabsTrigger value="card">Tarjeta</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pse" className="space-y-4">
              <div className="text-center py-4">
                <Building2 className="h-12 w-12 mx-auto mb-3 text-blue-600" />
                <h3 className="font-semibold">Pago con PSE</h3>
                <p className="text-sm text-muted-foreground">
                  Paga directamente desde tu banco en línea
                </p>
              </div>
              <Button 
                onClick={() => handleCheckout('pse')} 
                disabled={isCheckingOut}
                className="w-full"
                size="lg"
              >
                {isCheckingOut ? 'Procesando...' : 'Pagar con PSE'}
              </Button>
            </TabsContent>
            
            <TabsContent value="nequi" className="space-y-4">
              <div className="text-center py-4">
                <Phone className="h-12 w-12 mx-auto mb-3 text-purple-600" />
                <h3 className="font-semibold">Pago con Nequi</h3>
                <p className="text-sm text-muted-foreground">
                  Paga desde tu celular con Nequi
                </p>
              </div>
              <Button 
                onClick={() => handleCheckout('nequi')} 
                disabled={isCheckingOut}
                className="w-full bg-purple-600 hover:bg-purple-700"
                size="lg"
              >
                {isCheckingOut ? 'Procesando...' : 'Pagar con Nequi'}
              </Button>
            </TabsContent>
            
            <TabsContent value="card" className="space-y-4">
              <div className="text-center py-4">
                <CreditCard className="h-12 w-12 mx-auto mb-3 text-green-600" />
                <h3 className="font-semibold">Tarjeta de Crédito/Débito</h3>
                <p className="text-sm text-muted-foreground">
                  Visa, Mastercard, American Express
                </p>
              </div>
              <Button 
                onClick={() => handleCheckout('card')} 
                disabled={isCheckingOut}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                {isCheckingOut ? 'Procesando...' : 'Pagar con Tarjeta'}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {getTotalItems() > 0 && (
            <Badge 
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
              variant="destructive"
            >
              {getTotalItems()}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Carrito de Compras
            {getTotalItems() > 0 && (
              <Badge variant="secondary">{getTotalItems()} artículos</Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-auto py-4">
          {items.length === 0 ? <CartEmpty /> : (
            <>
              {!isCheckingOut ? (
                <>
                  <CartItems />
                  
                  <Separator className="my-6" />
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(getTotalPrice())}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>{formatCurrency(getTotalPrice())}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-6">
                    <Button variant="outline" onClick={clearCart} size="sm">
                      Vaciar
                    </Button>
                    <Button 
                      onClick={() => setIsCheckingOut(true)}
                      className="flex-1"
                      disabled={!user}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      {user ? 'Proceder al Pago' : 'Inicia Sesión'}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    onClick={() => setIsCheckingOut(false)}
                    className="mb-4"
                  >
                    ← Volver al Carrito
                  </Button>
                  <CheckoutForm />
                </>
              )}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}