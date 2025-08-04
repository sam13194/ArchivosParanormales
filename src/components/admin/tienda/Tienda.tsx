'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

export default function Tienda() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <ShoppingCart className="h-6 w-6" />
          Gestión de Tienda
        </h2>
        <p className="text-muted-foreground">Administra productos, pedidos y pagos</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tienda</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Este módulo estará disponible próximamente. Aquí podrás gestionar la tienda online.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}