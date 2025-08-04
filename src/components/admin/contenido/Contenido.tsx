'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function Contenido() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="h-6 w-6" />
          Gestión de Contenido
        </h2>
        <p className="text-muted-foreground">Administra historias, categorías y etiquetas</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contenido</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Este módulo estará disponible próximamente. Aquí podrás gestionar todo el contenido del sitio.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}